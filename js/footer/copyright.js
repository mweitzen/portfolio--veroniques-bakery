/* FOOTER COPYRIGHT YEAR */
export function addCurrentYearToFooter() {
  document.getElementById('copyright').innerHTML = new Date().getFullYear()
}
