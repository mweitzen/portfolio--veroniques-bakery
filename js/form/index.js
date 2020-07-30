const inputFields = document.querySelectorAll('#orderForm div.form-group')

// handle form submit
export function handleFormSubmit(e){
  e.preventDefault()
  console.log(e.target)
}

// attach validation response to inputs
export function attachValidationToFormInputs() {

  // loop all form groups
  const length = inputFields.length
  for (let x = 0; x < length; x++) {
    // form group div
    const formGroup = inputFields.item(x)

    // loop form group children to find inputs
    const childElements = formGroup.children
    for (let y = 0; y < childElements.length; y++) {

      // check if input
      const thisElement = childElements.item(y)
      if (thisElement.nodeName === 'INPUT') {

        // attach onchange listener
        thisElement.addEventListener('change', (e) => {

          // if the field is emptied or clear, remove validation
          if (e.target.value === "") return formGroup.classList.remove('was-validated')

          // add validation
          formGroup.classList.add('was-validated')

        })

        // catch all edge case with on blur
        thisElement.addEventListener('blur', (e) => {
          if (!Object.values(formGroup.classList).includes('was-validated') && thisElement.value !== "") {
            formGroup.classList.add('was-validated')
          }
        })

        // clear out on begin typing
        thisElement.addEventListener('keyup', (e) => {
          if (Object.values(formGroup.classList).includes('was-validated')) return formGroup.classList.remove('was-validated')
        })
      }
    }
  }
}

// toggle delivery zip code input
export function toggleDeliveryInput(e) {
  const deliveryInput = document.getElementById('location')
  if (e.target.value === "pickup") {
    if (e.target.checked) {
      deliveryInput.value = "90232"
      return deliveryInput.disabled = true
    }
  }
  if (e.target.value === "cater") {
    if (e.target.checked) return deliveryInput.disabled = false
  }
}
