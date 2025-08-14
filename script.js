// Global variables
let currentImageIndex = 0;
let filteredItems = [];
let allItems = [];
let totalViews = 0;

// DOM elements
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDescription = document.getElementById("lightbox-description");
const searchInput = document.getElementById("searchInput");
const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const categoryFilter = document.getElementById("categoryFilter");
const gallery = document.getElementById("gallery");
const imageCount = document.getElementById("imageCount");
const viewCount = document.getElementById("viewCount");

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    setupEventListeners();
    updateStats();
});

// Initialize gallery
function initializeGallery() {
    allItems = Array.from(document.querySelectorAll('.gallery-item'));
    filteredItems = [...allItems];
    
    // Add fade-in animation to items
    allItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Filter button
    filterBtn.addEventListener('click', toggleFilterPanel);
    
    // Filter changes
    categoryFilter.addEventListener('change', handleFilter);
    
    // Gallery item clicks
    allItems.forEach((item, index) => {
        const img = item.querySelector('img');
        img.addEventListener('click', () => openLightbox(index));
        
        // Like button
        const likeBtn = item.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLike(likeBtn);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Close lightbox on outside click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredItems = [...allItems];
    } else {
        filteredItems = allItems.filter(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const category = item.dataset.category;
            
            return title.includes(searchTerm) || 
                   description.includes(searchTerm) || 
                   category.includes(searchTerm);
        });
    }
    
    applyFilters();
}

// Filter functionality
function handleFilter() {
    const category = categoryFilter.value;
    
    // Filter by category
    if (category === 'all') {
        filteredItems = [...allItems];
    } else {
        filteredItems = allItems.filter(item => item.dataset.category === category);
    }
    
    // Apply search filter if there's a search term
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm !== '') {
        filteredItems = filteredItems.filter(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            return title.includes(searchTerm) || description.includes(searchTerm);
        });
    }
    
    applyFilters();
}

// Apply filters and update display
function applyFilters() {
    // Hide all items
    allItems.forEach(item => {
        item.style.display = 'none';
        item.classList.remove('fade-in');
    });
    
    // Show filtered items with animation
    filteredItems.forEach((item, index) => {
        item.style.display = 'block';
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
    
    updateStats();
}

// Toggle filter panel
function toggleFilterPanel() {
    filterPanel.classList.toggle('active');
    filterBtn.classList.toggle('active');
}

// Open lightbox
function openLightbox(index) {
    const item = filteredItems[index];
    const img = item.querySelector('img');
    const title = item.querySelector('h3').textContent;
    const description = item.querySelector('p').textContent;
    
    currentImageIndex = index;
    
    lightboxImg.src = img.src;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightbox.style.display = 'block';
    
    // Increment view count
    incrementViews(item);
}

// Close lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
}

// Navigate to previous image
function previousImage() {
    if (filteredItems.length === 0) return;
    
    currentImageIndex = (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
    openLightbox(currentImageIndex);
}

// Navigate to next image
function nextImage() {
    if (filteredItems.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
    openLightbox(currentImageIndex);
}

// Toggle like
function toggleLike(likeBtn) {
    const isLiked = likeBtn.dataset.liked === 'true';
    
    if (isLiked) {
        likeBtn.dataset.liked = 'false';
        likeBtn.classList.remove('liked');
        likeBtn.innerHTML = '<i class="far fa-heart"></i>';
    } else {
        likeBtn.dataset.liked = 'true';
        likeBtn.classList.add('liked');
        likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
        
        // Show notification
        showNotification('Image liked! ❤️');
    }
}

// Increment views
function incrementViews(item) {
    const currentViews = parseInt(item.dataset.views);
    item.dataset.views = currentViews + 1;
    totalViews++;
    updateStats();
}

// Update statistics
function updateStats() {
    imageCount.textContent = filteredItems.length;
    viewCount.textContent = totalViews;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        z-index: 4000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Keyboard navigation
function handleKeyboard(e) {
    if (lightbox.style.display === 'block') {
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .filter-btn.active {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
    }
`;
document.head.appendChild(style);

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (lightbox.style.display === 'block') {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                previousImage();
            }
        }
    }
}

// Initialize with a welcome message
setTimeout(() => {
    showNotification('Welcome to Modern Gallery! 🎉');
}, 1000);
