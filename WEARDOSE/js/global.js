document.addEventListener('DOMContentLoaded', () => {
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        if (cartCountElements.length === 0) return;
        const cartCount = sessionStorage.getItem('cartItemCount') || 0;
        cartCountElements.forEach(el => {
            if (cartCount > 0) {
                el.textContent = cartCount;
                el.classList.remove('d-none');
            } else {
                el.classList.add('d-none');
            }
        });
    }

    function checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const profileIconLinks = document.querySelectorAll('#profile-icon-link');
        profileIconLinks.forEach(link => {
            if (link) { link.href = (isLoggedIn === 'true') ? 'profile.html' : 'login.html'; }
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('cartItemCount');
            updateCartCount();
        });
    }

    checkLoginStatus();
    updateCartCount();
    
    window.addEventListener('cartUpdated', () => {
        const cartIcon = document.getElementById('cart-icon-link');
        updateCartCount();
        if (cartIcon) {
            cartIcon.classList.add('shake');
            setTimeout(() => cartIcon.classList.remove('shake'), 500);
        }
    });

    const ratingModal = document.getElementById('ratingModal');
    if(ratingModal){
        let currentRating = 0;
        const stars = ratingModal.querySelectorAll('.rating-stars-input i');

        ratingModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            document.getElementById('ratingProductName').textContent = button.dataset.productName;
            // Reset stars
            stars.forEach(s => s.classList.remove('active'));
            currentRating = 0;
        });

        stars.forEach(star => {
            star.addEventListener('click', function() {
                currentRating = this.dataset.value;
                stars.forEach(s => {
                    s.classList.toggle('active', s.dataset.value <= currentRating);
                });
            });
        });
    }
});