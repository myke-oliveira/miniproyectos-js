const cart = {}
let total = 0

currencyFormater = new Intl.NumberFormat('sp-MX', { style: 'currency', currency: 'MXN' })

document.querySelectorAll('.js-qtd').forEach(
  input => input.addEventListener('change', (event) => {
    const unitValue = (Number)(event.target.dataset.unitValue)
    const description = event.target.dataset.description
    const key = event.target.dataset.key
    const qtd = (Number)(event.target.value);

    const item = {
      description,
      qtd,
      unitValue,
      price: qtd * unitValue
    }

    cart[key] = item;

    if (qtd === 0) {
      delete cart[key];
    }

    createTable(cart);
    createTotal(cart);
  })
)

function createTable(cart) {
  const rows = [];
  for (const [key, item] of Object.entries(cart)) {
    rows.push(`<tr>
          <td>${item.description}</td>
          <td>${item.qtd}</td>
          <td>${currencyFormater.format(item.unitValue)}</td>
          <td>${currencyFormater.format(item.price)}</td>
        </tr>`)
  }

  document.querySelector('table.table tbody').innerHTML = rows.join('');
}

function createTotal(cart) {
  const total = Object.entries(cart).reduce((total, [_, item]) => (total + item.price), 0);
  document.querySelector('#total').textContent = currencyFormater.format(total);
}