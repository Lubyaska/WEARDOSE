// Menunggu seluruh konten halaman dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // Lakukan pengecekan awal, jika tidak ada database, hentikan script.
    if (typeof PRODUCT_DATABASE === 'undefined') {
        console.error("FATAL ERROR: PRODUCT_DATABASE is not defined. Make sure database.js is loaded BEFORE main.js");
        return;
    }

    // ===================================================================
    // DATABASE KONTEN & TEMA (UNTUK HERO SECTION)
    // ===================================================================
    const styleData = {
        default: { title: 'DEFINE YOUR AESTHETIC', description: 'Browse the curated chaos. Your next statement piece awaits.', theme: 'default', bgImage: 'none' },
        goth: { title: 'GOTH', description: 'Embrace the darkness. A realm of lace, leather, and romantic melancholy.', theme: 'goth', bgImage: 'url(https://images.unsplash.com/photo-1575790635212-9c17c52342dc?q=80&w=1887&auto=format&fit=crop)' },
        y2k: { title: 'Y2K', description: 'Futuristic nostalgia. A vibrant collision of cyber-pop and shiny fabrics.', theme: 'y2k', bgImage: 'url(https://images.unsplash.com/photo-1688841975421-2342c815e985?q=80&w=1887&auto=format&fit=crop)' },
        grunge: { title: 'GRUNGE', description: 'Effortlessly cool. The art of organized chaos with flannel and ripped denim.', theme: 'grunge', bgImage: 'url(https://images.unsplash.com/photo-1593793796246-86b72a0c2a5e?q=80&w=1887&auto=format&fit=crop)' },
        cyberpunk: { title: 'CYBERPUNK', description: 'High-tech, low-life. Navigate the neon-drenched dystopia with functional gear.', theme: 'cyberpunk', bgImage: 'url(https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=1770&auto=format&fit=crop)' },
        cottagecore: { title: 'COTTAGECORE', description: 'A romantic escape to nature. Find beauty in flowing fabrics, floral prints, and a touch of whimsy.', theme: 'cottagecore', bgImage: 'url(https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop)' },
        vkei: { title: 'VISUAL KEI', description: 'A dramatic fusion of glam rock and punk. Extravagant and boundary-pushing.', theme: 'vkei', bgImage: 'url(https://images.unsplash.com/photo-1605733513596-59c853b052a3?q=80&w=1887&auto=format&fit=crop)' },
        bundles: { title: 'STYLE BUNDLES', description: 'The complete look, for less. Get curated sets with a special discount.', theme: 'bundles', bgImage: 'url(assets/bundle-bg.jpg)' }
    };

    // Variabel untuk menyimpan kondisi filter saat ini
    let activeCategoryFilter = 'all';
    let fullFilteredList = [];
    let currentlyDisplayedCount = 0;
    const ITEMS_PER_LOAD = 9;

    // ===================================================================
    // FUNGSI-FUNGSI UTAMA
    // ===================================================================

    function createProductCardHTML(product) {
        const priceHTML = product.originalPrice 
            ? `<del class="text-secondary">$${product.originalPrice.toFixed(2)}</del> $${product.price.toFixed(2)}` 
            : `$${product.price.toFixed(2)}`;
        return `<div class="col-lg-4 col-md-6 mb-5 product-item" data-category="${product.category}" data-outfit="${product.outfit}" data-id="${product.id}"><div class="product-card-shop"><div class="product-image-wrapper"><a href="#" class="product-modal-trigger" data-bs-toggle="modal" data-bs-target="#productDetailModal"><img src="${product.img}" alt="${product.name}"></a><div class="product-hover-actions"><button class="btn-icon add-to-bag-button"><i class="bi bi-bag-plus"></i></button></div></div><div class="product-info-shop"><h5 class="product-title-shop">${product.name}</h5><p class="product-price-shop">${priceHTML}</p></div></div></div>`;
    }

    function displayProducts(productsToDisplay) {
        const productGrid = document.getElementById('product-grid');
        if (productGrid) productGrid.innerHTML = productsToDisplay.map(createProductCardHTML).join('');
    }
    
    function appendProducts(productsToAppend) {
        const productGrid = document.getElementById('product-grid');
        if (productGrid) productGrid.insertAdjacentHTML('beforeend', productsToAppend.map(createProductCardHTML).join(''));
    }

    function manageLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) loadMoreBtn.style.display = (currentlyDisplayedCount < fullFilteredList.length) ? 'block' : 'none';
    }

    function runFilterAndRender() {
        const checkedOutfitFilters = document.querySelectorAll('#outfit-filter .form-check-input:checked');
        const selectedOutfits = Array.from(checkedOutfitFilters).map(checkbox => checkbox.value);
        let filteredProducts = PRODUCT_DATABASE;
        if (activeCategoryFilter !== 'all') { filteredProducts = filteredProducts.filter(p => p.category === activeCategoryFilter); }
        if (selectedOutfits.length > 0) { filteredProducts = filteredProducts.filter(p => selectedOutfits.includes(p.outfit)); }
        fullFilteredList = filteredProducts;
        const initialItems = fullFilteredList.slice(0, ITEMS_PER_LOAD);
        currentlyDisplayedCount = initialItems.length;
        displayProducts(initialItems);
        manageLoadMoreButton();
        if (typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 50);
    }

    function updateHeroAndTheme(category) {
        const data = styleData[category] || styleData.default;
        const hero = document.getElementById('shop-hero');
        const heroTitle = document.getElementById('shop-hero-title');
        const heroDesc = document.getElementById('shop-hero-description');
        const filterTrigger = document.getElementById('filter-trigger-wrapper');
        if (hero && heroTitle && heroDesc) {
            heroTitle.textContent = data.title;
            heroDesc.textContent = data.description;
            hero.style.backgroundImage = data.bgImage;
        }
        document.body.dataset.theme = data.theme;
        if(filterTrigger) { filterTrigger.style.display = (category === 'bundles') ? 'none' : 'flex'; }
    }
    
    function updateActiveCategoryButton(category) {
        document.querySelectorAll('.btn-category').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) { btn.classList.add('active'); }
        });
    }

    function flyToCart(startElement, productId) {
        const flyingImg = startElement.cloneNode(true);
        const cartIcon = document.getElementById('cart-icon-link');
        if (!flyingImg || !cartIcon) return;
        
        const startRect = startElement.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        flyingImg.classList.add('flying-product-img');
        document.body.appendChild(flyingImg);

        Object.assign(flyingImg.style, {
            position: 'fixed',
            top: `${startRect.top}px`,
            left: `${startRect.left}px`,
            width: `${startRect.width}px`,
            height: `${startRect.height}px`,
        });

        requestAnimationFrame(() => {
            Object.assign(flyingImg.style, {
                top: `${cartRect.top + (cartRect.height / 2)}px`,
                left: `${cartRect.left + (cartRect.width / 2)}px`,
                width: '0px',
                height: '0px',
                opacity: '0',
            });
        });

        setTimeout(() => {
            flyingImg.remove();
            addItemToCart(productId);
        }, 700);
    }
    
    function getCart() {
        return JSON.parse(sessionStorage.getItem('weardoseCart')) || [];
    }

    function saveCart(cart) {
        sessionStorage.setItem('weardoseCart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
    }

    function addItemToCart(productId) {
        let cart = getCart();
        const productData = PRODUCT_DATABASE.find(p => p.id === productId);
        if (!productData) return;
        
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({ id: productData.id, name: productData.name, price: productData.price, img: productData.img, quantity: 1 });
        }
        saveCart(cart);
    }

    // ===================================================================
    // LOGIKA YANG DIJALANKAN
    // ===================================================================

    // --- Logika Khusus Halaman Shop ---
    if (document.querySelector('.shop-hero-section')) {
        const urlParams = new URLSearchParams(window.location.search);
        activeCategoryFilter = urlParams.get('category') || 'all';
        
        updateHeroAndTheme(activeCategoryFilter);
        updateActiveCategoryButton(activeCategoryFilter);
        runFilterAndRender();

        const categoryButtons = document.querySelectorAll('.btn-category');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                activeCategoryFilter = button.dataset.filter;
                document.querySelectorAll('#outfit-filter .form-check-input').forEach(cb => cb.checked = false);
                updateHeroAndTheme(activeCategoryFilter);
                updateActiveCategoryButton(activeCategoryFilter);
                runFilterAndRender();
            });
        });

        const applyFiltersBtn = document.getElementById('apply-filters-btn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                runFilterAndRender();
                const offcanvasEl = document.getElementById('offcanvasFilters');
                const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (offcanvas) { offcanvas.hide(); }
            });
        }
        
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                const nextItems = fullFilteredList.slice(currentlyDisplayedCount, currentlyDisplayedCount + ITEMS_PER_LOAD);
                appendProducts(nextItems);
                currentlyDisplayedCount += nextItems.length;
                manageLoadMoreButton();
                if (typeof AOS !== 'undefined') setTimeout(() => AOS.refresh(), 50);
            });
        }
    }

    // --- Logika yang Berjalan di Banyak Halaman ---
    document.body.addEventListener('click', (event) => {
        const addToBagBtn = event.target.closest('.btn-add-to-bag, .add-to-bag-button');
        if (addToBagBtn) {
            event.preventDefault();
            if (sessionStorage.getItem('isLoggedIn') === 'true') {
                let imageToFly;
                let productId;
                const modal = event.target.closest('.modal');
                const card = event.target.closest('.product-item');

                if (modal && modal.id === 'productDetailModal') {
                    imageToFly = modal.querySelector('.modal-main-image');
                    productId = parseInt(modal.dataset.productId);
                } else if(card) {
                    imageToFly = card.querySelector('img');
                    productId = parseInt(card.dataset.id);
                }
                if (imageToFly && productId) flyToCart(imageToFly, productId);
            } else {
                window.location.href = 'login.html';
            }
        }
    });

    const productDetailModal = document.getElementById('productDetailModal');
    if (productDetailModal) {
        productDetailModal.addEventListener('show.bs.modal', event => {
            const triggerLink = event.relatedTarget;
            if (!triggerLink) return;
            const sourceCard = triggerLink.closest('.product-item');
            if (!sourceCard) return;
            const productId = parseInt(sourceCard.dataset.id);
            const productData = PRODUCT_DATABASE.find(p => p.id === productId);
            if (!productData) return;

            productDetailModal.dataset.productId = productId; // Simpan ID di modal
            
            const priceHTML = productData.originalPrice ? `<del class="text-secondary">$${productData.originalPrice.toFixed(2)}</del> $${productData.price.toFixed(2)}` : `$${productData.price.toFixed(2)}`;
            productDetailModal.querySelector('#modalProductName').textContent = productData.name;
            productDetailModal.querySelector('#modalProductPrice').innerHTML = priceHTML;
            productDetailModal.querySelector('#modalProductImage').src = productData.img;

            const ratingContainer = productDetailModal.querySelector('.star-rating');
            const reviewCountEl = productDetailModal.querySelector('.review-count');
            const modalRatingWrapper = document.getElementById('modalProductRating');
            if (productData.rating && ratingContainer && reviewCountEl && modalRatingWrapper) {
                const rating = parseFloat(productData.rating);
                const fullStars = Math.floor(rating);
                const halfStar = rating % 1 >= 0.5;
                let starsHTML = '';
                for (let i = 0; i < fullStars; i++) { starsHTML += `<i class="bi bi-star-fill filled"></i>`; }
                if (halfStar) { starsHTML += `<i class="bi bi-star-half filled"></i>`; }
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                for (let i = 0; i < emptyStars; i++) { starsHTML += `<i class="bi bi-star"></i>`; }
                ratingContainer.innerHTML = starsHTML;
                reviewCountEl.textContent = `(${productData.reviewCount} reviews)`;
                modalRatingWrapper.style.display = 'flex';
            } else if (modalRatingWrapper) {
                modalRatingWrapper.style.display = 'none';
            }

            const recommendationsGrid = document.getElementById('modalRecommendationsGrid');
            if (recommendationsGrid) {
                recommendationsGrid.innerHTML = ''; 
                const recommendations = PRODUCT_DATABASE.filter(item => item.category === productData.category && item.id !== productData.id).slice(0, 4); 
                if (recommendations.length > 0) {
                    recommendations.forEach(recItem => {
                        const recPrice = recItem.originalPrice ? `<del class="text-secondary">$${recItem.originalPrice.toFixed(2)}</del> $${recItem.price.toFixed(2)}` : `$${recItem.price.toFixed(2)}`;
                        const recCardHTML = `<div class="col-6 col-md-3"><div class="rec-card"><a href="#"><img src="${recItem.img}" alt="${recItem.name}"><div class="rec-info"><h6>${recItem.name}</h6><span>${recPrice}</span></div></a></div></div>`;
                        recommendationsGrid.innerHTML += recCardHTML;
                    });
                    productDetailModal.querySelector('.recommendations-section').style.display = 'block';
                } else {
                    productDetailModal.querySelector('.recommendations-section').style.display = 'none';
                }
            }
        });
    }

    // Inisialisasi AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }
});