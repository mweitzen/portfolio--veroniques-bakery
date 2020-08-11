// ******************************************************************************************
//
//  Veronique's Bakery. Mock Server for "Database" requests
//
// ******************************************************************************************

//  - Code.gs
//      API entrance
//
//  - Error.gs
//      Return Error
//
//  - Spreadsheet.gs
//      Functions to handle adding/getting data and info from spreadsheets
//
//  - Features.gs
//      Methods and functions extracted for ease of splitting

//////////////////
// ** GLOBAL ** //
//////////////////

const ss = SpreadsheetApp.getActiveSpreadsheet()

const productTypes = ss.getSheetByName('Product Types')
const products = ss.getSheetByName('Products')
const orderSheet = ss.getSheetByName('orders')

//////////////////
// ** DO GET ** //
//////////////////

const doGet = (e) => {
  const query = e.parameters
  const route = query.route && query.route.toString()

  // Check for route query string
  if (!route || route === undefined || route === null || route === "") {
    return returnError('You must provide a query string with key "route" and a value equal to a valid resource in your Google Sheets file.')
  }

  // Pass all data back to the client stored in the data object
  let data = {}

  // **************************************************
  //  MAIN SWITCHER (MOCK API ROUTES FOR GET REQUESTS)
  // **************************************************

  switch (route) {
    case "orders":
      // Do getter logic here for the resource
      const orderNumber = query.id && query.id.toString()
      if (!orderNumber) return returnError('You must provide a query string with key "id" and a valid order number.')

      const orderData = getOrderById(orderNumber)

      data = {...orderData}

      break;
    case "resource2":
      // Do getter logic here for the resource
      data.resource2 = "resource2"
      break;
    default:
      return returnError(`There is no resource name with the name: ${route}`)
  }

  // Stringify the data for the server to properly handle the input
  var response = JSON.stringify(data)
  return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JSON);
}

///////////////////
// ** DO POST ** //
///////////////////

// Post data must be sent as 'Content-Type': 'text/plain'

const doPost = (e) => {
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

      // Do post logic here for the resource
      const sanitized = sanitizePayload(payload)

      // create the data structure for the row
      const structuredData = formatData(sanitized)

      // add the structured data to spreadsheet
      addDataToDatabase(structuredData)

      // send data to other spreadsheet
      sendDataToSpreadsheet(sanitized)

      // send email with info
      sendOrderConfirmation(sanitized)
      alertVeronique(sanitized)

      break;

    default:
      return returnError(`There is no resource name with the name: ${route}`)
  }

  // Stringify the data for the server to properly handle the input
  var response = JSON.stringify(data)
  return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JSON);
}
