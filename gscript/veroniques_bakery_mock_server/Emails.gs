function sendOrderConfirmation(orderData) {
  // subject
  const subject = `Order #${orderData.order_number} Confirmation - Veronique's Bakery`

  // default plain text body
  const body = `
    Your order has been received!
    \r\n
    \r\n
    Order #${orderData.order_number} Confirmed
    \r\n
    \r\n
    Thank You!
  `

  // generate html email from Purchase Confirmation template
  const html = HtmlService.createTemplateFromFile('PurchaseConfirmation')
  html.orderData = orderData
  const htmlBody = html.evaluate().getContent()

  // set html body in options
  const options = {
    htmlBody,
  }

  // send the email
  GmailApp.sendEmail(orderData.email, subject, body, options)
}


function alertVeronique(orderData) {

  // get user who owns the script
  const currentUser = Session.getEffectiveUser().getEmail()

  // default plain text body
  const body = "This will be an order reciept"

  // generate html email from Purchase Alert template
  const html = HtmlService.createTemplateFromFile('PurchaseAlert')
  html.orderData = orderData
  const htmlBody = html.evaluate().getContent()

  // set html body in options
  const options = {
    htmlBody,
  }

  // send email to owner
  GmailApp.sendEmail(currentUser, "Veroniques's Bakery - Order has been placed!", body, options)
}
