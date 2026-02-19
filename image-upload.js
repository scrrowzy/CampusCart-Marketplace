/* ==================== IMAGE UPLOAD HANDLER ==================== */
// Maximum image size: 5MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Function to handle image upload and return a data URL
function handleImageUpload(file, callback) {
    if (!file) {
        callback(null);
        return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, GIF, etc.)');
        callback(null);
        return;
    }

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
        alert(`Image is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum allowed: 5MB`);
        callback(null);
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result);
    };
    reader.onerror = function() {
        alert('Error reading image file. Please try again.');
        callback(null);
    };
    reader.readAsDataURL(file);
}

// Function to get a placeholder image based on category
function getCategoryPlaceholder(category) {
    const placeholders = {
        'clothing': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        'uniform': 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400',
        'gadgets': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        'default': 'https://via.placeholder.com/400x300?text=Product+Image',
    };
    return placeholders[category] || placeholders.default;
}

// Function to validate and preview image
function previewImage(input, previewElement, callback) {
    const file = input.files[0];
    if (!file) {
        if (callback) callback(null);
        return;
    }

    handleImageUpload(file, function(imageData) {
        if (imageData && previewElement) {
            previewElement.src = imageData;
            previewElement.style.display = 'block';
        }
        if (callback) callback(imageData);
    });
}

// Export functions
window.handleImageUpload = handleImageUpload;
window.getCategoryPlaceholder = getCategoryPlaceholder;
window.previewImage = previewImage;