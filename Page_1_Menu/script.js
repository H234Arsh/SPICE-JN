// ── MENU DATA ──────────────────────────────────────────────
// 12 items spread across all 5 required categories
const menuItems = [
  {
    name: "Paneer Tikka",
    price: 250,
    category: "Starters",
    emoji: "🧀",
    description: "Grilled cottage cheese cubes marinated in tandoori spices.",
    isVeg: true
  },
  {
    name: "Chicken Shawarma",
    price: 220,
    category: "Starters",
    emoji: "🌯",
    description: "Tender marinated chicken wrapped in soft flatbread with sauce.",
    isVeg: false
  },
  {
    name: "Veg Babycorn Fry",
    price: 190,
    category: "Starters",
    emoji: "🌽",
    description: "Crispy babycorn tossed in chilli garlic sauce.",
    isVeg: true
  },
  {
    name: "Mushroom Masala",
    price: 290,
    category: "Main Course",
    emoji: "🍄",
    description: "Creamy mushroom curry simmered in aromatic Indian spices.",
    isVeg: true
  },
  {
    name: "Fish Curry",
    price: 350,
    category: "Main Course",
    emoji: "🐟",
    description: "Spicy coastal fish curry with coconut milk and tamarind.",
    isVeg: false
  },
  {
    name: "Idiyappam",
    price: 80,
    category: "Main Course",
    emoji: "🍝",
    description: "Soft steamed rice noodles served with coconut milk.",
    isVeg: true
  },
  {
    name: "Hyderabadi Chicken Biryani",
    price: 320,
    category: "Biryani",
    emoji: "🍚",
    description: "Fragrant basmati layered with spiced chicken pieces.",
    isVeg: false
  },
  {
    name: "Paneer Biryani",
    price: 280,
    category: "Biryani",
    emoji: "🍛",
    description: "Aromatic biryani with spiced paneer and fried onions.",
    isVeg: true
  },
  {
    name: "Chocolate Lava Cake",
    price: 200,
    category: "Desserts",
    emoji: "🍫",
    description: "Warm molten chocolate cake with a gooey center.",
    isVeg: true
  },
  {
    name: "Basundhi",
    price: 120,
    category: "Desserts",
    emoji: "🍮",
    description: "Sweetened condensed milk dessert garnished with pistachios.",
    isVeg: true
  },
  {
    name: "Mango Lassi",
    price: 110,
    category: "Beverages",
    emoji: "🥭",
    description: "Chilled blended yoghurt drink with fresh Alphonso mango.",
    isVeg: true
  },
  {
    name: "Masala Chai",
    price: 60,
    category: "Beverages",
    emoji: "🍵",
    description: "Spiced Indian tea brewed with ginger, cardamom, and cloves.",
    isVeg: true
  }
];

// ── CART STATE ──────────────────────────────────────────────
// cart is an array of { item, quantity }
let cart = [];

// ── RENDER CARDS ───────────────────────────────────────────
function renderCards(items) {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = ''; // clear before re-render

  if (items.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);grid-column:1/-1;text-align:center;padding:40px 0">No items in this category.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('menu-card');

    const vegClass = item.isVeg ? 'veg' : 'nonveg';

    card.innerHTML = `
      <div class="card-image">${item.emoji}</div>
      <div class="card-body">
        <div class="card-name-row">
          <span class="veg-dot ${vegClass}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
          <span class="card-name">${item.name}</span>
        </div>
        <p class="card-desc">${item.description}</p>
        <div class="card-footer">
          <span class="card-price">₹${item.price}</span>
          <button class="add-btn" data-name="${item.name}">Add to Cart</button>
        </div>
      </div>
    `;

    // Add-to-cart button handler
    card.querySelector('.add-btn').addEventListener('click', function () {
      addToCart(item);
      const btn = this;
      btn.textContent = 'Added!';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('added');
      }, 1000);
    });

    grid.appendChild(card);
  });
}

// ── CART LOGIC ─────────────────────────────────────────────
function addToCart(item) {
  const existing = cart.find(c => c.item.name === item.name);
  if (existing) {
    existing.quantity += 1; // increment if already in cart
  } else {
    cart.push({ item, quantity: 1 }); // add new entry
  }
  updateCartBar();
}

function updateCartBar() {
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalPrice = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

  document.getElementById('cartCount').textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  document.getElementById('cartTotal').textContent  = `₹${totalPrice}`;

  // Update breakdown list
  const list = document.getElementById('breakdownList');
  list.innerHTML = cart.map(c => `
    <div class="breakdown-row">
      <span>${c.item.name} × ${c.quantity}</span>
      <span>₹${c.item.price * c.quantity}</span>
    </div>
  `).join('');

  document.getElementById('breakdownTotal').innerHTML =
    `<span>Total</span><span>₹${totalPrice}</span>`;
}

// ── CART EXPAND / COLLAPSE ─────────────────────────────────
document.getElementById('cartBarInner').addEventListener('click', () => {
  const breakdown = document.getElementById('cartBreakdown');
  const hint = document.querySelector('.cart-toggle-hint');
  const isOpen = breakdown.classList.toggle('open');
  hint.textContent = isOpen ? '▼ Hide cart' : '▲ View cart';
});

// ── CATEGORY FILTERS ───────────────────────────────────────
document.getElementById('filterBar').addEventListener('click', e => {
  if (!e.target.classList.contains('filter-btn')) return;

  // Highlight active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');

  const category = e.target.dataset.category;

  // Filter items and re-render
  const filtered = category === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === category);

  renderCards(filtered);
});

// ── INITIAL RENDER ─────────────────────────────────────────
renderCards(menuItems);
updateCartBar();