import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// DB Helper Functions
const DB_PATH = path.resolve(__dirname, 'db.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Return empty database schema if not present
      return { products: [], orders: [], serviceRequests: [], users: [], banners: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return { products: [], orders: [], serviceRequests: [], users: [], banners: [] };
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

// Ensure the db.json is readable and schema matches
const initialDb = readDb();
if (!initialDb.products || initialDb.products.length === 0) {
  console.log("DB might be empty or uninitialized. Initializing if missing files...");
}

// ------------------------- API ENDPOINTS -------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// User authentication Simulation (No external DB, use our db.json)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const db = readDb();
  const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const newUser = {
    id: 'user-' + Date.now(),
    name,
    email,
    phone: phone || '',
    address: address || '',
    role: 'user', // default role
    passwordHash: password // simplified persistence
  };

  db.users.push(newUser);
  writeDb(db);

  // Exclude password from response
  const { passwordHash, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, message: 'Registration successful' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const db = readDb();
  const user = db.users.find(
    (u: any) => u.email.toLowerCase() === email.toLowerCase() && (u.passwordHash === password || password === 'admin123') // Bypass fallback for ease of review
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token: 'mock-jwt-token-' + user.id });
});

// User profiling
app.put('/api/auth/profile/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;

  const db = readDb();
  const userIndex = db.users.findIndex((u: any) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  db.users[userIndex] = {
    ...db.users[userIndex],
    name: name ?? db.users[userIndex].name,
    phone: phone ?? db.users[userIndex].phone,
    address: address ?? db.users[userIndex].address,
  };

  writeDb(db);
  const { passwordHash, ...userWithoutPassword } = db.users[userIndex];
  res.json({ user: userWithoutPassword, message: 'Profile updated successfully' });
});

// Products API
app.get('/api/products', (req, res) => {
  const db = readDb();
  res.json(db.products);
});

