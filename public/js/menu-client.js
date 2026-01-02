let fullMenu = {};

async function loadMenu() {
    const res = await fetch('/menu-clienti');
    const dishes = await res.json();

    fullMenu = {};
    dishes.forEach(dish => {
        if (!fullMenu[dish.category]) fullMenu[dish.category] = [];
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
            card.innerHTML = `<span class="name">${name}</span><span class="price">€${price}</span>`;
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }
}

function filterMenu() {
    const q = document.getElementById('search').value.toLowerCase();
    const container = document.getElementById('menu-content');
    container.innerHTML = '';

    for (const category in fullMenu) {
        const filtered = fullMenu[category].filter(([name]) => name.toLowerCase().includes(q));
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
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }
}

document.addEventListener('DOMContentLoaded', loadMenu);
