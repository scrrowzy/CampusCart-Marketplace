/* ==================== PRODUCT STATE ==================== */
let products = [];
let currentCategory = 'all';

/* ==================== PRODUCT FUNCTIONS ==================== */
function loadProducts() {
  products = safeJSONParse(CONFIG.STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  migrateProductsToEmail();
  display(products);
  loadUserProducts();
}

function display(productList) {
  const productsContainer = document.getElementById('products');
  if (!productsContainer) return;

  if (productList.length === 0) {
    productsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #999;">No products found</div>';
    return;
  }

  const currentUserEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);

  let html = '';

  productList.forEach(product => {
    const isInCart = cart.some(item => item.name === product.name);
    const isOwnProduct = product.sellerEmail === currentUserEmail; // Only current email
    const encodedName = encodeProductName(product.name);
    const buttonId = `btn-${product.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')}`;

    let buttonText = 'Add to Cart';
    let buttonStyle = 'background:#ff6f4f; cursor:pointer;';
    let disabled = '';
    
    if (isOwnProduct) {
      buttonText = 'Your Product';
      buttonStyle = 'background:#999; cursor:not-allowed;';
      disabled = 'disabled';
    } else if (isInCart) {
      buttonText = 'Already in Cart';
      buttonStyle = 'background:#999; cursor:not-allowed;';
      disabled = 'disabled';
    }

    html += `
      <div class="card" onclick="openProduct('${encodedName}')">
        <img src="${product.image}" alt="${product.name}" onerror="this.src='${getCategoryPlaceholder(product.category)}'">
        <h3>${product.name}</h3>
        <p>₱${product.price}</p>
        <p style="font-size:12px;color:#666;">Seller: ${product.seller}</p>
        <button 
          id="${buttonId}"
          onclick="event.stopPropagation(); addToCart('${encodedName}');"
          ${disabled} style="${buttonStyle}">
          ${buttonText}
        </button>
      </div>
    `;
  });

  productsContainer.innerHTML = html;
}

function filter(event, category) {
  currentCategory = category.toLowerCase();
  
  document.querySelectorAll('.categories span').forEach(span => {
    span.classList.remove('active');
  });
  event.target.classList.add('active');
  
  applyFilters();
}

function applyFilters() {
  let filtered = [...products];
  
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === currentCategory);
  }
  
  const searchInput = document.getElementById('search');
  if (searchInput) {
    const searchValue = searchInput.value.toLowerCase().trim();
    if (searchValue) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchValue));
    }
  }
  
  display(filtered);
}

function loadUserProducts() {
  const userProductsList = document.getElementById('userProductsList');
  if (!userProductsList) return;

  const currentEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
  const username = localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);
  
  // IMPORTANT: Only show products from CURRENT email, NOT history
  const userProducts = products.filter(p => p.userAdded && p.sellerEmail === currentEmail);
  
  let html = '';
  
  if (userProducts.length === 0) {
    html = '<p style="text-align:center; color:#999; padding:20px;">You haven\'t added any products with this email. Products are tied to the email that created them.</p>';
  } else {
    userProducts.forEach(product => {
      const encodedName = encodeProductName(product.name);
      html += `
        <div class="user-product" onclick="openProduct('${encodedName}')">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='${getCategoryPlaceholder(product.category)}'">
          <div class="user-product-info">
            <h4>${product.name}</h4>
            <p>₱${product.price}</p>
          </div>
        </div>
      `;
    });
  }
  
  userProductsList.innerHTML = html;
}

function saveProducts() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  } catch (e) {
    alertStorageError('Could not save products.');
    return false;
  }
}

window.products = products;
window.loadProducts = loadProducts;
window.display = display;
window.filter = filter;
window.applyFilters = applyFilters;
window.loadUserProducts = loadUserProducts;
window.saveProducts = saveProducts;