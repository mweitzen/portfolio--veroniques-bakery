const ss = SpreadsheetApp.getActiveSpreadsheet()
const form = ss.getSheetByName('Order Payment Request')

/*
 *
 *  SEND PAYMENT REQUEST TO USER
 *
 */

function sendPaymentRequest() {
  const id = form.getRange('B2').getValue().toString()
  if (!id || id === "") return Logger.log('error')
  const url = `https://script.google.com/macros/s/AKfycbyS2FhF8fJmzVx99P3CQzFzGMZh9JOQv0MHljAnhKjC5N49yg8/exec?route=orders&id=${id}`

  const orderData = JSON.parse(UrlFetchApp.fetch(url))

  const { name, email } = orderData

  sendEmail(id, { name, email })
}

/*
 *
 *  SEND THE EMAIL
 *
 */

function sendEmail(orderNumber, recipient) {
  const { name, email } = recipient

  const subject = "Payment Request - Veronique's Bakery"

  const body = ""

  const html = HtmlService.createTemplateFromFile('PaymentRequest')

  html.name = name
  html.orderNumber = orderNumber

  const htmlBody = html.evaluate().getContent()

  const options = {
    "htmlBody": htmlBody
  }

  GmailApp.sendEmail(email, subject, body, options)
}

/*
 *
 *  ADD THE NEW ORDER TO THE SPREADSHEET
 *
 */

function formatData(data) {
  const { quantities } = data

  return {
    "order": [
      data.order_number,
      null,
      null,
      data.email,
      data.phone,
      null,
      data.fulfillment_type,
      data.fulfillment_location,
      data.date,
      data.time,
      new Date().toLocaleString()
    ],
    "quantities": [
      data.order_number,
      null,
      null,
      quantities.almond_croissants.toFixed(0).toString(),
      quantities.butter_croissants.toFixed(0).toString(),
      quantities.chocolate_croissants.toFixed(0).toString(),
      null,
      quantities.lemon_tarts_small.toFixed(0).toString(),
      quantities.lemon_tarts_large.toFixed(0).toString(),
      quantities.almond_tarts_small.toFixed(0).toString(),
      quantities.almond_tarts_large.toFixed(0).toString(),
      null,
      quantities.bread_pudding_small.toFixed(0).toString(),
      quantities.bread_pudding_large.toFixed(0).toString(),
    ]
  }
}

/*
 *
 *  ADD ORDER TO SPREADSHEET
 *
 */

function addDataToDatabase(data) {
  // Insert Row at top
  if (!!orderSheet.getRange('A2').getValue()) {
    orderSheet.insertRows(2)
  }

  // append the row for ease of adding values
  orderSheet.appendRow(data)

  // get last row
  const newRow = orderSheet.getRange(orderSheet.getLastRow(), 1, 1, orderSheet.getLastColumn())

  // copy row to first line
  newRow.copyTo(orderSheet.getRange('A2'))

  // delete the empty row at bottom
  orderSheet.getLastRow() > 2 && orderSheet.deleteRow(orderSheet.getLastRow())
}

/*
 *
 *  HANDLE THE POST REQUEST TO ADD ORDER TO SPREADSHEET
 *
 */

function doPost(e) {
  if (!e.postData || e.postData === null || !e.postData.contents) {
    return returnError("You must provide a body with your post, including a key of 'route' and a value equal to a resource in your Google Sheets 'Database'.  As well as a key of 'payload' and the resource data.")
  }

  // stringified object needs to be parsed into JSON
  const request = JSON.parse(e.postData.contents)

  const route = request.route && request.route.toString()
  const payload = request.payload

  // Check for route in post data
  if (!route || route === undefined || route === null || route === "") {
    return returnError('You must provide an object with a key of "route" and a value equal to a valid resource in your Google Sheets file.')
  }

  // Check for payload in post data
  if (!payload || payload === undefined || payload === null || payload === "") {
    return returnError('You must provide an object with a key of "payload" and an object with post data.')
  }

  // Pass all data back to the client stored in the data object
  let data = {}

  // **************************************************
  //  MAIN SWITCHER (MOCK API ROUTES FOR POST REQUESTS)
  // **************************************************

  switch (route) {
    case "order":

      // create the data structure for the row
      const structuredData = formatData(payload)

      // add the structured data to spreadsheet
      addDataToDatabase(structuredData)

      break;

    default:
      return returnError(`There is no resource name with the name: ${route}`)
  }

  // Stringify the data for the server to properly handle the input
  var response = JSON.stringify(data)
  return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JSON);
}