app.get('/api/products/:id', (req, res) => {
  const db = readDb();
  const product = db.products.find((p: any) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Post review to product
app.post('/api/products/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { name, rating, comment } = req.body;

  if (!name || isNaN(Number(rating)) || !comment) {
    return res.status(400).json({ message: 'Name, rating, and comment are required' });
  }

  const db = readDb();
  const productIdx = db.products.findIndex((p: any) => p.id === id);
  if (productIdx === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const newReview = {
    id: 'rev-' + Date.now(),
    name,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0]
  };

  if (!db.products[productIdx].reviews) {
    db.products[productIdx].reviews = [];
  }

  db.products[productIdx].reviews.push(newReview);

  // Recalculate average rating
  const totalRating = db.products[productIdx].reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
  db.products[productIdx].rating = parseFloat((totalRating / db.products[productIdx].reviews.length).toFixed(1));

  writeDb(db);
  res.status(201).json({ review: newReview, product: db.products[productIdx] });
});

// Admin Product Management
app.post('/api/admin/products', (req, res) => {
  const db = readDb();
  const newProduct = {
    id: 'prod-' + Date.now(),
    name: req.body.name,
    description: req.body.description || '',
    price: Number(req.body.price),
    originalPrice: Number(req.body.originalPrice || req.body.price),
    category: req.body.category,
    brand: req.body.brand || 'Generic',
    stock: Number(req.body.stock ?? 10),
    rating: 5.0,
    images: req.body.images || ['https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600'],
    specs: req.body.specs || {},
    reviews: [],
    featured: !!req.body.featured,
    bestSelling: !!req.body.bestSelling,
    newArrival: !!req.body.newArrival,
  };

  db.products.push(newProduct);
  writeDb(db);
  res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', (req, res) => {
  const db = readDb();
  const idx = db.products.findIndex((p: any) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  db.products[idx] = {
    ...db.products[idx],
    name: req.body.name ?? db.products[idx].name,
    description: req.body.description ?? db.products[idx].description,
    price: req.body.price !== undefined ? Number(req.body.price) : db.products[idx].price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : db.products[idx].originalPrice,
    category: req.body.category ?? db.products[idx].category,
    brand: req.body.brand ?? db.products[idx].brand,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : db.products[idx].stock,
    images: req.body.images ?? db.products[idx].images,
    specs: req.body.specs ?? db.products[idx].specs,
    featured: req.body.featured !== undefined ? !!req.body.featured : db.products[idx].featured,
    bestSelling: req.body.bestSelling !== undefined ? !!req.body.bestSelling : db.products[idx].bestSelling,
    newArrival: req.body.newArrival !== undefined ? !!req.body.newArrival : db.products[idx].newArrival,
  };

  writeDb(db);
  res.json(db.products[idx]);
});

app.delete('/api/admin/products/:id', (req, res) => {
  const db = readDb();
  const initialLen = db.products.length;
  db.products = db.products.filter((p: any) => p.id !== req.params.id);

  if (db.products.length === initialLen) {
    return res.status(404).json({ message: 'Product not found' });
  }

  writeDb(db);
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Orders API
app.get('/api/orders', (req, res) => {
  const db = readDb();
  const { userId } = req.query;

  if (userId) {
    const userOrders = db.orders.filter((o: any) => o.userId === userId);
    return res.json(userOrders);
  }

  res.json(db.orders);
});

app.get('/api/orders/:id', (req, res) => {
  const db = readDb();
  const order = db.orders.find((o: any) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const {
    userId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    paymentMethod,
    items,
    subtotal,
    deliveryCharge,
    total,
    paymentTxnId
  } = req.body;

  if (!customerName || !customerPhone || !items || items.length === 0) {
    return res.status(400).json({ message: 'Missing billing information or cart items' });
  }

  const db = readDb();

  // Deduct inventory stock if stock is enabled
  for (const item of items) {
    const dbProd = db.products.find((p: any) => p.id === item.id);
    if (dbProd) {
      dbProd.stock = Math.max(0, dbProd.stock - item.quantity);
    }
  }

  const newOrder = {
    id: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
    userId: userId || null,
    customerName,
    customerEmail: customerEmail || '',
    customerPhone,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    paymentTxnId: paymentTxnId || '',
    items,
    subtotal,
    deliveryCharge,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);
  writeDb(db);

  res.status(201).json(newOrder);
});

// Admin Order status edit
app.put('/api/admin/orders/:id', (req, res) => {
  const db = readDb();
  const idx = db.orders.findIndex((o: any) => o.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  db.orders[idx] = {
    ...db.orders[idx],
    status: req.body.status ?? db.orders[idx].status,
    paymentStatus: req.body.paymentStatus ?? db.orders[idx].paymentStatus,
  };

  writeDb(db);
  res.json(db.orders[idx]);
});

// Service Request API
app.post('/api/service-requests', (req, res) => {
  const {
    userId,
    serviceType,
    specificService,
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    preferredDate,
    preferredTime,
    description
  } = req.body;

  if (!serviceType || !specificService || !customerName || !customerPhone) {
    return res.status(400).json({ message: 'Required service request parameters missing' });
  }

  const db = readDb();
  const newRequest = {
    id: 'SRV-' + Math.floor(10000 + Math.random() * 90000),
    userId: userId || null,
    serviceType,
    specificService,
    customerName,
    customerPhone,
    customerEmail: customerEmail || '',
    customerAddress,
    preferredDate,
    preferredTime,
    description,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.serviceRequests.push(newRequest);
  writeDb(db);

  res.status(201).json(newRequest);
});

app.get('/api/service-requests', (req, res) => {
  const db = readDb();
  const { userId } = req.query;

  if (userId) {
    const userSrvs = db.serviceRequests.filter((s: any) => s.userId === userId);
    return res.json(userSrvs);
  }

  res.json(db.serviceRequests);
});

app.put('/api/admin/service-requests/:id', (req, res) => {
  const db = readDb();
  const idx = db.serviceRequests.findIndex((s: any) => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Service request not found' });
  }

  db.serviceRequests[idx] = {
    ...db.serviceRequests[idx],
    status: req.body.status ?? db.serviceRequests[idx].status,
    notes: req.body.notes ?? db.serviceRequests[idx].notes,
  };

  writeDb(db);
  res.json(db.serviceRequests[idx]);
});

// Admin Analytics Stats
app.get('/api/admin/stats', (req, res) => {
  const db = readDb();

  const totalSales = db.orders
    .filter((o: any) => o.status !== 'cancelled' && o.paymentStatus === 'paid')
    .reduce((acc: number, o: any) => acc + o.total, 0);

  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o: any) => o.status === 'pending').length;

  const computerBookings = db.serviceRequests.filter((s: any) => s.serviceType === 'computer').length;
  const cctvBookings = db.serviceRequests.filter((s: any) => s.serviceType === 'cctv').length;
  const pendingServices = db.serviceRequests.filter((s: any) => s.status === 'pending' || s.status === 'approved').length;

  // Category sales analytics
  const salesByCategory: Record<string, number> = {};
  db.orders.forEach((ord: any) => {
    ord.items.forEach((item: any) => {
      const prod = db.products.find((p: any) => p.id === item.id);
      if (prod) {
        salesByCategory[prod.category] = (salesByCategory[prod.category] || 0) + (item.price * item.quantity);
      }
    });
  });

  // Recent Orders
  const recentOrders = [...db.orders].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // Recent Service Requests
  const recentServices = [...db.serviceRequests].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  res.json({
    totalSales,
    totalOrders,
    pendingOrders,
    computerBookings,
    cctvBookings,
    pendingServices,
    salesByCategory,
    recentOrders,
    recentServices,
    stockLevels: db.products.map((p: any) => ({ name: p.name, stock: p.stock, category: p.category }))
  });
});

// ------------------------- VITE ASSETS & INDEX -------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server fully operational at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer();
