document.addEventListener('DOMContentLoaded', () => {
    // Fungsi untuk mengambil data keranjang
    function getCart() {
        return JSON.parse(sessionStorage.getItem('weardoseCart')) || [];
    }

    // Fungsi untuk menampilkan ringkasan pesanan
    function renderCheckoutSummary() {
        const cart = getCart();
        const summaryItemsContainer = document.getElementById('checkout-summary-items');
        const subtotalEl = document.getElementById('summary-subtotal');
        const totalEl = document.getElementById('summary-total');
        const shippingCost = 5.00;

        if (!summaryItemsContainer || !subtotalEl || !totalEl) return;

        summaryItemsContainer.innerHTML = ''; // Kosongkan ringkasan lama
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemHTML = `
                <div class="d-flex justify-content-between mb-3">
                    <div class="d-flex">
                        <img src="${item.img}" class="img-fluid me-3" style="width: 60px;">
                        <div>
                            <span>${item.name}</span><br>
                            <small class="text-secondary">Qty: ${item.quantity}</small>
                        </div>
                    </div>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
            summaryItemsContainer.innerHTML += itemHTML;
        });

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
    }

    // Logika untuk tombol "Complete Order"
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah form submit secara normal

            // Simulasi: Kosongkan keranjang
            sessionStorage.removeItem('weardoseCart');
            sessionStorage.removeItem('cartItemCount');
            
            // Kirim event agar ikon keranjang di navbar update
            window.dispatchEvent(new Event('cartUpdated'));

            // Arahkan ke halaman konfirmasi
            window.location.href = 'confirmation.html';
        });
    }
    
    // Panggil fungsi untuk menampilkan ringkasan saat halaman dimuat
    renderCheckoutSummary();
});