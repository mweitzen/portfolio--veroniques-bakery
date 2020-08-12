/*
 *
 * GET order by ID
 *
 */

function getOrderById(id) {
  const colDepth = orderSheet.getLastColumn();
  const idArray = orderSheet.getRange(2, 1, orderSheet.getLastRow()-1).getValues()
  let rowIndex = -1;
  for (let x=0; x<idArray.length; x++) {
    if (idArray[x][0] == id) {
      rowIndex = x+2 // account for header row + array index starting at 0
      break
    }
  }

  if (rowIndex === -1) return "error"

  const headers = orderSheet.getRange(1, 1, 1, colDepth).getValues()[0]
  const rowData = orderSheet.getRange(rowIndex, 1, 1, colDepth).getValues()[0]

  const returnValues = {}

  for (let y=0; y<colDepth; y++) {
    returnValues[headers[y]] = rowData[y].toString()
  }

  return returnValues
}

/*
 *
 * Sanitize payload
 *
 */

function sanitizePayload(payload) {

/*
    payload structure:
        name: string,
        email: email,
        phone: xxxxxxxxxx | xxx-xxx-xxxx,
        fulfillment: 'pickup' | 'delivery',
        location: zip-code,
        date: yyyy-mm-dd,
        time: hh:mm (24hr),
 */

  // create an order number
  const order_number = !!orderSheet.getRange('A2').getValue() ? String( Number(orderSheet.getRange('A2').getValue()) + 1 ) : '101301'

  let sanitized = {
    "order_number": order_number,
    "name": "",
    "email": "",
    "phone": "",
    "fulfillment": payload["fulfillment"],
    "location": payload["location"],
    "date": payload["date"],
    // "time": "",
    "quantities": payload["quantities"],
    "costs": payload["costs"]
  }

  // sanitize name
  const [ firstName, secondName ] = payload.name.split(' ')
  if (!!secondName) {
    sanitized.name = firstName.charAt(0).toUpperCase() + firstName.slice(1,).toLowerCase() + " " + secondName.charAt(0).toUpperCase() + secondName.slice(1,)
  } else {
    Logger.log('First name only')
    sanitized.name = firstName.charAt(0).toUpperCase() + firstName.slice(1,)
  }

  // sanitize email
  sanitized.email = payload.email.toLowerCase()

  // sanitize phone
  let phoneMatch = /\-/g
  let found = payload.phone.match(phoneMatch)
  if (!found || found.length !== 2) {
    let clean = payload.phone.replace("-", "")
    Logger.log(clean)
    let split = clean.split("")
    split.splice(3, 0, "-")
    split.splice(7, 0, "-")
    sanitized.phone = split.join("")
    Logger.log(split)

  } else {
    sanitized.phone = payload.phone
  }

  // sanitize date to local date

  // sanitize time
  // let [hr, min] = payload.time.split(":")
  //
  // let hour = 0
  // let ampm = Number(hr) >= 12 ? 'pm' : 'am'
  // if (Number(hr) == 0) {
  //   hour = 12
  // } else if (ampm === 'pm' && hr !== 12) {
  //   hour = Number(hr) - 12
  // } else {
  //   hour = hr.replace("0", "")
  // }
  //
  // sanitized.time = String(hour) + ":" + min + ampm

  return sanitized
}

/*
 *
 * Format Data to Match "Database"
 *
 */

function formatData(data) {

/*
      data structure:
          order_number,
          email,
          name,
          phone,
          fulfillment_type,
          fulfillment_location,
          fulfillment_date,
          fulfillment_time,
          order_created_on,
          quantity_croissants_butter,
          quantity_croissants_almond,
          quantity_croissants_chocolate,
          quantity_tarts_lemon_small,
          quantity_tarts_lemon_large,
          quantity_tarts_almond_small,
          quantity_tarts_almond_large,
          quantity_bread_pudding_small,
          quantity_bread_pudding_large
*/

   // get today and format
   const d = new Date()
   const today = `${d.getFullYear()}-${(d.getMonth()+1) < 10 && "0"}${d.getMonth()+1}-${d.getDate()}`

   // destructure quantities
   const { quantities, costs } = data

   // hard-coded column headers
   return [
     data.order_number.toString(),
     data.email.toString(),
     data.name.toString(),
     data.phone.toString(),
     data.fulfillment.toString(),
     data.location.toString(),
     data.date.toString(),
     // data.time.toString(),
     today.toString(),
     quantities.almond_croissants.toFixed(0).toString(),
     quantities.butter_croissants.toFixed(0).toString(),
     quantities.chocolate_croissants.toFixed(0).toString(),
     quantities.lemon_tarts_small.toFixed(0).toString(),
     quantities.lemon_tarts_large.toFixed(0).toString(),
     quantities.almond_tarts_small.toFixed(0).toString(),
     quantities.almond_tarts_large.toFixed(0).toString(),
     quantities.bread_pudding_small.toFixed(0).toString(),
     quantities.bread_pudding_large.toFixed(0).toString(),
     costs.total.toFixed(2).toString()
   ]
}

/*
 *
 * Add Data to "Database"
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
 *  Add Data to Other Spreadsheet
 *
 */

function sendDataToSpreadsheet(data) {
  const { quantities } = data
  const spreadsheet = SpreadsheetApp.openById('1Ib0kct-7LhNQB4F9FZSiTFaeVvI5hRTbU0maHUiOP8A')
  const details = {
    "order": [
      data.order_number,
      null,
      null,
      data.email,
      data.name,
      data.phone,
      null,
      data.fulfillment,
      data.location,
      data.date,
      // data.time,
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
  const infoSheet = spreadsheet.getSheetByName('Order Information')
  const quantSheet = spreadsheet.getSheetByName('Order Quantities')

  appendRowToSheet(infoSheet, details.order)
  appendRowToSheet(quantSheet, details.quantities)
}

function appendRowToSheet(sheet, data) {
  // Insert Row at top
  if (!!sheet.getRange('A2').getValue()) {
    sheet.insertRows(2)
  }

  // append the row for ease of adding values
  sheet.appendRow(data)

  // get last row
  const newRow = sheet.getRange(sheet.getLastRow(), 1, 1, sheet.getLastColumn())

  // copy row to first line
  newRow.copyTo(sheet.getRange('A2'))

  // delete the empty row at bottom
  sheet.getLastRow() > 2 && sheet.deleteRow(sheet.getLastRow())
}
