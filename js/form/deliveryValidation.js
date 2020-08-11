let orderTotal = 0;

export function validateCosts() {
  orderTotal = 0;

  const xOrderForm = document.getElementById('order')
  const orderTotals = xOrderForm.querySelectorAll('input')

  for ( let x = 0; x < orderTotals.length; x++) {
    let item = orderTotals[x]

    switch (item.name) {
      case "almond_croissants":
        orderTotal += item.value * 3.50
        continue;
      case "butter_croissants":
        orderTotal += item.value * 3.50
        continue;
      case "chocolate_croissants":
        orderTotal += item.value * 0
        continue;
      case "lemon_tarts_small":
        orderTotal += item.value * 4
        continue;
      case "lemon_tarts_large":
        orderTotal += item.value * 25
        continue;
      case "almond_tarts_small":
        orderTotal += item.value * 4
        continue;
      case "almond_tarts_large":
        orderTotal += item.value * 25
        continue;
      case "bread_pudding_small":
        orderTotal += item.value * 3.50
        continue;
      case "bread_pudding_large":
        orderTotal += item.value * 20
        continue;
      default:
        continue;
    }
  }
}

export { orderTotal }
