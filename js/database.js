// ===================================================================
// SUMBER DATA UTAMA WEBSITE (SINGLE SOURCE OF TRUTH)
// ===================================================================

const PRODUCT_DATABASE = [
    // 9 Goth Products
    { id: 1, name: 'Lace Top', price: 75.00, img: 'assets/goth/gothtop.jpg', category: 'goth', outfit: 'top', stock: 120, rating: 4.5, reviewCount: 82 },
    { id: 2, name: 'Midnight Lace Dress', price: 110.00, img: 'assets/goth/gothdress1.jpg', category: 'goth', outfit: 'dress', stock: 80, rating: 4.3, reviewCount: 90 },
    { id: 3, name: 'Lace Pants', price: 95.00, img: 'assets/goth/gothbot2.jpg', category: 'goth', outfit: 'bottom', stock: 95, rating: 4, reviewCount: 80 },
    { id: 4, name: 'Batwing Buckle Boots', price: 150.00, img: 'https://i.pinimg.com/736x/76/cd/91/76cd914314d2f2b7765fc25d11f92bd4.jpg', category: 'goth', outfit: 'shoes', stock: 60 },
    { id: 5, name: 'Batwing Bodycon Long Dress', price: 60.00, img: 'assets/goth/gothdress.jpg', category: 'goth', outfit: 'dress', stock: 110 },
    { id: 6, name: 'Victorian Mourning Skirt', price: 180.00, img: 'assets/goth/gothbot.jpg', category: 'goth', outfit: 'bottom', stock: 45 },
    
    
    // 9 Y2K Products
    { id: 10, name: 'Cyber Angel Baby Tee', price: 45.00, img: 'assets/products/y2k_top_1.jpg', category: 'y2k', outfit: 'top', stock: 250 },
    { id: 11, name: 'Butterfly Crop Top', price: 40.00, img: 'assets/products/y2k_top_2.jpg', category: 'y2k', outfit: 'top', stock: 300 },
    { id: 12, name: 'Low-Rise Flare Jeans', price: 85.00, img: 'assets/products/y2k_bottom_1.jpg', category: 'y2k', outfit: 'bottom', stock: 150 },
    { id: 13, name: 'Chunky Platform Sandals', price: 90.00, img: 'assets/products/y2k_shoes_1.jpg', category: 'y2k', outfit: 'shoes', stock: 100 },
    { id: 14, name: 'Metallic Puffer Vest', price: 75.00, img: 'assets/products/y2k_dress_1.jpg', category: 'y2k', outfit: 'dress', stock: 80 },
    { id: 15, name: 'Velour Tracksuit', price: 120.00, img: 'assets/products/y2k_bottom_2.jpg', category: 'y2k', outfit: 'bottom', stock: 60 },
    { id: 16, name: 'Rhinestone Trucker Hat', price: 35.00, img: 'assets/products/y2k_top_3.jpg', category: 'y2k', outfit: 'top', stock: 200 },
    { id: 17, name: 'Holographic Mini Skirt', price: 55.00, img: 'assets/products/y2k_bottom_3.jpg', category: 'y2k', outfit: 'bottom', stock: 120 },
    { id: 18, name: 'Transparent PVC Jacket', price: 80.00, img: 'assets/products/y2k_dress_2.jpg', category: 'y2k', outfit: 'dress', stock: 90 },

    // ... (Anda bisa menambahkan produk untuk style lain dengan pola yang sama)

    // 12 Bundle Products
    { id: 101, name: 'Goth Victorian Bundle', price: 199.00, originalPrice: 225.00, img: 'assets/goth/gothbund1.jpg', category: 'bundles', outfit: 'set', stock: 30 },
    { id: 102, name: 'Summer Goth Outfit', price: 280.00, originalPrice: 320.00, img: 'assets/goth/gothbund2.jpeg', category: 'bundles', outfit: 'set', stock: 25 },
    { id: 103, name: 'Visual Kei Punk', price: 180.00, originalPrice: 220.00, img: 'assets/vkei/vkeibund1.jpg', category: 'bundles', outfit: 'set', stock: 15 },

    // ... (dan seterusnya)
];


const OFFERS_DATABASE = [
    { id: 1, title: 'Mid-Year Madness', description: '25% Off All Outerwear', code: 'GLOOM25', type: 'Discount Code', status: 'Active' },
    { id: 2, title: 'First Dose on Us', description: 'Free Shipping First Order', code: 'N/A', type: 'Automatic', status: 'Active' },
    { id: 3, title: 'Style Bundles', description: 'Save 15% on Curated Sets', code: 'N/A', type: 'Automatic', status: 'Active' },
];