import { attachFixedClassToNavbar } from './navbar/sticky.js'
import { addCurrentYearToFooter } from './footer/copyright.js'
import { initAutocomplete, geolocate } from './googleMaps/index.js'

import {
  attachValidationToFormInputs,
  handleFormSubmit,
  toggleDeliveryInput,
  attachNextButtonHandler,
  attachBackButtonHandler,
  attachCloseButtonHandler,
  setMinimumDateForFulfillment
} from './form/index.js'

import {
  attachQuantityAssistToNumberInputs
} from './form/quantity.js'

import { attachHoverEffectToProductCards } from './products/hover.js'

// Fire on DOMContentLoaded
addCurrentYearToFooter()
attachValidationToFormInputs()
attachHoverEffectToProductCards()
setMinimumDateForFulfillment()
attachQuantityAssistToNumberInputs()
initAutocomplete()

// Attach Listeners
window.addEventListener('scroll', () => {
  attachFixedClassToNavbar()
})

document.getElementById('next1').addEventListener('click', attachNextButtonHandler)
document.getElementById('next2').addEventListener('click', attachNextButtonHandler)
document.getElementById('back1').addEventListener('click', attachBackButtonHandler)
document.getElementById('closeForm').addEventListener('click', attachCloseButtonHandler)
document.getElementById('orderForm').addEventListener('submit', handleFormSubmit)
document.getElementById("delivery").addEventListener('change', toggleDeliveryInput)
document.getElementById('pickup').addEventListener('change', toggleDeliveryInput)
document.getElementById('navbar').addEventListener('click', () => {
  $('.collapse').collapse('hide')
})

// document.getElementById('location').addEventListener('focus', geolocate)
