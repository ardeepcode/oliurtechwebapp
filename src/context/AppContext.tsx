import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ServiceRequest, User } from '../types';

interface AppContextType {
  // Navigation Routing (Hash-based / State-based Router)
  currentPath: string;
  queryParams: Record<string, string>;
  productDetailId: string | null;
  navigateTo: (path: string, params?: Record<string, string>) => void;
  
  // Products State
  products: Product[];
  loadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  
  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  
  // Wishlist State
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Authentication State
  currentUser: User | null;
  token: string | null;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
  updateUserProfile: (profile: { name: string; phone: string; address: string }) => Promise<boolean>;

  // Orders State & Tracking
  placeNewOrder: (orderData: Partial<Order>) => Promise<Order | null>;
  trackOrder: (orderId: string) => Promise<Order | null>;
  userOrders: Order[];
  fetchUserOrders: () => Promise<void>;

  // Servicing Board & CCTV installation bookings
  submitServiceRequest: (requestData: Partial<ServiceRequest>) => Promise<ServiceRequest | null>;
  userServiceRequests: ServiceRequest[];
  fetchUserServiceRequests: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation states
  const [currentPath, setCurrentPath] = useState<string>('home');
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [productDetailId, setProductDetailId] = useState<string | null>(null);

  // Core business structures
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userServiceRequests, setUserServiceRequests] = useState<ServiceRequest[]>([]);

  // Track initial state and handle hash updates for bookmarks
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const pathPart = hash.split('?')[0];
      const paramPart = hash.split('?')[1];
      
      const parsedParams: Record<string, string> = {};
      if (paramPart) {
        paramPart.split('&').forEach(item => {
          const [key, value] = item.split('=');
          if (key && value) parsedParams[key] = decodeURIComponent(value);
        });
      }

      setQueryParams(parsedParams);

      if (pathPart.startsWith('/product/')) {
        const prodId = pathPart.replace('/product/', '');
        setProductDetailId(prodId);
        setCurrentPath('product-detail');
      } else {
        setCurrentPath(pathPart || 'home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Execute on initial mount
    handleHashChange();

    // Load Local Storage user details
    const savedUser = localStorage.getItem('ot_user');
    const savedToken = localStorage.getItem('ot_token');
    const savedCart = localStorage.getItem('ot_cart');
    const savedWishlist = localStorage.getItem('ot_wishlist');

    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    // Load products
    fetchProducts();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Persist Cartesian lists
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('ot_cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('ot_cart');
    }
  }, [cart]);

  useEffect(() => {
    if (wishlist.length > 0) {
      localStorage.setItem('ot_wishlist', JSON.stringify(wishlist));
    } else {
      localStorage.removeItem('ot_wishlist');
    }
  }, [wishlist]);

  // Fetch Live Products from server
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products from API backend:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  // Profile management
  const updateUserProfile = async (profile: { name: string; phone: string; address: string }) => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`/api/auth/profile/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        localStorage.setItem('ot_user', JSON.stringify(data.user));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Load User historical bookings & orders
  const fetchUserOrders = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/orders?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUserServiceRequests = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/service-requests?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserServiceRequests(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // When user logs in
  useEffect(() => {
    if (currentUser) {
      fetchUserOrders();
      fetchUserServiceRequests();
    } else {
      setUserOrders([]);
      setUserServiceRequests([]);
    }
  }, [currentUser]);

  // Navigation Logic
  const navigateTo = (path: string, params?: Record<string, string>) => {
    let suffix = '';
    if (params) {
      const searchStr = Object.entries(params)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');
      if (searchStr) suffix = `?${searchStr}`;
    }
    // Set actual window hash to engage hashChange router natively
    window.location.hash = path + suffix;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { id: product.id, product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prevWish) => {
      const exists = prevWish.some((item) => item.id === product.id);
      if (exists) {
        return prevWish.filter((item) => item.id !== product.id);
      }
      return [...prevWish, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // User auth state controls
  const loginUser = (user: User, userToken: string) => {
    setCurrentUser(user);
    setToken(userToken);
    localStorage.setItem('ot_user', JSON.stringify(user));
    localStorage.setItem('ot_token', userToken);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('ot_user');
    localStorage.removeItem('ot_token');
    navigateTo('home');
  };

  // Checkouts & Order Triggers
  const placeNewOrder = async (orderData: Partial<Order>) => {
    try {
      const payload = {
        ...orderData,
        userId: currentUser?.id || null,
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0]
        })),
        subtotal: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        deliveryCharge: 100, // standard delivery BDT
        total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0) + 100,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const order = await res.json();
        clearCart();
        fetchProducts(); // update inventory
        if (currentUser) {
          fetchUserOrders();
        }
        return order;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // Specific Order tracking
  const trackOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // Submit computer and CCTV booking requests
  const submitServiceRequest = async (requestData: Partial<ServiceRequest>) => {
    try {
      const payload = {
        ...requestData,
        userId: currentUser?.id || null,
      };

      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        if (currentUser) {
          fetchUserServiceRequests();
        }
        return result;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        queryParams,
        productDetailId,
        navigateTo,
        products,
        loadingProducts,
        refreshProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        token,
        loginUser,
        logoutUser,
        updateUserProfile,
        placeNewOrder,
        trackOrder,
        userOrders,
        fetchUserOrders,
        submitServiceRequest,
        userServiceRequests,
        fetchUserServiceRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
