import { attachFixedClassToNavbar } from './navbar/sticky.js'
import { addCurrentYearToFooter } from './footer/copyright.js'
import { attachValidationToFormInputs, handleFormSubmit, toggleDeliveryInput } from './form/index.js'
import { attachHoverEffectToProductCards } from './products/hover.js'

// Fire on DOMContentLoaded
addCurrentYearToFooter()
attachValidationToFormInputs()
attachHoverEffectToProductCards()

// Attach Listeners
window.addEventListener('scroll', () => {
  attachFixedClassToNavbar()
})
// document.getElementById('orderForm').addEventListener('submit', handleFormSubmit)
// document.getElementById('cater').addEventListener('change', toggleDeliveryInput)
// document.getElementById('pickup').addEventListener('change', toggleDeliveryInput)
