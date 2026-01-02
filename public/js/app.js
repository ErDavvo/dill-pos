
let currentUser = "";
let activeTable = null;
let tables = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], bancone: [] };
let salesRecord = [];

function login(user) {
    currentUser = user;
    document.getElementById('screen-login').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('user-info').innerText = "OPERATORE: " + user;
    renderTables();
    loadMenu();
}

function renderTables() {
    const grid = document.getElementById('table-grid');
    grid.innerHTML = '';

    for (let i = 1; i <= 7; i++) {
        const occupied = tables[i].length > 0;
        const div = document.createElement('div');
        div.className = `table-box ${occupied ? 'active-order' : ''}`;
        div.innerHTML = `TAVOLO ${i}${occupied ? '<br><small>OCCUPATO</small>' : ''}`;
        div.onclick = () => openPOS(i);
        grid.appendChild(div);
    }

    const banconeOccupied = tables.bancone.length > 0;
    const bancone = document.createElement('div');
    bancone.className = `table-box ${banconeOccupied ? 'active-order' : ''}`;
    bancone.innerHTML = `BANCONE${banconeOccupied ? '<br><small>OCCUPATO</small>' : ''}`;
    bancone.onclick = () => openPOS('bancone');
    grid.appendChild(bancone);
}

function openPOS(n) {
    activeTable = n;
    document.getElementById('screen-tables').style.display = 'none';
    document.getElementById('screen-dashboard').style.display = 'none';
    document.getElementById('screen-pos').style.display = 'block';
    document.getElementById('pos-table-title').innerText = n === 'bancone' ? "BANCONE" : "TAVOLO " + n;
    renderReceipt();
}

function showTables() {
    document.getElementById('screen-pos').style.display = 'none';
    document.getElementById('screen-dashboard').style.display = 'none';
    document.getElementById('screen-tables').style.display = 'block';
    renderTables();
}

function addItem(name, price) {
    if (!activeTable) return;
    tables[activeTable].push({ name, price });
    renderReceipt();
}

function renderReceipt() {
    if (!activeTable) return;
    const list = document.getElementById('receipt-list');
    list.innerHTML = '';
    let total = 0;
    tables[activeTable].forEach((item, idx) => {
        total += item.price;
        list.innerHTML += `<div class="receipt-item">
            <span>${item.name}</span>
            <span>€ ${item.price.toLocaleString()} <b style="color:red;cursor:pointer;margin-left:10px;" onclick="removeItem(${idx})">×</b></span>
        </div>`;
    });
    document.getElementById('total-val').innerText = total.toLocaleString();
}

function removeItem(idx) {
    if (!activeTable) return;
    tables[activeTable].splice(idx, 1);
    renderReceipt();
}

function checkout() {
    if (!activeTable || tables[activeTable].length === 0) return;
    const total = tables[activeTable].reduce((sum, item) => sum + item.price, 0);
    salesRecord.push({
        time: new Date().toLocaleTimeString(),
        table: activeTable,
        user: currentUser,
        total: total
    });
    tables[activeTable] = [];
    showTables();
}

function showDashboard() {
    document.getElementById('screen-tables').style.display = 'none';
    document.getElementById('screen-pos').style.display = 'none';
    document.getElementById('screen-dashboard').style.display = 'block';

    const body = document.getElementById('report-body');
    let grandTotal = 0;
    body.innerHTML = '';
    salesRecord.slice().reverse().forEach(sale => {
        grandTotal += sale.total;
        body.innerHTML += `<tr>
            <td>${sale.time}</td>
            <td>${sale.table === 'bancone' ? 'Bancone' : 'Tavolo ' + sale.table}</td>
            <td>${sale.user}</td>
            <td>€ ${sale.total.toLocaleString()}</td>
        </tr>`;
    });
    document.getElementById('dash-total').innerText = "€ " + grandTotal.toLocaleString();
}

function filterMenu() {
    const query = document.getElementById('search').value.toLowerCase();
    document.querySelectorAll('.item-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(query) ? 'flex' : 'none';
    });
    document.querySelectorAll('.category-title').forEach(title => {
        title.style.display = query === "" ? 'block' : 'none';
    });
}

function logout() {
    location.reload();
}
function openAddDishModal() {
    document.getElementById('add-dish-modal').classList.remove('hidden');
}
function closeAddDishModal() {
    document.getElementById('add-dish-modal').classList.add('hidden');
}

function addNewDish() {
    const name = document.getElementById('new-dish-name').value.trim();
    const price = parseFloat(document.getElementById('new-dish-price').value);
    const category = document.getElementById('new-dish-category').value;

    if (!name || isNaN(price)) {
        alert("Inserisci un nome e un prezzo valido!");
        return;
    }

    fetch('http://localhost:3000/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, category })
    })
    .then(res => res.json())
    .then(() => {
        closeAddDishModal();
        loadMenu();
    });
}
