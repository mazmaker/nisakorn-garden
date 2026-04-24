// Nisakorn Garden Web PR & E-Commerce - Main JavaScript

// Global Variables
let cart = JSON.parse(localStorage.getItem('nisakornCart')) || [];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initCart();
    initAnimations();
    initBackToTop();
    updateCartUI();

    // Initialize search if on products page
    if (window.location.pathname.includes('products.html')) {
        initProductFilters();
    }
});

// Navigation Functions
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');

            // Toggle hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (hamburger.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });

        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        });
    }
}

// Cart Functions
function initCart() {
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            const productPrice = parseFloat(this.dataset.price);
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productImage = productCard.querySelector('.product-image img').src;

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        });
    });
}

function addToCart(product) {
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // Increase quantity if product exists
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // Add new product to cart
        cart.push(product);
    }

    // Save to localStorage
    localStorage.setItem('nisakornCart', JSON.stringify(cart));

    // Update UI
    updateCartUI();

    // Show success message
    showNotification(`เพิ่ม "${product.name}" ในตะกร้าแล้ว`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('nisakornCart', JSON.stringify(cart));
    updateCartUI();

    // Refresh cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
}

function updateCartQuantity(productId, quantity) {
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            cart[productIndex].quantity = quantity;
            localStorage.setItem('nisakornCart', JSON.stringify(cart));
            updateCartUI();

            // Refresh cart page if we're on it
            if (window.location.pathname.includes('cart.html')) {
                renderCartItems();
            }
        }
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');

    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Animate cart count
        if (totalItems > 0) {
            cartCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);
        }
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    localStorage.setItem('nisakornCart', JSON.stringify(cart));
    updateCartUI();
}

// Cart Page Functions
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #e2e8f0; margin-bottom: 1rem;"></i>
                <h3>ตะกร้าสินค้าว่าง</h3>
                <p>ยังไม่มีสินค้าในตะกร้า เริ่มเลือกซื้อสินค้าที่คุณชื่นชอบ</p>
                <a href="products.html" class="btn btn-primary">เลือกซื้อสินค้า</a>
            </div>
        `;

        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }

    let cartHTML = '';
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-price">฿${item.price.toLocaleString()}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn minus" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total">
                    ฿${(item.price * item.quantity).toLocaleString()}
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;

    // Update cart summary
    if (cartSummary) {
        const subtotal = getCartTotal();
        const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 THB
        const total = subtotal + shipping;

        cartSummary.innerHTML = `
            <h3>สรุปการสั่งซื้อ</h3>
            <div class="summary-row">
                <span>ยอดรวมสินค้า</span>
                <span>฿${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>ค่าจัดส่ง</span>
                <span>${shipping === 0 ? 'ฟรี' : '฿' + shipping}</span>
            </div>
            ${shipping === 0 ? '<div class="free-shipping-notice">🎉 ได้รับการจัดส่งฟรี!</div>' : ''}
            <div class="summary-row total">
                <span>ยอดรวมทั้งสิ้น</span>
                <span>฿${total.toLocaleString()}</span>
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()">
                ดำเนินการชำระเงิน
            </button>
        `;
        cartSummary.style.display = 'block';
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('ตะกร้าสินค้าว่าง กรุณาเลือกสินค้าก่อน', 'error');
        return;
    }

    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInUp');
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.product-card, .feature-card, .testimonial-card, .section-header');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Product Filters (for products page)
function initProductFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortSelect = document.getElementById('sortSelect');

    if (searchInput) {
        // Debounce search input
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterProducts();
            }, 300);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('categoryFilter')?.value || 'all';
    const productCards = document.querySelectorAll('.product-card');
    const currentCount = document.getElementById('currentCount');

    let visibleCount = 0;

    productCards.forEach(card => {
        const productName = card.dataset.name?.toLowerCase() || '';
        const productCategory = card.dataset.category || '';

        const matchesSearch = productName.includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (currentCount) {
        currentCount.textContent = visibleCount;
    }
}

function sortProducts() {
    const sortValue = document.getElementById('sortSelect')?.value;
    const productsGrid = document.getElementById('productsGrid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    if (!sortValue || !productsGrid) return;

    productCards.sort((a, b) => {
        switch(sortValue) {
            case 'name':
                return (a.dataset.name || '').localeCompare(b.dataset.name || '');
            case 'price-low':
                return (parseFloat(a.dataset.price) || 0) - (parseFloat(b.dataset.price) || 0);
            case 'price-high':
                return (parseFloat(b.dataset.price) || 0) - (parseFloat(a.dataset.price) || 0);
            case 'popular':
                // For demo purposes, shuffle the array
                return Math.random() - 0.5;
            default:
                return 0;
        }
    });

    // Re-append sorted cards
    productCards.forEach(card => {
        productsGrid.appendChild(card);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#4299e1'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-family: var(--font-family);
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;

    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Utility Functions
function formatPrice(price) {
    return `฿${price.toLocaleString()}`;
}

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

// Form Validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// Image Lazy Loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.showNotification = showNotification;
window.renderCartItems = renderCartItems;