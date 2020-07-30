export function attachHoverEffectToProductCards(){

  // loop over all of the product cards
  let productCards = document.querySelectorAll('.product-card')
  for (let x = 0; x < productCards.length; x++) {

    // original card
    let card = productCards.item(x)
    const productDescription = card.querySelector('div.product-content p.product-description')
    const productPrice = card.querySelector('div.product-content p.product-price')

    // mouseover
    card.addEventListener('mouseover', (e) => {
      productDescription.style.display = "none"
      productPrice.style.display = "block"
    })

    // mouseout
    card.addEventListener('mouseout', (e) => {
      productPrice.style.display = "none"
      productDescription.style.display = "block"
    })
  }
}
