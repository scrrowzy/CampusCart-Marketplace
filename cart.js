/* ==================== CART STATE ==================== */
let cart = [];

/* ==================== CART FUNCTIONS ==================== */
function loadCart() {
  console.log('Loading cart...');
  cart = safeJSONParse(CONFIG.STORAGE_KEYS.CART, []);
  updateCartDisplay();
}

function addToCart(encodedName) {
  console.log('Adding to cart:', encodedName);
  
  const productName = decodeProductName(encodedName);
  const product = products.find(p => p.name === productName);
  
  if (!product) {
    alert('Error: Product not found.');
    return;
  }

  // CHECK BY EMAIL INSTEAD OF USERNAME
  const currentUserEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);

  if (product.sellerEmail === currentUserEmail) {
    alert('You cannot add your own product to the cart.');
    return;
  }

  if (cart.some(item => item.name === productName)) {
    alert('This product is already in your cart!');
    return;
  }

  cart.push({ name: productName });
  
  try {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartDisplay();
  } catch (e) {
    alertStorageError('Try removing items from cart.');
    cart.pop();
    updateCartDisplay();
  }
}

function removeFromCart(index) {
  console.log('Removing from cart, index:', index);
  
  cart.splice(index, 1);
  
  try {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartDisplay();
  } catch (e) {
    alert('Failed to save cart changes.');
  }
}

function updateCartDisplay() {
  console.log('Updating cart display, cart length:', cart.length);
  
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  
  if (!cartItems || !cartTotal || !cartCount) return;

  let html = '';
  let total = 0;

  if (cart.length === 0) {
    html = '<p style="text-align:center; color:#999; padding:20px;">Your cart is empty</p>';
  } else {
    cart.forEach((item, index) => {
      const product = products.find(p => p.name === item.name);
      if (!product) return;

      total += product.price;
      const encodedName = encodeProductName(product.name);

      html += `
        <div class="cart-item" onclick="openProduct('${encodedName}')">
          <img src="${product.image}" class="cart-img" alt="${product.name}" onerror="this.src='${getCategoryPlaceholder(product.category)}'">
          <div class="cart-info"> 
            <div class="cart-name">${product.name}</div>
            <div>₱${product.price}</div>
          </div>
          <button class="delete-btn" onclick="event.stopPropagation(); removeFromCart(${index})">Delete</button>
        </div>
      `;
    });
  }

  cartItems.innerHTML = html;
  cartTotal.innerText = `Total: ₱${total}`;
  cartCount.innerText = cart.length;

  try {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    alert('Failed to save cart.');
  }

  updateProductButtons();
}

function updateCart() {
  updateCartDisplay();
}

function updateProductButtons() {
  const currentUserEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
  
  document.querySelectorAll('.card').forEach(card => {
    const name = card.querySelector('h3')?.innerText;
    if (!name) return;
    
    const btn = card.querySelector('button');
    if (!btn) return;
    
    const product = products.find(p => p.name === name);
    if (!product) return;
    
    // CHECK BY EMAIL
    if (product.sellerEmail === currentUserEmail) {
      btn.innerText = 'Your Product';
      btn.disabled = true;
      btn.style.background = '#999';
      btn.style.cursor = 'not-allowed';
    } else if (cart.some(item => item.name === name)) {
      btn.innerText = 'Already in Cart';
      btn.disabled = true;
      btn.style.background = '#999';
      btn.style.cursor = 'not-allowed';
    } else {
      btn.innerText = 'Add to Cart';
      btn.disabled = false;
      btn.style.background = '#ff6f4f';
      btn.style.cursor = 'pointer';
    }
  });
}

function buyNow() {
  if (cart.length === 0) {
    alert('Your cart is empty. Add some products first!');
    return;
  }

  const cartItems = [];
  let total = 0;
  let allProductsExist = true;

  cart.forEach(item => {
    const product = products.find(p => p.name === item.name);
    if (product) {
      cartItems.push(product);
      total += product.price;
    } else {
      allProductsExist = false;
    }
  });

  if (!allProductsExist) {
    alert('Some items in your cart are no longer available. They will be removed.');
    cart = cart.filter(item => products.some(p => p.name === item.name));
    updateCartDisplay();
    return;
  }

  if (confirm(`Are you sure you want to buy all items for ₱${total}?`)) {
    cartItems.forEach(item => {
      const index = products.findIndex(p => p.name === item.name);
      if (index !== -1) {
        products.splice(index, 1);
      }
    });
    
    cart = [];
    
    localStorage.setItem(CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    
    updateCartDisplay();
    display(products);
    loadUserProducts();
    
    alert('Purchase successful! Thank you for shopping on Campus Cart.');
  }
}

window.cart = cart;
window.updateCart = updateCart;
window.loadCart = loadCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.buyNow = buyNow;