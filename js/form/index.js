import { submitOrderRequest } from './submission.js'

const formGroups = document.querySelectorAll('#orderForm div.form-group')
const inputFields = document.querySelectorAll('#orderForm input')

// handle form submit
export function handleFormSubmit(e){

  // prevent submit
  e.preventDefault()

  // define values for return
  let formValues = {}

  // loop input fields to get values
  for (let x= 0; x < inputFields.length; x++) {

    let thisInput = inputFields.item(x)

    // if radio, only get checked item
    if (thisInput.type === 'radio' && !thisInput.checked) continue

    // set key/value
    const key = thisInput.name
    const value = thisInput.value

    // convert numbers to numbers
    if (thisInput.type === 'number') {
      formValues[key] = Number(value)
      continue
    }

    // attach to formValues
    formValues[`${key}${x}`] = value
  }

  submitOrderRequest(formValues)
}

// attach validation response to inputs
export function attachValidationToFormInputs() {

  // loop all form groups
  const length = formGroups.length
  for (let x = 0; x < length; x++) {
    // form group div
    const thisFormGroup = formGroups.item(x)

    // loop form group children to find inputs
    const childElements = thisFormGroup.children
    for (let y = 0; y < childElements.length; y++) {

      // check if input
      const thisElement = childElements.item(y)
      if (thisElement.nodeName === 'INPUT') {

        // attach onchange listener
        thisElement.addEventListener('change', (e) => {

          // if the field is emptied or clear, remove validation
          if (e.target.value === "") return thisFormGroup.classList.remove('was-validated')

          // add validation
          thisFormGroup.classList.add('was-validated')

        })

        // catch all edge case with on blur
        thisElement.addEventListener('blur', (e) => {
          if (!Object.values(thisFormGroup.classList).includes('was-validated') && thisElement.value !== "") {
            thisFormGroup.classList.add('was-validated')
          }
        })

        // clear out on begin typing
        thisElement.addEventListener('keyup', (e) => {
          if (Object.values(thisFormGroup.classList).includes('was-validated')) return thisFormGroup.classList.remove('was-validated')
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
