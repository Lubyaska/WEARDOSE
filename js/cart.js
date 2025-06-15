document.addEventListener('DOMContentLoaded', () => {

    const cartTableBody = document.getElementById('cart-table-body');
    const subtotalEl = document.getElementById('summary-subtotal');
    const totalEl = document.getElementById('summary-total');
    const shippingCost = 5.00; // Contoh biaya ongkir

    function getCart() {
        return JSON.parse(sessionStorage.getItem('weardoseCart')) || [];
    }

    function saveCart(cart) {
        sessionStorage.setItem('weardoseCart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); // Kirim event agar navbar update
        renderCart(); // Gambar ulang tampilan keranjang
    }

    function renderCart() {
        const cart = getCart();

        if (cart.length === 0) {
            document.getElementById('cart-empty').classList.remove('d-none');
            document.getElementById('cart-items-container').classList.add('d-none');
            document.getElementById('cart-summary-container').classList.add('d-none');
            return;
        }

        cartTableBody.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const rowHTML = `
                <tr data-id="${item.id}">
                    <td style="width: 100px;"><img src="${item.img}" class="img-fluid" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-selector">
                            <button class="btn btn-sm btn-outline-secondary btn-decrease">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary btn-increase">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="btn btn-sm btn-remove-item"><i class="bi bi-x-lg"></i></button></td>
                </tr>
            `;
            cartTableBody.innerHTML += rowHTML;
        });

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
    }

    // Event listener untuk tombol di tabel keranjang
    cartTableBody.addEventListener('click', (event) => {
        const target = event.target;
        const row = target.closest('tr');
        if (!row) return;

        const id = parseInt(row.dataset.id);
        let cart = getCart();
        const productIndex = cart.findIndex(item => item.id === id);

        if (productIndex === -1) return;

        if (target.closest('.btn-increase')) {
            cart[productIndex].quantity++;
        } else if (target.closest('.btn-decrease')) {
            if (cart[productIndex].quantity > 1) {
                cart[productIndex].quantity--;
            } else {
                // Jika kuantitas 1 dan dikurangi, hapus item
                cart.splice(productIndex, 1);
            }
        } else if (target.closest('.btn-remove-item')) {
            cart.splice(productIndex, 1);
        }
        
        saveCart(cart);
    });

    renderCart(); // Panggil fungsi saat halaman dimuat
});