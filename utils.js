/* ==================== UTILITY FUNCTIONS ==================== */
function alertStorageError(context = '') {
  const fullMsg = context ? `${CONFIG.STORAGE_QUOTA_ERROR_MSG} ${context}` : CONFIG.STORAGE_QUOTA_ERROR_MSG;
  alert(fullMsg);
}

function encodeProductName(name) {
  return encodeURIComponent(name);
}

function decodeProductName(encoded) {
  return decodeURIComponent(encoded);
}

function isProductOwner(product) {
  // ONLY check current email, NOT history
  const userEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
  return product.sellerEmail === userEmail;
}

function safeJSONParse(item, defaultValue = null) {
  try {
    const stored = localStorage.getItem(item);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error parsing ${item}:`, e);
    return defaultValue;
  }
}

function migrateProductsToEmail() {
  let migrated = false;
  const userEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
  const username = localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);
  
  products.forEach(product => {
    // Only add email if missing
    if (!product.sellerEmail && product.seller) {
      if (product.seller === 'System') {
        product.sellerEmail = 'system@campuscart.com';
      } else {
        // Try to find user by username in users array
        const users = safeJSONParse(CONFIG.STORAGE_KEYS.USERS, []);
        const user = users.find(u => u.username === product.seller);
        if (user) {
          product.sellerEmail = user.email;
        } else {
          product.sellerEmail = product.seller + '@temp.com';
        }
      }
      migrated = true;
    }
  });
  
  if (migrated) {
    saveProducts();
    console.log('Products migrated to use email');
  }
}

function checkMyProducts() {
  const myEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
  const myUsername = localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);
  
  console.log('%c=== YOUR INFO ===', 'color: blue; font-weight: bold');
  console.log('Username:', myUsername);
  console.log('Current Email:', myEmail);
  
  console.log('%c=== ALL PRODUCTS ===', 'color: purple; font-weight: bold');
  products.forEach((p, i) => {
    console.log(`${i}. ${p.name} | Seller: ${p.seller} | SellerEmail: ${p.sellerEmail || 'NOT SET'}`);
  });
  
  console.log('%c=== PRODUCTS YOU OWN (CURRENT EMAIL ONLY) ===', 'color: green; font-weight: bold');
  const myProducts = products.filter(p => p.sellerEmail === myEmail);
  myProducts.forEach(p => {
    console.log(`- ${p.name} (${p.seller}) - Email: ${p.sellerEmail}`);
  });
  
  if (myProducts.length === 0) {
    console.log('%cNo products found with your current email!', 'color: red');
  }
  
  return myProducts;
}

function fixMyProducts() {
  const myEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
  const myUsername = localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);
  
  let fixed = 0;
  products.forEach(product => {
    // Fix if seller name matches but email doesn't match current user
    if (product.seller === myUsername && product.sellerEmail !== myEmail) {
      // This shouldn't happen - products should keep original email
      console.warn(`Product ${product.name} has mismatched data`);
      fixed++;
    }
  });
  
  if (fixed > 0) {
    console.log(`Found ${fixed} products with mismatched data. They remain with original email.`);
  } else {
    console.log('No products needed fixing.');
  }
  
  if (typeof loadUserProducts === 'function') {
    loadUserProducts();
  }
  if (typeof display === 'function') {
    display(products);
  }
}

function getCategoryPlaceholder(category) {
  return CONFIG.IMAGE_PLACEHOLDERS[category] || CONFIG.IMAGE_PLACEHOLDERS.default;
}

function validateImage(file) {
  if (!file) return { valid: false, error: 'No file selected' };
  
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file (JPEG, PNG, GIF, etc.)' };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `Image is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum allowed: 5MB` 
    };
  }
  
  return { valid: true };
}

function initEmailHistory() {
  // Email history is now just for record-keeping, NOT for ownership
  if (!localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL_HISTORY)) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.EMAIL_HISTORY, '[]');
  }
}

function addToEmailHistory(email) {
  if (!email) return;
  
  const history = safeJSONParse(CONFIG.STORAGE_KEYS.EMAIL_HISTORY, []);
  if (!history.includes(email)) {
    history.push(email);
    localStorage.setItem(CONFIG.STORAGE_KEYS.EMAIL_HISTORY, JSON.stringify(history));
    console.log(`Added ${email} to email history (for reference only)`);
  }
}

window.checkMyProducts = checkMyProducts;
window.fixMyProducts = fixMyProducts;
window.validateImage = validateImage;
window.getCategoryPlaceholder = getCategoryPlaceholder;
window.initEmailHistory = initEmailHistory;
window.addToEmailHistory = addToEmailHistory;
window.isProductOwner = isProductOwner;