const addInventoryLink = document.getElementById('add-inventory');
const addInventoryForm = document.getElementById('form');
const viewInventoryLink = document.getElementById('view-inventory');
const viewInventoryTable = document.getElementById('table');
const saveButton = document.getElementById('save');
const drugNameInput = document.querySelector('input[placeholder="Enter the drug name"]');
const quantityInput = document.querySelector('input[placeholder="Enter the quantity"]');
const priceInput = document.querySelector('input[placeholder="Enter the price"]');

const url = 'http://localhost:3000'

drugNameInput.addEventListener('input', () => {
    document.getElementById('drug-error').innerHTML = "";
})
quantityInput.addEventListener('input', () => {
    document.getElementById('quantity-error').innerHTML = "";
})
priceInput.addEventListener('input', () => {
    document.getElementById('price-error').innerHTML = "";
    document.getElementById('total').innerHTML =
        parseInt(quantityInput.value) * parseInt(priceInput.value);
})

addInventoryLink.addEventListener('click', () => {
    addInventoryForm.classList.remove('hidden');
    document.getElementById('inventory-table').classList.add('hidden');
});
viewInventoryLink.addEventListener('click', e => {
    e.preventDefault();
    fetch(url + '/drugs')
        .then(response => response.json())
        .then(data => {
            while (viewInventoryTable.rows.length > 0) {
                viewInventoryTable.deleteRow(0);
            }
            const headerRow = viewInventoryTable.insertRow(0);
            headerRow.insertCell().textContent = "Number";
            headerRow.insertCell().textContent = "Drug name";
            headerRow.insertCell().textContent = "Quantity";
            headerRow.insertCell().textContent = "Price";
            headerRow.insertCell().textContent = "Total";
            data.forEach(item => {
                const row = viewInventoryTable.insertRow();
                const idCell = row.insertCell();
                const nameCell = row.insertCell();
                const quantityCell = row.insertCell();
                const priceCell = row.insertCell();
                const totalCell = row.insertCell();

                idCell.textContent = item.id;
                nameCell.textContent = item.name;
                quantityCell.textContent = item.quantity;
                priceCell.textContent = item.price;
                totalCell.textContent = item.price * item.quantity;
            });
            addInventoryForm.classList.add('hidden');
            document.getElementById('inventory-table').classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            addInventoryForm.classList.add('hidden');
            document.getElementById('inventory-table').classList.remove('hidden');
        });
});

saveButton.addEventListener('click', function (event) {
    event.preventDefault();

    const drugName = drugNameInput.value;
    const quantity = parseInt(quantityInput.value);
    const price = parseInt(priceInput.value);

    if (!drugName) {
        document.getElementById('drug-error').innerHTML = "Please provide a valid drug name";
        return;
    }
    if (isNaN(quantity)) {
        document.getElementById('quantity-error').innerHTML = "Please provide a valid quantity";
        return;
    }
    if (isNaN(price)) {
        document.getElementById('price-error').innerHTML = "Please provide a valid price";
        return;
    }

    const data = {
        name: drugName,
        quantity: quantity,
        price: price
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    fetch(url + '/drugs', options)
        .then(response => {
            if (response.ok) {
                alert('Drug saved successfully!');
                drugNameInput.value = '';
                quantityInput.value = '';
                priceInput.value = '';
                document.getElementById('total').innerHTML = "";
            } else {
                document.getElementById('form-error').innerHTML = "An error occurred";
            }
        })
        .catch(error => {
            document.getElementById('form-error').innerHTML = "An error occurred";
            console.log(error)
        });
});