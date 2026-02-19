/* ==================== SELL FORM HANDLER ==================== */
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeSellForm, 200);
});

function initializeSellForm() {
  console.log('Initializing sell form');
  const sellForm = document.getElementById('sellForm');
  if (sellForm) {
    const newForm = sellForm.cloneNode(true);
    sellForm.parentNode.replaceChild(newForm, sellForm);
    newForm.addEventListener('submit', handleSellSubmit);
    console.log('Sell form initialized successfully');
  } else {
    console.log('Sell form not found');
  }
}

function handleSellSubmit(event) {
  event.preventDefault();
  console.log('Sell form submitted');
  
  const name = document.getElementById('sellName')?.value.trim();
  const category = document.getElementById('sellCategory')?.value;
  const condition = document.getElementById('sellCondition')?.value;
  const description = document.getElementById('sellDescription')?.value.trim();
  const price = parseFloat(document.getElementById('sellPrice')?.value);
  const imageFile = document.getElementById('sellImage')?.files[0];
  const imageInput = document.getElementById('sellImage');
  
  if (!name) {
    alert('Please enter a product name.');
    return;
  }
  
  if (!category) {
    alert('Please select a category.');
    return;
  }
  
  if (!condition) {
    alert('Please select a condition.');
    return;
  }
  
  if (!description) {
    alert('Please enter a description.');
    return;
  }
  
  if (!price || price <= 0) {
    alert('Please enter a valid price greater than 0.');
    return;
  }
  
  const isEditMode = imageInput?.hasAttribute('data-edit-mode') || false;
  
  if (!isEditMode && !imageFile) {
    alert('Please select an image.');
    return;
  }

  if (!isEditMode && products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    alert('A product with this name already exists. Please choose a different name.');
    return;
  }

  let productToEdit = null;
  if (isEditMode) {
    const originalName = document.getElementById('sellName')?.getAttribute('data-original-name');
    if (originalName) {
      productToEdit = products.find(p => p.name === originalName);
    }
  }

  const saveProductWithImage = function(imageData) {
    const userEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
    const username = localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);

    if (isEditMode && productToEdit) {
      console.log('Updating product:', productToEdit.name);
      productToEdit.name = name;
      productToEdit.category = category.toLowerCase();
      productToEdit.condition = condition;
      productToEdit.description = description;
      productToEdit.price = price;
      productToEdit.seller = username;
      // IMPORTANT: Keep original email, don't change it
      if (imageData) {
        productToEdit.image = imageData;
      }
    } else {
      console.log('Adding new product:', name);
      
      const newProduct = {
        name: name,
        category: category.toLowerCase(),
        image: imageData,
        condition: condition,
        description: description,
        price: price,
        userAdded: true,
        seller: username,
        sellerEmail: userEmail // Products are tied to the email that created them
      };
      products.push(newProduct);
    }

    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      
      document.querySelectorAll('.categories span').forEach(s => s.classList.remove('active'));
      const allTab = document.querySelector('.categories span:first-child');
      if (allTab) allTab.classList.add('active');
      currentCategory = 'all';
      
      display(products);
      if (typeof loadUserProducts === 'function') {
        loadUserProducts();
      }
      
      closeSellModal();
      alert(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (e) {
      alertStorageError('Could not save product.');
      if (!isEditMode && !productToEdit) {
        products.pop();
      }
    }
  };

  if (imageFile) {
    const validation = validateImage(imageFile);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      saveProductWithImage(e.target.result);
    };
    reader.onerror = function() {
      alert('Error reading image file. Please try again.');
    };
    reader.readAsDataURL(imageFile);
  } else {
    saveProductWithImage(null);
  }
}

function editProduct(encodedName) {
  console.log('Editing product:', encodedName);
  
  closeProduct();

  const productName = decodeProductName(encodedName);
  console.log('Decoded product name:', productName);
  
  const product = products.find(p => p.name === productName);
  if (!product) {
    console.error('Product not found for editing:', productName);
    return;
  }

  // Check ownership by current email only
  if (!isProductOwner(product)) {
    alert('You can only edit products created with your current email!');
    return;
  }

  console.log('Product found:', product);

  const sellModal = document.getElementById('sellModal');
  if (sellModal) {
    sellModal.classList.add('show');
  } else {
    console.error('Sell modal not found');
    return;
  }

  const nameInput = document.getElementById('sellName');
  const categorySelect = document.getElementById('sellCategory');
  const conditionSelect = document.getElementById('sellCondition');
  const descriptionTextarea = document.getElementById('sellDescription');
  const priceInput = document.getElementById('sellPrice');
  const preview = document.getElementById('sellImagePreview');
  const imageInput = document.getElementById('sellImage');
  const deleteBtn = document.getElementById('sellDeleteBtn');
  const submitBtn = document.querySelector('#sellForm button[type="submit"]');
  const formTitle = document.querySelector('#sellModal h2');

  if (formTitle) {
    formTitle.innerText = 'Edit Product';
  }

  if (nameInput) {
    nameInput.value = product.name;
    nameInput.setAttribute('data-original-name', product.name);
  }
  if (categorySelect) categorySelect.value = product.category;
  if (conditionSelect) conditionSelect.value = product.condition;
  if (descriptionTextarea) descriptionTextarea.value = product.description;
  if (priceInput) priceInput.value = product.price;
  
  if (preview) {
    preview.src = product.image;
    preview.style.display = 'block';
  }
  
  if (imageInput) {
    imageInput.required = false;
    imageInput.setAttribute('data-edit-mode', 'true');
  }

  if (deleteBtn) {
    deleteBtn.style.display = 'block';
    deleteBtn.onclick = function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to delete this product?')) {
        deleteProduct(product);
      }
    };
  }

  if (submitBtn) {
    submitBtn.innerText = 'Update Product';
  }

  setTimeout(initializeSellForm, 100);
}

function deleteProduct(product) {
  console.log('Deleting product:', product.name);
  
  // Check ownership by current email only
  if (!isProductOwner(product)) {
    alert('You can only delete products created with your current email!');
    return;
  }
  
  const index = products.findIndex(p => p.name === product.name);
  if (index !== -1) {
    products.splice(index, 1);
    
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      
      cart = cart.filter(item => item.name !== product.name);
      localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
      
      updateCart();
      display(products);
      if (typeof loadUserProducts === 'function') {
        loadUserProducts();
      }
      
      closeSellModal();
      alert('Product deleted successfully!');
    } catch (e) {
      alertStorageError('Could not delete product.');
    }
  }
}

window.editProduct = editProduct;
window.initializeSellForm = initializeSellForm;