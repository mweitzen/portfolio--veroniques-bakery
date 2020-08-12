import { submitOrderRequest, sanitizeData } from './submission.js'

import {
  validateCosts,
  orderTotal
} from './deliveryValidation.js'

const formGroups = document.querySelectorAll('#orderForm div.form-group')
const inputFields = document.querySelectorAll('#orderForm input, select')

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

  // sanitize form data and structure properly
  const sanitized = sanitizeData(formValues)

  // submit order request to google apps script
  const result = await submitOrderRequest(sanitized)

  // order successfully submitted
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
      deliveryInput.value = "9622 Venice Blvd, Culver City, CA 90232"
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

// export function setMinimumDateForFulfillment() {
//   const today = new Date()
//
//   const dayX = today.getDate()
//   const day = dayX < 10 ? `0${dayX}` : dayX
//   const monthX = today.getMonth() + 1
//   const month = monthX < 10 ? `0${monthX}` : monthX
//   const year = today.getFullYear()
//   console.log(`${year}-${month}-${day}`);
//   document.getElementById('date').min = `${year}-${month}-${day}`
//   document.getElementById('date').value = `${year}-${month}-${day}`
// }

/*
 *
 *  POPULATE DATE SELECT WITH SATURDAYS IN FUTURE
 *
 */

export function populateDateWithSaturdays() {
  const today = new Date()
  const todaysDate = today.getDate()

  const weekday = today.getDay()
  const saturday = 6
  const daysUntilSaturday = saturday - weekday

  const d = new Date(today)
  let firstSaturday;
  if (weekday > 4) {
    // start with next Saturday
    firstSaturday = d.setDate(todaysDate + (daysUntilSaturday + 7))
  } else {
    // allow this Saturday
    firstSaturday = d.setDate(todaysDate + (daysUntilSaturday))
  }

  const dd = new Date(firstSaturday)

  document.getElementById('date').innerHTML = document.getElementById('date').innerHTML + `<option value="${firstSaturday}">${dd.toDateString()}</option>`

  for ( let x = 1; x < 10; x++ ) {
    const ddd = new Date( new Date(dd).setDate(dd.getDate() + ( 7 * x )) )
    const dddd = new Date(ddd).toDateString()

    const dayX = ddd.getDate()
    const day = dayX < 10 ? `0${dayX}` : dayX
    const monthX = ddd.getMonth() + 1
    const month = monthX < 10 ? `0${monthX}` : monthX
    const year = ddd.getFullYear()
    document.getElementById('date').innerHTML = document.getElementById('date').innerHTML + `<option value="${year + "-" + month + "-" + day}">${dddd}</option>`
    console.log(`${year + "-" + month + "-" + day}`);
  }
}

/*
 *
 *  ADD NEXT FEATURE TO THE FORM
 *
 */

export function attachNextButtonHandler(e) {
  if (e.target.id === 'next1') {
    validateCosts()
    if (orderTotal === 0) return alert('You must place an order before continuing.')
    document.getElementById('deliveryFeeNotice').style.display = 'none'
    if (orderTotal < 20) {
      document.getElementById('delivery').disabled = true
      document.getElementById('fulfillment-type').children.item(2).style.color = '#d3d3d3'
      document.getElementById('fulfillment-type').children.item(2).style['text-decoration'] = 'line-through'
    } else {
      if (orderTotal < 40) {
        document.getElementById('deliveryFeeNotice').style.display = 'block'
      }
      document.getElementById('delivery').disabled = false
      document.getElementById('fulfillment-type').children.item(2).style.color = 'inherit'
      document.getElementById('fulfillment-type').children.item(2).style['text-decoration'] = 'none'
    }
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
