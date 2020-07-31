import { submitOrderRequest } from './submission.js'

const formGroups = document.querySelectorAll('#orderForm div.form-group')
const inputFields = document.querySelectorAll('#orderForm input')

/*
 *
 *  HANDLE FORM SUBMISSION
 *
 */

export async function handleFormSubmit(e){

  // prevent submit
  e.preventDefault()

  document.getElementById('submitButton').innerHTML = document.getElementById('submitButton').innerHTML + '<div class="spinner-border ml-3 align-self-center" role="status" aria-hidden="true"></div>'

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
    formValues[key] = value
  }

  const result = await submitOrderRequest(formValues)
  if (result === "success") {
    document.getElementById('submitButton').innerHTML = "Success!"
    setTimeout(() => {
      $('#orderFormModal').modal('hide')
      document.getElementById('orderForm').reset()
      alert('You will receive an email shortly with a recap of your requested order!')
      window.location.reload()
    }, 600)
  }
}

/*
 *
 *  ATTACH VALIDATION RESPONSE TO INPUTS
 *
 */

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


/*
 *
 *  TOGGLE DELIVERY ZIP CODE INPUT
 *
 */

export function toggleDeliveryInput(e) {
  const deliveryInput = document.getElementById('location')
  if (e.target.value === "pickup") {
    if (e.target.checked) {
      deliveryInput.value = "90232"
      return deliveryInput.disabled = true
    }
  }
  if (e.target.value === "delivery") {
    if (e.target.checked) return deliveryInput.disabled = false
  }
}

/*
 *
 *  ADD MIN DATE TO THE FULFILLMENT ORDER
 *
 */

export function setMinimumDateForFulfillment() {
  const today = new Date()

  const day = today.getDate()
  const monthX = today.getMonth() + 1
  const month = monthX < 10 ? `0${monthX}` : monthX
  const year = today.getFullYear()

  document.getElementById('date').min = `${year}-${month}-${day}`
  document.getElementById('date').value = `${year}-${month}-${day}`
}

/*
 *
 *  ADD NEXT FEATURE TO THE FORM
 *
 */

export function attachNextButtonHandler(e) {
  if (e.target.id === 'next1') {
    document.getElementById('order').style.display = 'none'
    document.getElementById('orderDetails').style.display = 'block'
    return
  } else if (e.target.id === 'next2') {
    document.getElementById('orderDetails').style.display = 'none'
    document.getElementById('contactDetails').style.display = 'block'
  }
}

/*
 *
 *  ADD BACK FEATURE TO THE FORM
 *
 */

export function attachBackButtonHandler() {
  document.getElementById('orderDetails').style.display = 'none'
  document.getElementById('order').style.display = 'block'
}

/*
 *
 *  SET FORM TO FIRST SCREEN ON CLOSE
 *
 */

export function attachCloseButtonHandler() {
  setTimeout(() => {
    document.getElementById('orderDetails').style.display = 'none'
    document.getElementById('contactDetails').style.display = 'none'
    document.getElementById('order').style.display = 'block'
  }, 600)
}
