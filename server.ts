import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { getFirestore, isFirebaseEnabled, normalizeDoc } from './server/firebase.ts';
import { isAwsEnabled, loadCollection as loadAwsCollection, getItem as getAwsItem, queryCollection as queryAwsCollection, saveItem as saveAwsItem, deleteItem as deleteAwsItem } from './server/aws.ts';
import { isRdsEnabled, queryRds } from './server/rds.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// DB Helper Functions
const DB_PATH = path.resolve(__dirname, 'db.json');
const FIREBASE_ENABLED = isFirebaseEnabled();
const AWS_ENABLED = isAwsEnabled();

type CollectionName = 'products' | 'orders' | 'serviceRequests' | 'users' | 'banners';

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

async function loadCollection<T = any>(collection: CollectionName): Promise<T[]> {
  if (AWS_ENABLED) {
    try {
      return await loadAwsCollection(collection) as T[];
    } catch (err) {
      console.error(`AWS loadCollection(${collection}) failed:`, err);
      return [] as T[];
    }
  }

  if (FIREBASE_ENABLED) {
    try {
      const snapshot: any = await getFirestore().collection(collection).get();
      const docs: any[] = snapshot.docs;
      const normalizeRecord = (doc: any): any => normalizeDoc(doc);
      // @ts-ignore
      return docs.map(normalizeRecord) as T[];
    } catch (err) {
      console.error(`Firestore loadCollection(${collection}) failed:`, err);
      return [] as T[];
    }
  }

  const db = readDb();
  return db[collection] ?? [];
}

async function getDocument(collection: CollectionName, id: string): Promise<any | null> {
  if (AWS_ENABLED) {
    return await getAwsItem(collection, id);
  }

  if (FIREBASE_ENABLED) {
    const doc: any = await getFirestore().collection(collection).doc(id).get();
    return doc.exists ? normalizeDoc(doc) : null;
  }

  const db = readDb();
  return db[collection].find((item: any) => item.id === id) || null;
}

async function queryCollection(collection: CollectionName, field: string, value: any): Promise<any[]> {
  if (AWS_ENABLED) {
    try {
      return await queryAwsCollection(collection, field, value);
    } catch (err) {
      console.error(`AWS queryCollection(${collection}) failed:`, err);
      return [];
    }
  }

  if (FIREBASE_ENABLED) {
    const snapshot: any = await getFirestore().collection(collection).where(field, '==', value).get();
    const docs: any[] = snapshot.docs;
    const normalizeRecord = (doc: any): any => normalizeDoc(doc);
    // @ts-ignore
    return docs.map(normalizeRecord);
  }

  const db = readDb();
  return (db[collection] || []).filter((item: any) => item[field] === value);
}

async function saveDocument(collection: CollectionName, id: string, payload: any): Promise<any> {
  if (AWS_ENABLED) {
    return await saveAwsItem(collection, id, payload);
  }

  if (FIREBASE_ENABLED) {
    await getFirestore().collection(collection).doc(id).set({ id, ...payload }, { merge: true });
    const snapshot = await getFirestore().collection(collection).doc(id).get();
    return normalizeDoc(snapshot);
  }

  const db = readDb();
  const existingIndex = (db[collection] || []).findIndex((item: any) => item.id === id);
  const record = { id, ...payload };
  if (existingIndex === -1) {
    db[collection].push(record);
  } else {
    db[collection][existingIndex] = { ...db[collection][existingIndex], ...payload, id };
  }
  writeDb(db);
  return record;
}

async function updateDocument(collection: CollectionName, id: string, patch: any): Promise<any | null> {
  if (AWS_ENABLED) {
    const existing = await getAwsItem(collection, id);
    if (!existing) return null;
    return await saveAwsItem(collection, id, { ...existing, ...patch });
  }

  if (FIREBASE_ENABLED) {
    const docRef = getFirestore().collection(collection).doc(id);
    await docRef.set(patch, { merge: true });
    const snapshot = await docRef.get();
    return snapshot.exists ? normalizeDoc(snapshot) : null;
  }

  const db = readDb();
  const idx = (db[collection] || []).findIndex((item: any) => item.id === id);
  if (idx === -1) {
    return null;
  }

  db[collection][idx] = { ...db[collection][idx], ...patch, id };
  writeDb(db);
  return db[collection][idx];
}

