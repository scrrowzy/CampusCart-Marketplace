/* ==================== PRODUCT MODAL FUNCTIONS ==================== */
function openProduct(encodedName) {
  console.log('Opening product:', encodedName);
  
  const productName = decodeProductName(encodedName);
  const product = products.find(p => p.name === productName);
  
  if (!product) {
    console.error('Product not found:', productName);
    return;
  }

  const modalImg = document.getElementById('modalImg');
  const modalName = document.getElementById('modalName');
  const modalCategory = document.getElementById('modalCategory');
  const modalCondition = document.getElementById('modalCondition');
  const modalPrice = document.getElementById('modalPrice');
  const modalDescription = document.getElementById('modalDescription');
  const modalSeller = document.getElementById('modalSeller');
  const modalCartBtn = document.getElementById('modalCartBtn');

  if (modalImg) {
    modalImg.src = product.image;
    modalImg.onerror = function() {
      this.src = getCategoryPlaceholder(product.category);
    };
  }
  if (modalName) modalName.innerText = product.name;
  if (modalCategory) modalCategory.innerText = 'Category: ' + product.category;
  if (modalCondition) modalCondition.innerText = 'Condition: ' + product.condition;
  if (modalPrice) modalPrice.innerText = 'Price: ₱' + product.price;
  if (modalDescription) modalDescription.innerText = product.description;
  if (modalSeller) modalSeller.innerText = 'Seller: ' + product.seller;

  // CHECK BY EMAIL
  const userEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
  const isInCart = cart.some(item => item.name === product.name);

  console.log('Product seller email:', product.sellerEmail);
  console.log('Your email:', userEmail);
  console.log('Is owner?', product.sellerEmail === userEmail);

  if (product.sellerEmail === userEmail) {
    if (modalCartBtn) {
      modalCartBtn.innerText = 'Edit Product';
      modalCartBtn.style.display = 'block';
      modalCartBtn.disabled = false;
      modalCartBtn.style.background = '#1e88e5';
      modalCartBtn.onclick = function() {
        if (typeof window.editProduct === 'function') {
          window.editProduct(encodedName);
        }
      };
    }
  } else if (isInCart) {
    if (modalCartBtn) {
      modalCartBtn.style.display = 'none';
    }
  } else {
    if (modalCartBtn) {
      modalCartBtn.style.display = 'block';
      modalCartBtn.innerText = 'Add to Cart';
      modalCartBtn.disabled = false;
      modalCartBtn.style.background = '#ff6f4f';
      modalCartBtn.onclick = function() {
        if (typeof window.addToCart === 'function') {
          window.addToCart(encodedName);
          setTimeout(() => openProduct(encodedName), 100);
        }
      };
    }
  }

  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.add('show');
  }
}

function closeProduct() {
  console.log('Closing product modal');
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function toggleSellModal(addMode = true) {
  console.log('Toggling sell modal, addMode:', addMode);
  
  const sellModal = document.getElementById('sellModal');
  if (!sellModal) {
    console.error('Sell modal not found');
    return;
  }

  sellModal.classList.add('show');

  const deleteBtn = document.getElementById('sellDeleteBtn');
  const imageInput = document.getElementById('sellImage');
  const submitBtn = document.querySelector('#sellForm button[type="submit"]');
  const form = document.getElementById('sellForm');
  const preview = document.getElementById('sellImagePreview');
  const formTitle = document.querySelector('#sellModal h2');

  if (addMode) {
    if (formTitle) {
      formTitle.innerText = 'Sell a New Product';
    }
    if (imageInput) {
      imageInput.required = true;
      imageInput.removeAttribute('data-edit-mode');
    }
    if (deleteBtn) deleteBtn.style.display = 'none';
    if (submitBtn) submitBtn.innerText = 'Add Product';
    
    if (form) form.reset();
    if (preview) {
      preview.src = '';
      preview.style.display = 'none';
    }
  }
}

function closeSellModal() {
  console.log('Closing sell modal');
  
  const sellModal = document.getElementById('sellModal');
  if (sellModal) {
    sellModal.classList.remove('show');
  }
  
  const form = document.getElementById('sellForm');
  if (form) form.reset();
  
  const preview = document.getElementById('sellImagePreview');
  if (preview) {
    preview.src = '';
    preview.style.display = 'none';
  }
  
  const deleteBtn = document.getElementById('sellDeleteBtn');
  if (deleteBtn) {
    deleteBtn.style.display = 'none';
  }
  
  const imageInput = document.getElementById('sellImage');
  if (imageInput) {
    imageInput.required = true;
    imageInput.removeAttribute('data-edit-mode');
  }
  
  const submitBtn = document.querySelector('#sellForm button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerText = 'Add Product';
  }
  
  const formTitle = document.querySelector('#sellModal h2');
  if (formTitle) {
    formTitle.innerText = 'Sell a New Product';
  }
}

function previewSellImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const validation = validateImage(file);
  if (!validation.valid) {
    alert(validation.error);
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('sellImagePreview');
    if (preview) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      preview.style.maxWidth = '200px';
      preview.style.maxHeight = '200px';
      preview.style.margin = '10px auto';
      preview.style.borderRadius = '10px';
    }
  };
  reader.readAsDataURL(file);
}

window.openProduct = openProduct;
window.closeProduct = closeProduct;
window.toggleSellModal = toggleSellModal;
window.closeSellModal = closeSellModal;
window.previewSellImage = previewSellImage;