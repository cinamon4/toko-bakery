// ================= DATA MENU KAFE =================
// Kamu bisa menambah, mengubah, atau menghapus daftar menu di sini dengan mudah
const menuData = [
    { id: 1, name: "Kopi Susu Senja", category: "coffee", price: 22000, desc: "Espresso dengan fresh milk dan gula aren asli.", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=80", badge: "Best Seller" },
    { id: 2, name: "Caramel Macchiato", category: "coffee", price: 28000, desc: "Espresso, susu segar, dan sirup karamel lezat.", img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80", badge: "Favorit" },
    { id: 3, name: "Matcha Latte", category: "non-coffee", price: 26000, desc: "Bubuk matcha premium Jepang dengan susu creamy.", img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=500&q=80", badge: "New" },
    { id: 4, name: "Ice Chocolate Signature", category: "non-coffee", price: 25000, desc: "Cokelat leleh khas dengan es batu segar.", img: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=500&q=80", badge: "" },
    { id: 5, name: "Croissant Almond", category: "food", price: 20000, desc: "Roti croissant renyah dengan taburan kacang almond.", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80", badge: "Snack" },
    { id: 6, name: "French Fries Special", category: "food", price: 18000, desc: "Kentang goreng gurih dengan bumbu keju tabur.", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80", badge: "Favorit" },
    { id: 7, name: "Tiramisu Cake", category: "dessert", price: 30000, desc: "Kue lembut dengan rasa kopi dan mascarpone.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=500&q=80", badge: "Sweet" }
];

// Array penampung keranjang belanja pelanggan
let cart = [];

// ================= MENANGKAP ELEMEN DARI HTML =================
const menuGrid = document.getElementById('menuGrid');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.cat-btn');
const cartFloating = document.getElementById('cartFloating');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.getElementById('closeModal');
const cartItemsList = document.getElementById('cartItemsList');
const modalTotalAmount = document.getElementById('modalTotalAmount');
const sendWhatsApp = document.getElementById('sendWhatsApp');
const tableNumberInput = document.getElementById('tableNumber');

// Elemen untuk Mini Games
const spinBtn = document.getElementById('spinBtn');
const gameModal = document.getElementById('gameModal');
const closeGameModal = document.getElementById('closeGameModal');
const spinActionBtn = document.getElementById('spinActionBtn');
const gameResultText = document.getElementById('gameResultText');

// ================= FUNGSI RENDER MENU KE HTML =================
function displayMenu(items) {
    menuGrid.innerHTML = '';
    if (items.length === 0) {
        menuGrid.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: #636e72;">Menu tidak ditemukan.</p>`;
        return;
    }
    items.forEach(item => {
        const card = document.createElement('article');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="menu-img-container">
                <img src="${item.img}" alt="${item.name}">
                ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
            </div>
            <div class="menu-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <div class="menu-footer">
                    <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">+ Tambah</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// ================= FUNGSI TAMBAH KE KERANJANG =================
function addToCart(id) {
    const product = menuData.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

// ================= FUNGSI UPDATE TAMPILAN KERANJANG =================
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    cartCount.innerText = totalItems;
    cartTotal.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;

    if (totalItems > 0) {
        cartFloating.classList.add('show');
    } else {
        cartFloating.classList.remove('show');
    }
}

// ================= FILTER BERDASARKAN KATEGORI =================
categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const cat = e.target.getAttribute('data-category');
        if (cat === 'all') {
            displayMenu(menuData);
        } else {
            const filtered = menuData.filter(item => item.category === cat);
            displayMenu(filtered);
        }
    });
});

// ================= FITUR PENCARIAN REAL-TIME =================
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filtered = menuData.filter(item => 
        item.name.toLowerCase().includes(keyword) || 
        item.desc.toLowerCase().includes(keyword)
    );
    displayMenu(filtered);
});

// ================= MODAL CHECKOUT & WHATSAPP =================
checkoutBtn.addEventListener('click', () => {
    cartItemsList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `<span>${item.name} (x${item.qty})</span> <strong>Rp ${subtotal.toLocaleString('id-ID')}</strong>`;
        cartItemsList.appendChild(row);
    });
    modalTotalAmount.innerText = `Rp ${total.toLocaleString('id-ID')}`;
    checkoutModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
});

sendWhatsApp.addEventListener('click', () => {
    const tableNo = tableNumberInput.value.trim();
    if (!tableNo) {
        alert("Mohon masukkan nomor meja terlebih dahulu!");
        return;
    }
    let message = `Halo Kak, saya ingin memesan menu berikut:\n\n*No Meja:* ${tableNo}\n`;
    let total = 0;
    cart.forEach(item => {
        message += `- ${item.name} (x${item.qty}) : Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n`;
        total += item.price * item.qty;
    });
    message += `\n*Total Pembayaran:* Rp ${total.toLocaleString('id-ID')}\n\nMohon segera diproses ya, terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    // Ganti nomor WhatsApp di bawah ini dengan nomor kasir kafe (Format: 628xxxxxxxxxx)
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
});

// ================= LOGIKA MINI GAMES / UNDIAN =================
spinBtn.addEventListener('click', () => {
    gameModal.style.display = 'flex';
    gameResultText.innerText = "Klik tombol di bawah untuk mencoba peruntunganmu mendapatkan diskon menarik!";
    spinActionBtn.style.display = 'block';
});

closeGameModal.addEventListener('click', () => {
    gameModal.style.display = 'none';
});

spinActionBtn.addEventListener('click', () => {
    const rewards = [
        "Selamat! Anda mendapatkan Diskon 10% untuk total pesanan hari ini!",
        "Hoki banget! Anda berhak mendapatkan Free Es Teh Manis!",
        "Wah, hampir dapat! Coba lagi saat berkunjung berikutnya ya!",
        "Selamat! Anda mendapatkan Diskon Rp 5.000 untuk pembelian kopi!"
    ];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    gameResultText.innerHTML = `🎁 <strong>${randomReward}</strong><br><br><span style="font-size:0.85rem; color:#636e72;">Tunjukkan layar ini ke kasir saat melakukan pembayaran.</span>`;
    spinActionBtn.style.display = 'none';
});

// Jalankan fungsi tampilkan menu saat halaman pertama kali dibuka
displayMenu(menuData);