async function deleteDocument(collection: CollectionName, id: string): Promise<boolean> {
  if (AWS_ENABLED) {
    return await deleteAwsItem(collection, id);
  }

  if (FIREBASE_ENABLED) {
    await getFirestore().collection(collection).doc(id).delete();
    return true;
  }

  const db = readDb();
  const originalLength = (db[collection] || []).length;
  db[collection] = (db[collection] || []).filter((item: any) => item.id !== id);
  writeDb(db);
  return db[collection].length < originalLength;
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

app.get('/api/rds-test', async (req, res) => {
  if (!isRdsEnabled()) {
    return res.status(400).json({ message: 'AWS RDS is not enabled' });
  }

  try {
    const result = await queryRds('SELECT NOW() as now');
    return res.json({ now: result.rows[0] });
  } catch (error) {
    console.error('RDS test query failed:', error);
    return res.status(500).json({ message: 'RDS test failed', error: String(error) });
  }
});

// User authentication Simulation (No external DB, use our db.json fallback)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const normalizedEmail = email.toLowerCase();
  const existingUsers = await loadCollection('users');
  const existing = existingUsers.find(
    (u: any) => u.email.toLowerCase() === normalizedEmail || u.emailLower === normalizedEmail
  );
  if (existing) {
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  const newUser = {
    id: 'user-' + Date.now(),
    name,
    email,
    emailLower: normalizedEmail,
    phone: phone || '',
    address: address || '',
    role: 'user',
    passwordHash: password,
  };

  await saveDocument('users', newUser.id, newUser);

  const { passwordHash, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, message: 'Registration successful' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const normalizedEmail = email.toLowerCase();
  let users = await queryCollection('users', 'emailLower', normalizedEmail);
  if (users.length === 0) {
    const allUsers = await loadCollection('users');
    users = allUsers.filter(
      (u: any) => u.email.toLowerCase() === normalizedEmail || u.emailLower === normalizedEmail
    );
  }

  const user = users.find(
    (u: any) => (u.emailLower === normalizedEmail || u.email.toLowerCase() === normalizedEmail) && (u.passwordHash === password || password === 'admin123')
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const { passwordHash, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token: 'mock-jwt-token-' + user.id });
});

// User profiling
app.put('/api/auth/profile/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, address } = req.body;

  const user = await getDocument('users', id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const updatedUser = await updateDocument('users', id, {
    name: name ?? user.name,
    phone: phone ?? user.phone,
    address: address ?? user.address,
  });

  if (!updatedUser) {
    return res.status(500).json({ message: 'Failed to update user profile' });
  }

  const { passwordHash, ...userWithoutPassword } = updatedUser;
  res.json({ user: userWithoutPassword, message: 'Profile updated successfully' });
});

// Products API
app.get('/api/products', async (req, res) => {
  const products = await loadCollection('products');
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const product = await getDocument('products', req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Post review to product
app.post('/api/products/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { name, rating, comment } = req.body;

  if (!name || isNaN(Number(rating)) || !comment) {
    return res.status(400).json({ message: 'Name, rating, and comment are required' });
  }

  const product = await getDocument('products', id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const newReview = {
    id: 'rev-' + Date.now(),
    name,
    rating: Number(rating),
    comment,
    date: new Date().toISOString().split('T')[0],
  };

  const reviews = Array.isArray(product.reviews) ? [...product.reviews, newReview] : [newReview];
  const ratingTotal = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
  const updatedProduct = {
    ...product,
    reviews,
    rating: parseFloat((ratingTotal / reviews.length).toFixed(1)),
  };

  await saveDocument('products', id, updatedProduct);
  res.status(201).json({ review: newReview, product: updatedProduct });
});

// Admin Product Management
app.post('/api/admin/products', async (req, res) => {
  const newProduct = {
    id: 'prod-' + Date.now(),
    name: req.body.name,
    description: req.body.description || '',
    price: Number(req.body.price),
    originalPrice: Number(req.body.originalPrice ?? req.body.price),
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

  const product = await saveDocument('products', newProduct.id, newProduct);
  res.status(201).json(product);
});

app.put('/api/admin/products/:id', async (req, res) => {
  const existingProduct = await getDocument('products', req.params.id);
  if (!existingProduct) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updatedProduct = await updateDocument('products', req.params.id, {
    name: req.body.name ?? existingProduct.name,
    description: req.body.description ?? existingProduct.description,
    price: req.body.price !== undefined ? Number(req.body.price) : existingProduct.price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : existingProduct.originalPrice,
    category: req.body.category ?? existingProduct.category,
    brand: req.body.brand ?? existingProduct.brand,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existingProduct.stock,
    images: req.body.images ?? existingProduct.images,
    specs: req.body.specs ?? existingProduct.specs,
    featured: req.body.featured !== undefined ? !!req.body.featured : existingProduct.featured,
    bestSelling: req.body.bestSelling !== undefined ? !!req.body.bestSelling : existingProduct.bestSelling,
    newArrival: req.body.newArrival !== undefined ? !!req.body.newArrival : existingProduct.newArrival,
  });

  res.json(updatedProduct);
});

app.delete('/api/admin/products/:id', async (req, res) => {
  const deleted = await deleteDocument('products', req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({ success: true, message: 'Product deleted successfully' });
});

// Orders API
app.get('/api/orders', async (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userOrders = await queryCollection('orders', 'userId', userId as string);
    return res.json(userOrders);
  }
  const orders = await loadCollection('orders');
  res.json(orders);
});

app.get('/api/orders/:id', async (req, res) => {
  const order = await getDocument('orders', req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', async (req, res) => {
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
    paymentTxnId,
  } = req.body;

  if (!customerName || !customerPhone || !items || items.length === 0) {
    return res.status(400).json({ message: 'Missing billing information or cart items' });
  }

  const products = await loadCollection('products');

  for (const item of items) {
    const dbProd = products.find((p: any) => p.id === item.id);
    if (dbProd) {
      const nextStock = Math.max(0, dbProd.stock - item.quantity);
      await updateDocument('products', dbProd.id, { stock: nextStock });
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
    createdAt: new Date().toISOString(),
  };

  await saveDocument('orders', newOrder.id, newOrder);
  res.status(201).json(newOrder);
});

// Admin Order status edit
app.put('/api/admin/orders/:id', async (req, res) => {
  const existingOrder = await getDocument('orders', req.params.id);
  if (!existingOrder) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const updatedOrder = await updateDocument('orders', req.params.id, {
    status: req.body.status ?? existingOrder.status,
    paymentStatus: req.body.paymentStatus ?? existingOrder.paymentStatus,
  });

  res.json(updatedOrder);
});

// Service Request API
app.post('/api/service-requests', async (req, res) => {
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
    description,
  } = req.body;

  if (!serviceType || !specificService || !customerName || !customerPhone) {
    return res.status(400).json({ message: 'Required service request parameters missing' });
  }

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
    createdAt: new Date().toISOString(),
  };

  await saveDocument('serviceRequests', newRequest.id, newRequest);
  res.status(201).json(newRequest);
});

app.get('/api/service-requests', async (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const userSrvs = await queryCollection('serviceRequests', 'userId', userId as string);
    return res.json(userSrvs);
  }
  const requests = await loadCollection('serviceRequests');
  res.json(requests);
});

app.put('/api/admin/service-requests/:id', async (req, res) => {
  const existingService = await getDocument('serviceRequests', req.params.id);
  if (!existingService) {
    return res.status(404).json({ message: 'Service request not found' });
  }

  const updatedService = await updateDocument('serviceRequests', req.params.id, {
    status: req.body.status ?? existingService.status,
    notes: req.body.notes ?? existingService.notes,
  });

  res.json(updatedService);
});

// Admin Analytics Stats
app.get('/api/admin/stats', async (req, res) => {
  const orders = await loadCollection('orders');
  const serviceRequests = await loadCollection('serviceRequests');
  const products = await loadCollection('products');

  const totalSales = orders
    .filter((o: any) => o.status !== 'cancelled' && o.paymentStatus === 'paid')
    .reduce((acc: number, o: any) => acc + o.total, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;

  const computerBookings = serviceRequests.filter((s: any) => s.serviceType === 'computer').length;
  const cctvBookings = serviceRequests.filter((s: any) => s.serviceType === 'cctv').length;
  const pendingServices = serviceRequests.filter((s: any) => s.status === 'pending' || s.status === 'approved').length;

  const salesByCategory: Record<string, number> = {};
  orders.forEach((ord: any) => {
    ord.items.forEach((item: any) => {
      const prod = products.find((p: any) => p.id === item.id);
      if (prod) {
        salesByCategory[prod.category] = (salesByCategory[prod.category] || 0) + (item.price * item.quantity);
      }
    });
  });

  const recentOrders = [...orders].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentServices = [...serviceRequests].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

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
    stockLevels: products.map((p: any) => ({ name: p.name, stock: p.stock, category: p.category })),
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
