document.addEventListener('DOMContentLoaded', () => {
    // Cek jika database ada, jika tidak, hentikan script
    if (typeof PRODUCT_DATABASE === 'undefined' || typeof OFFERS_DATABASE === 'undefined') {
        console.error("Database not found. Make sure database.js is loaded before admin.js");
        return;
    }

    const pages = document.querySelectorAll('.admin-page');
    const navLinks = document.querySelectorAll('.admin-nav-link');
    const bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('adminSidebar'));

    // ===================================================================
    // FUNGSI RENDER (MENGGAMBAR ULANG DATA KE TABEL)
    // ===================================================================
    
    function renderProductTable() {
        const tableBody = document.getElementById('product-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        PRODUCT_DATABASE.forEach(product => {
            const price = product.originalPrice ? `<del class="text-secondary">$${product.originalPrice.toFixed(2)}</del> $${product.price.toFixed(2)}` : `$${product.price.toFixed(2)}`;
            const rowHTML = `
                <tr data-id="${product.id}">
                    <td><img src="../${product.img}" alt="${product.name}"></td>
                    <td class="product-name">${product.name}</td>
                    <td class="product-category">${product.category}</td>
                    <td class="product-price">${product.price.toFixed(2)}</td>
                    <td class="product-stock">${product.stock}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-light btn-edit" data-bs-toggle="modal" data-bs-target="#addEditProductModal"><i class="bi bi-pencil-fill"></i></button> 
                        <button class="btn btn-sm btn-outline-danger btn-delete" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', rowHTML);
        });
    }

    function renderDiscountTable() {
        const tableBody = document.getElementById('discount-table-body');
        if (!tableBody) return;
        tableBody.innerHTML = '';
        OFFERS_DATABASE.forEach(offer => {
            const rowHTML = `
                <tr data-id="${offer.id}">
                    <td>${offer.title}</td>
                    <td>${offer.description}</td>
                    <td><span class="badge text-bg-secondary">${offer.type}</span></td>
                    <td>${offer.code}</td>
                    <td><span class="badge text-bg-success">${offer.status}</span></td>
                    <td>
                         <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash-fill"></i></button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', rowHTML);
        });
    }

    // ===================================================================
    // LOGIKA NAVIGASI SPA
    // ===================================================================
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            const targetPage = document.getElementById(targetId);

            if (targetPage) {
                pages.forEach(page => page.classList.add('d-none'));
                targetPage.classList.remove('d-none');
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
            
            if (window.innerWidth < 992) {
                bsOffcanvas.hide();
            }
        });
    });

    // ===================================================================
    // LOGIKA MODAL (ADD/EDIT/DELETE)
    // ===================================================================
    
    // Modal Produk
    const addEditModalEl = document.getElementById('addEditProductModal');
    if (addEditModalEl) {
        const addEditModal = new bootstrap.Modal(addEditModalEl);
        const modalTitle = addEditModalEl.querySelector('#modal-title');
        const productForm = addEditModalEl.querySelector('#product-form');
        const saveProductBtn = addEditModalEl.querySelector('#save-product-btn');
        let editMode = false;
        let productToEditId = null;

        addEditModalEl.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            
            if (button.id === 'add-new-product-btn') {
                editMode = false;
                modalTitle.textContent = 'Add New Product';
                productForm.reset();
            } else {
                editMode = true;
                modalTitle.textContent = 'Edit Product';
                const row = button.closest('tr');
                productToEditId = parseInt(row.dataset.id);
                const productData = PRODUCT_DATABASE.find(p => p.id === productToEditId);

                if (productData) {
                    productForm.querySelector('#form-product-name').value = productData.name;
                    productForm.querySelector('#form-product-category').value = productData.category;
                    productForm.querySelector('#form-product-price').value = productData.price;
                    productForm.querySelector('#form-product-stock').value = productData.stock;
                    productForm.querySelector('#form-product-img').value = productData.img;
                }
            }
        });
        
        saveProductBtn.addEventListener('click', () => {
            const name = productForm.querySelector('#form-product-name').value;
            const category = productForm.querySelector('#form-product-category').value;
            const price = parseFloat(productForm.querySelector('#form-product-price').value);
            const stock = parseInt(productForm.querySelector('#form-product-stock').value);
            const img = productForm.querySelector('#form-product-img').value;

            if (!name || !price) { alert('Product Name and Price are required.'); return; }

            if (editMode) {
                const productIndex = PRODUCT_DATABASE.findIndex(p => p.id === productToEditId);
                if (productIndex > -1) {
                    PRODUCT_DATABASE[productIndex] = { ...PRODUCT_DATABASE[productIndex], name, category, price, stock, img };
                }
            } else {
                const newProduct = {
                    id: Date.now(), name, price, img, category, outfit: 'top', stock
                };
                PRODUCT_DATABASE.push(newProduct);
            }
            
            renderProductTable();
            addEditModal.hide();
        });
    }

    // Modal Diskon
    const addDiscountModalEl = document.getElementById('addDiscountModal');
    if(addDiscountModalEl){
        const addDiscountForm = addDiscountModalEl.querySelector('#discount-form');
        const saveDiscountBtn = addDiscountModalEl.querySelector('#save-discount-btn');
        const addDiscountModal = new bootstrap.Modal(addDiscountModalEl);

        saveDiscountBtn.addEventListener('click', () => {
            const newOffer = {
                id: Date.now(),
                title: addDiscountForm.querySelector('#form-discount-title').value,
                description: addDiscountForm.querySelector('#form-discount-desc').value,
                code: addDiscountForm.querySelector('#form-discount-code').value || 'N/A',
                type: 'Discount Code',
                status: 'Active'
            };
            OFFERS_DATABASE.push(newOffer);
            renderDiscountTable();
            addDiscountForm.reset();
            addDiscountModal.hide();
        });
    }

    // Modal Delete
    document.getElementById('product-table-body')?.addEventListener('click', function (event) {
        if (event.target.closest('.btn-delete')) {
            const deleteButton = event.target.closest('.btn-delete');
            const rowToDelete = deleteButton.closest('tr');
            const productId = parseInt(rowToDelete.dataset.id);
            const productName = rowToDelete.querySelector('.product-name').textContent;

            const deleteModalEl = document.getElementById('deleteConfirmModal');
            const deleteModal = new bootstrap.Modal(deleteModalEl);
            
            deleteModalEl.querySelector('#product-name-to-delete').textContent = productName;
            
            const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
            
            // Clone and replace the button to remove old event listeners
            const newConfirmBtn = confirmDeleteBtn.cloneNode(true);
            confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, confirmDeleteBtn);
            
            newConfirmBtn.addEventListener('click', () => {
                const productIndex = PRODUCT_DATABASE.findIndex(p => p.id === productId);
                if (productIndex > -1) {
                    PRODUCT_DATABASE.splice(productIndex, 1);
                }
                renderProductTable();
                deleteModal.hide();
            });

            deleteModal.show();
        }
    });

    // ===================================================================
    // INISIALISASI HALAMAN
    // ===================================================================
    renderProductTable();
    renderDiscountTable();
});