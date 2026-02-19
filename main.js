/* ==================== MAIN INITIALIZATION ==================== */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Main.js loaded - Page:', window.location.pathname);
  
  if (typeof loadProducts === 'function') {
    loadProducts();
  }
  
  if (typeof loadCart === 'function') {
    loadCart();
  }
  
  if (typeof loadProfile === 'function') {
    loadProfile();
  }

  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  
  if (typeof initializeSellForm === 'function') {
    setTimeout(initializeSellForm, 100);
  }
});