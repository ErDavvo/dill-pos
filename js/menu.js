// menu.js

let fullMenu = {};

// 🔄 Carica menu dal server
async function loadMenu() {
  const res = await fetch('http://localhost:3000/menu');
  const dishes = await res.json();

  // Raggruppa per categoria
  fullMenu = {};
  dishes.forEach(dish => {
    if (!fullMenu[dish.category]) {
      fullMenu[dish.category] = [];
    }
    fullMenu[dish.category].push([dish.name, dish.price]);
  });

  renderMenu();
}

function renderMenu() {
    const container = document.getElementById('menu-content');
    container.innerHTML = '';

    for (const category in fullMenu) {
        const h3 = document.createElement('h3');
        h3.className = 'category-title';
        h3.textContent = category;
        container.appendChild(h3);

        const grid = document.createElement('div');
        grid.className = 'products-grid';

        fullMenu[category].forEach(([name, price]) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.onclick = () => addItem(name, price);

            const nameEl = document.createElement('div');
            nameEl.className = 'name';
            nameEl.textContent = name;

            const priceEl = document.createElement('div');
            priceEl.className = 'price';
            priceEl.textContent = `€ ${price}`;

            card.appendChild(nameEl);
            card.appendChild(priceEl);

            grid.appendChild(card);
        });

        container.appendChild(grid);
    }
}


// 🔍 Ricerca rapida
function filterMenu() {
  const q = document.getElementById('search').value.toLowerCase();
  const container = document.getElementById('menu-content');
  container.innerHTML = '';

  for (const category in fullMenu) {
    const filtered = fullMenu[category].filter(
      ([name]) => name.toLowerCase().includes(q)
    );
    if (!filtered.length) continue;

    const h3 = document.createElement('h3');
    h3.className = 'category-title';
    h3.textContent = category;
    container.appendChild(h3);

    const grid = document.createElement('div');
    grid.className = 'products-grid';

    filtered.forEach(([name, price]) => {
      const card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `<span class="name">${name}</span><span class="price">€${price}</span>`;
      card.onclick = () => addItem(name, price);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }
}

// Carica menu all’avvio
document.addEventListener('DOMContentLoaded', loadMenu);
