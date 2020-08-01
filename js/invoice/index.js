import { renderPaypalButtons } from '../paypal/index.js'

function formatDateAndTime(date, time) {
  const d = new Date(date)

  const dayX = d.getDate()
  const day = dayX < 10 ? `0${dayX}` : dayX
  const monthX = d.getMonth() + 1
  const month = monthX < 10 ? `0${monthX}` : monthX
  const year = d.getFullYear()

  return `${day}/${month}/${year} ${time}`
}

async function getInvoiceDetails() {
  const query = window.location.search.slice(1,)
  const params = query.split("&")
  const orderParam = params.find(x => x.includes('id'))
  const [key, orderNumber] = orderParam.split('=')

  const result = await fetch(`https://script.google.com/macros/s/AKfycbyS2FhF8fJmzVx99P3CQzFzGMZh9JOQv0MHljAnhKjC5N49yg8/exec?route=orders&id=${orderNumber}`)
  const data = await result.json()

  document.getElementById('payment_order_number').append(data.order_number)
  document.getElementById('payment_order_name').append(data.name)
  document.getElementById('payment_order_location').append(data.fulfillment_type === "pickup" ? "Pickup" : data.fulfillment_location)
  document.getElementById('payment_order_date').append(formatDateAndTime(data.fulfillment_date, data.fulfillment_time))
  document.getElementById('payment_order_total').append(`$${data.order_total}`)

  renderPaypalButtons(data.order_total)
}

getInvoiceDetails()
