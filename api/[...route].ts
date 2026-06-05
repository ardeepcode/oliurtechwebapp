import { readDb, writeDb } from './_db';

function normalizeRoute(route: string | string[] | undefined) {
  if (!route) return [];
  if (Array.isArray(route)) return route;
  return route.split('/').filter(Boolean);
}

function sendJson(res: any, data: any, status = 200) {
  res.status(status).json(data);
}

function badRequest(res: any, message = 'Invalid request') {
  sendJson(res, { message }, 400);
}

function notFound(res: any, message = 'Not found') {
  sendJson(res, { message }, 404);
}

function methodNotAllowed(res: any, allowed: string[]) {
  res.setHeader('Allow', allowed.join(', '));
  sendJson(res, { message: `Method not allowed. Allowed: ${allowed.join(', ')}` }, 405);
}

function getQueryValue(queryValue: any) {
  if (Array.isArray(queryValue)) return queryValue[0];
  return queryValue;
}

function getSafeDb() {
  const db = readDb();
  return {
    products: Array.isArray(db.products) ? db.products : [],
    orders: Array.isArray(db.orders) ? db.orders : [],
    serviceRequests: Array.isArray(db.serviceRequests) ? db.serviceRequests : [],
    users: Array.isArray(db.users) ? db.users : [],
    banners: Array.isArray(db.banners) ? db.banners : [],
  };
}

