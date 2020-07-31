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
document.getElementById('next1').addEventListener('click', () => {
  document.getElementById('order').style.display = 'none'
  document.getElementById('orderDetails').style.display = 'block'
})
document.getElementById('next2').addEventListener('click', () => {
  document.getElementById('orderDetails').style.display = 'none'
  document.getElementById('contactDetails').style.display = 'block'
})
document.getElementById('back1').addEventListener('click', () => {
  document.getElementById('orderDetails').style.display = 'none'
  document.getElementById('order').style.display = 'block'
})
document.getElementById('closeForm').addEventListener('click', () => {
  setTimeout(() => {
    document.getElementById('orderDetails').style.display = 'none'
    document.getElementById('contactDetails').style.display = 'none'
    document.getElementById('order').style.display = 'block'
  }, 600)
})
document.getElementById('orderForm').addEventListener('submit', handleFormSubmit)
document.getElementById('cater').addEventListener('change', toggleDeliveryInput)
document.getElementById('pickup').addEventListener('change', toggleDeliveryInput)
