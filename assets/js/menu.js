document.addEventListener('DOMContentLoaded', function() {
            // Tab switching functionality
            const tabBtns = document.querySelectorAll('.tab-btn');
            const menuCategories = document.querySelectorAll('.menu-category');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    tabBtns.forEach(b => b.classList.remove('active'));
                    menuCategories.forEach(cat => cat.classList.remove('active'));
                    
                    this.classList.add('active');
                    const categoryId = this.getAttribute('data-category');
                    document.getElementById(categoryId).classList.add('active');
                });
            });
            
            // Cart functionality
            const cart = [];
            const cartIcon = document.getElementById('cartIcon');
            const cartCount = document.getElementById('cartCount');
            const cartSidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('overlay');
            const closeCart = document.getElementById('closeCart');
            const cartItemsContainer = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const notification = document.getElementById('notification');
            
            // Toggle cart sidebar
            cartIcon.addEventListener('click', toggleCart);
            closeCart.addEventListener('click', toggleCart);
            overlay.addEventListener('click', toggleCart);
            
            function toggleCart() {
                cartSidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            }
            
            // Quantity controls
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const menuItem = this.closest('.menu-item');
                    const quantityElement = menuItem.querySelector('.quantity');
                    let quantity = parseInt(quantityElement.textContent);
                    
                    if (this.classList.contains('plus')) {
                        quantity++;
                    } else if (this.classList.contains('minus') && quantity > 0) {
                        quantity--;
                    }
                    
                    quantityElement.textContent = quantity;
                });
            });
            
            // Add to cart functionality
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', function() {
                    const menuItem = this.closest('.menu-item');
                    const id = menuItem.getAttribute('data-id');
                    const name = menuItem.getAttribute('data-name');
                    const price = parseFloat(menuItem.getAttribute('data-price'));
                    const quantity = parseInt(menuItem.querySelector('.quantity').textContent);
                    
                    if (quantity === 0) return;
                    
                    // Check if item already in cart
                    const existingItem = cart.find(item => item.id === id);
                    
                    if (existingItem) {
                        existingItem.quantity += quantity;
                    } else {
                        cart.push({
                            id,
                            name,
                            price,
                            quantity
                        });
                    }
                    
                    // Update cart UI
                    updateCart();
                    
                    // Show notification
                    showNotification(`${quantity} ${name}(s) added to cart`);
                    
                    // Reset quantity
                    menuItem.querySelector('.quantity').textContent = '0';
                });
            });
            
            function updateCart() {
                // Update cart count
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = totalItems;
                
                // Update cart items list
                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
                } else {
                    cartItemsContainer.innerHTML = '';
                    cart.forEach(item => {
                        const cartItemElement = document.createElement('div');
                        cartItemElement.className = 'cart-item';
                        cartItemElement.innerHTML = `
                            <div class="cart-item-info">
                                <div class="cart-item-name">${item.name}</div>
                                <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                        `;
                        cartItemsContainer.appendChild(cartItemElement);
                    });
                    
                    // Add event listeners to cart quantity buttons
                    document.querySelectorAll('.cart-item .quantity-btn').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const itemId = this.getAttribute('data-id');
                            const itemIndex = cart.findIndex(item => item.id === itemId);
                            
                            if (this.classList.contains('plus')) {
                                cart[itemIndex].quantity++;
                            } else if (this.classList.contains('minus')) {
                                cart[itemIndex].quantity--;
                                if (cart[itemIndex].quantity === 0) {
                                    cart.splice(itemIndex, 1);
                                }
                            }
                            
                            updateCart();
                        });
                    });
                }
                
                // Update total
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
            }
            
            function showNotification(message) {
                notification.textContent = message;
                notification.classList.add('active');
                
                setTimeout(() => {
                    notification.classList.remove('active');
                }, 3000);
            }
            
            // Animation for menu items
            const observerOptions = {
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            document.querySelectorAll('.menu-item').forEach(item => {
                item.style.opacity = 0;
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(item);
            });
        });