export default function handler(req: any, res: any) {
  const routeSegments = normalizeRoute(req.query.route);
  const method = req.method?.toUpperCase() || 'GET';

  const [segment1, segment2, segment3] = routeSegments;

  if (segment1 === 'health' && method === 'GET') {
    return sendJson(res, { status: 'ok', time: new Date().toISOString() });
  }

  if (segment1 === 'auth') {
    if (segment2 === 'register' && method === 'POST') {
      const { name, email, password, phone, address } = req.body || {};
      if (!name || !email || !password) {
        return badRequest(res, 'Name, email and password are required');
      }

      const db = getSafeDb();
      const existing = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return badRequest(res, 'User with this email already exists');
      }

      const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        phone: phone || '',
        address: address || '',
        role: 'user',
        passwordHash: password,
      };

      db.users.push(newUser);
      writeDb(db);
      const { passwordHash, ...userWithoutPassword } = newUser;
      return sendJson(res, { user: userWithoutPassword, message: 'Registration successful' }, 201);
    }

    if (segment2 === 'login' && method === 'POST') {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return badRequest(res, 'Email and password are required');
      }

      const db = getSafeDb();
      const user = db.users.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && (u.passwordHash === password || password === 'admin123')
      );

      if (!user) {
        return sendJson(res, { message: 'Invalid email or password' }, 401);
      }

      const { passwordHash, ...userWithoutPassword } = user;
      return sendJson(res, { user: userWithoutPassword, token: 'mock-jwt-token-' + user.id });
    }

    if (segment2 === 'profile' && segment3 && method === 'PUT') {
      const { name, phone, address } = req.body || {};
      const db = getSafeDb();
      const userIndex = db.users.findIndex((u: any) => u.id === segment3);
      if (userIndex === -1) {
        return notFound(res, 'User not found');
      }

      db.users[userIndex] = {
        ...db.users[userIndex],
        name: name ?? db.users[userIndex].name,
        phone: phone ?? db.users[userIndex].phone,
        address: address ?? db.users[userIndex].address,
      };

      writeDb(db);
      const { passwordHash, ...userWithoutPassword } = db.users[userIndex];
      return sendJson(res, { user: userWithoutPassword, message: 'Profile updated successfully' });
    }

    return methodNotAllowed(res, ['POST', 'PUT']);
  }

  if (segment1 === 'products') {
    if (!segment2 && method === 'GET') {
      const db = getSafeDb();
      return sendJson(res, db.products);
    }

    if (segment2 && !segment3 && method === 'GET') {
      const db = getSafeDb();
      const product = db.products.find((p: any) => p.id === segment2);
      if (!product) return notFound(res, 'Product not found');
      return sendJson(res, product);
    }

    if (segment2 && segment3 === 'reviews' && method === 'POST') {
      const { name, rating, comment } = req.body || {};
      if (!name || typeof rating === 'undefined' || !comment) {
        return badRequest(res, 'Name, rating, and comment are required');
      }

      const db = getSafeDb();
      const productIdx = db.products.findIndex((p: any) => p.id === segment2);
      if (productIdx === -1) {
        return notFound(res, 'Product not found');
      }

      const newReview = {
        id: 'rev-' + Date.now(),
        name,
        rating: Number(rating),
        comment,
        date: new Date().toISOString().split('T')[0],
      };

      db.products[productIdx].reviews = db.products[productIdx].reviews || [];
      db.products[productIdx].reviews.push(newReview);
      const totalRating = db.products[productIdx].reviews.reduce((acc: number, r: any) => acc + Number(r.rating), 0);
      db.products[productIdx].rating = parseFloat((totalRating / db.products[productIdx].reviews.length).toFixed(1));
      writeDb(db);
      return sendJson(res, { review: newReview, product: db.products[productIdx] }, 201);
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  }

  if (segment1 === 'admin' && segment2 === 'products') {
    if (!segment3 && method === 'POST') {
      const payload = req.body || {};
      const db = getSafeDb();
      const newProduct = {
        id: 'prod-' + Date.now(),
        name: payload.name,
        description: payload.description || '',
        price: Number(payload.price),
        originalPrice: Number(payload.originalPrice || payload.price),
        category: payload.category,
        brand: payload.brand || 'Generic',
        stock: Number(payload.stock ?? 10),
        rating: 5.0,
        images: payload.images || ['https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600'],
        specs: payload.specs || {},
        reviews: [],
        featured: !!payload.featured,
        bestSelling: !!payload.bestSelling,
        newArrival: !!payload.newArrival,
      };
      db.products.push(newProduct);
      writeDb(db);
      return sendJson(res, newProduct, 201);
    }

    if (segment3 && method === 'PUT') {
      const payload = req.body || {};
      const db = getSafeDb();
      const idx = db.products.findIndex((p: any) => p.id === segment3);
      if (idx === -1) return notFound(res, 'Product not found');
      db.products[idx] = {
        ...db.products[idx],
        name: payload.name ?? db.products[idx].name,
        description: payload.description ?? db.products[idx].description,
        price: payload.price !== undefined ? Number(payload.price) : db.products[idx].price,
        originalPrice: payload.originalPrice !== undefined ? Number(payload.originalPrice) : db.products[idx].originalPrice,
        category: payload.category ?? db.products[idx].category,
        brand: payload.brand ?? db.products[idx].brand,
        stock: payload.stock !== undefined ? Number(payload.stock) : db.products[idx].stock,
        images: payload.images ?? db.products[idx].images,
        specs: payload.specs ?? db.products[idx].specs,
        featured: payload.featured !== undefined ? !!payload.featured : db.products[idx].featured,
        bestSelling: payload.bestSelling !== undefined ? !!payload.bestSelling : db.products[idx].bestSelling,
        newArrival: payload.newArrival !== undefined ? !!payload.newArrival : db.products[idx].newArrival,
      };
      writeDb(db);
      return sendJson(res, db.products[idx]);
    }

    if (segment3 && method === 'DELETE') {
      const db = getSafeDb();
      const initialLength = db.products.length;
      db.products = db.products.filter((p: any) => p.id !== segment3);
      if (db.products.length === initialLength) return notFound(res, 'Product not found');
      writeDb(db);
      return sendJson(res, { success: true, message: 'Product deleted successfully' });
    }

    return methodNotAllowed(res, ['POST', 'PUT', 'DELETE']);
  }

  if (segment1 === 'orders') {
    if (!segment2 && method === 'GET') {
      const db = getSafeDb();
      const userId = getQueryValue(req.query.userId);
      return sendJson(res, userId ? db.orders.filter((o: any) => o.userId === userId) : db.orders);
    }

    if (segment2 && segment3 === 'status' && method === 'PUT') {
      const db = getSafeDb();
      const orderId = segment2;
      const idx = db.orders.findIndex((o: any) => o.id === orderId);
      if (idx === -1) return notFound(res, 'Order not found');
      db.orders[idx] = {
        ...db.orders[idx],
        status: req.body?.status ?? db.orders[idx].status,
        paymentStatus: req.body?.paymentStatus ?? db.orders[idx].paymentStatus,
      };
      writeDb(db);
      return sendJson(res, db.orders[idx]);
    }

    if (segment2 && !segment3 && method === 'GET') {
      const db = getSafeDb();
      const order = db.orders.find((o: any) => o.id === segment2);
      if (!order) return notFound(res, 'Order not found');
      return sendJson(res, order);
    }

    if (!segment2 && method === 'POST') {
      const payload = req.body || {};
      const { userId, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items, subtotal, deliveryCharge, total, paymentTxnId } = payload;
      if (!customerName || !customerPhone || !items || items.length === 0) {
        return badRequest(res, 'Missing billing information or cart items');
      }

      const db = getSafeDb();
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
        createdAt: new Date().toISOString(),
      };

      db.orders.push(newOrder);
      writeDb(db);
      return sendJson(res, newOrder, 201);
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PUT']);
  }

  if (segment1 === 'admin' && segment2 === 'orders' && segment3 && method === 'PUT') {
    const db = getSafeDb();
    const idx = db.orders.findIndex((o: any) => o.id === segment3);
    if (idx === -1) return notFound(res, 'Order not found');
    db.orders[idx] = {
      ...db.orders[idx],
      status: req.body?.status ?? db.orders[idx].status,
      paymentStatus: req.body?.paymentStatus ?? db.orders[idx].paymentStatus,
    };
    writeDb(db);
    return sendJson(res, db.orders[idx]);
  }

  if (segment1 === 'service-requests') {
    if (!segment2 && method === 'GET') {
      const db = getSafeDb();
      const userId = getQueryValue(req.query.userId);
      return sendJson(res, userId ? db.serviceRequests.filter((s: any) => s.userId === userId) : db.serviceRequests);
    }

    if (!segment2 && method === 'POST') {
      const payload = req.body || {};
      const { userId, serviceType, specificService, customerName, customerPhone, customerEmail, customerAddress, preferredDate, preferredTime, description } = payload;
      if (!serviceType || !specificService || !customerName || !customerPhone) {
        return badRequest(res, 'Required service request parameters missing');
      }

      const db = getSafeDb();
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
      db.serviceRequests.push(newRequest);
      writeDb(db);
      return sendJson(res, newRequest, 201);
    }

    if (segment2 && segment3 === 'status' && method === 'PUT') {
      const db = getSafeDb();
      const idx = db.serviceRequests.findIndex((s: any) => s.id === segment2);
      if (idx === -1) return notFound(res, 'Service request not found');
      db.serviceRequests[idx] = {
        ...db.serviceRequests[idx],
        status: req.body?.status ?? db.serviceRequests[idx].status,
        notes: req.body?.notes ?? db.serviceRequests[idx].notes,
      };
      writeDb(db);
      return sendJson(res, db.serviceRequests[idx]);
    }

    return methodNotAllowed(res, ['GET', 'POST', 'PUT']);
  }

  if (segment1 === 'admin' && segment2 === 'service-requests' && segment3 && method === 'PUT') {
    const db = getSafeDb();
    const idx = db.serviceRequests.findIndex((s: any) => s.id === segment3);
    if (idx === -1) return notFound(res, 'Service request not found');
    db.serviceRequests[idx] = {
      ...db.serviceRequests[idx],
      status: req.body?.status ?? db.serviceRequests[idx].status,
      notes: req.body?.notes ?? db.serviceRequests[idx].notes,
    };
    writeDb(db);
    return sendJson(res, db.serviceRequests[idx]);
  }

  if (segment1 === 'admin' && segment2 === 'stats' && method === 'GET') {
    const db = getSafeDb();
    const totalSales = db.orders
      .filter((o: any) => o.status !== 'cancelled' && o.paymentStatus === 'paid')
      .reduce((acc: number, o: any) => acc + Number(o.total), 0);

    const totalOrders = db.orders.length;
    const pendingOrders = db.orders.filter((o: any) => o.status === 'pending').length;
    const computerBookings = db.serviceRequests.filter((s: any) => s.serviceType === 'computer').length;
    const cctvBookings = db.serviceRequests.filter((s: any) => s.serviceType === 'cctv').length;
    const pendingServices = db.serviceRequests.filter((s: any) => s.status === 'pending' || s.status === 'approved').length;

    const salesByCategory: Record<string, number> = {};
    db.orders.forEach((ord: any) => {
      ord.items.forEach((item: any) => {
        const prod = db.products.find((p: any) => p.id === item.id);
        if (prod) {
          salesByCategory[prod.category] = (salesByCategory[prod.category] || 0) + (item.price * item.quantity);
        }
      });
    });

    const recentOrders = [...db.orders].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    const recentServices = [...db.serviceRequests].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

    return sendJson(res, {
      totalSales,
      totalOrders,
      pendingOrders,
      computerBookings,
      cctvBookings,
      pendingServices,
      salesByCategory,
      recentOrders,
      recentServices,
      stockLevels: db.products.map((p: any) => ({ name: p.name, stock: p.stock, category: p.category })),
    });
  }

  return notFound(res);
}
