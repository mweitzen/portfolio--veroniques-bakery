function returnError(text) {
  return ContentService.createTextOutput(JSON.stringify({error: text, status: 400})).setMimeType(ContentService.MimeType.JSON)
}
