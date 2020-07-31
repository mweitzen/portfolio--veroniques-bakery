const quantityButtons = document.querySelectorAll('#order div.quantity-assist')

export function attachQuantityAssistToNumberInputs() {
  for (let x = 0; x < quantityButtons.length ;x++) {
    let thisButtonGroup = quantityButtons.item(x)
    let thisInput = thisButtonGroup.parentElement.querySelector('input.form-control')

    let removeButton = thisButtonGroup.querySelector('.quantity-remove')
    let addButton = thisButtonGroup.querySelector('.quantity-add')

    removeButton.addEventListener('click', () => {
      if (!thisInput.value || thisInput.value == 0) return
      thisInput.value--
    })
    addButton.addEventListener('click', () => {
      thisInput.value++
    })
  }
}
