/* ==================== CONFIGURATION ==================== */
const CONFIG = {
  STORAGE_KEYS: {
    LOGGED_IN: 'loggedIn',
    USERNAME: 'username',
    EMAIL: 'email',
    PASSWORD: 'password',
    PROFILE_PIC: 'profilePic',
    PRODUCTS: 'products',
    CART: 'cart',
    USERS: 'users',
    EMAIL_HISTORY: 'emailHistory'
  },
  DEFAULT_PROFILE_PIC: 'https://via.placeholder.com/150?text=User',
  MAX_IMAGE_SIZE_KB: 5000,
  STORAGE_QUOTA_ERROR_MSG: 'Failed to save. Storage quota may be exceeded. Try a smaller image.',
  IMAGE_PLACEHOLDERS: {
    clothing: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    uniform: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400',
    gadgets: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    default: 'https://via.placeholder.com/400x300?text=Product+Image'
  }
};

const DEFAULT_PRODUCTS = [
  {
    name: 'iPhone',
    category: 'gadgets',
    image: 'illustration.png/laptop.png',
    condition: 'Brand New',
    description: 'A high-quality smartphone with great features.',
    price: 5000,
    userAdded: true,
    seller: 'kozy',
    sellerEmail: 'kozy@example.com'
  },
  {
    name: 'Black Tshirt',
    category: 'clothing',
    image: 'illustration.png/tshirt.png',
    condition: 'Brand New',
    description: 'Classic black t-shirt, comfortable cotton fabric.',
    price: 600,
    userAdded: true,
    seller: 'kozy',
    sellerEmail: 'kozy@example.com'
  },
  {
    name: 'Black Shoes',
    category: 'shoes',
    image: 'illustration.png/shoes.png',
    condition: 'Brand New',
    description: 'Stylish black shoes for everyday wear.',
    price: 1000,
    userAdded: true,
    seller: 'kozy',
    sellerEmail: 'kozy@example.com'
  },
  {
    name: 'ICCT Uniform',
    category: 'uniform',
    image: 'illustration.png/uniform.png',
    condition: 'Brand New',
    description: 'Complete ICCT school uniform, perfect condition.',
    price: 700,
    userAdded: true,
    seller: 'kozy',
    sellerEmail: 'kozy@example.com'
  }
];