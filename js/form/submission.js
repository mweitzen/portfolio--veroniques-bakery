/*
 *
 *  SUBMIT ORDER REQUEST
 *
 */

export async function submitOrderRequest(data) {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbyS2FhF8fJmzVx99P3CQzFzGMZh9JOQv0MHljAnhKjC5N49yg8/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify({
        route: 'order',
        payload: data
      })
    })

    return 'success'
  }
  catch (err) {
    alert('Sorry! Something went wrong. We were not able to submit your order.')
    return "fail"
  }
}

/*
 *
 *  SANITIZE DATA
 *
 */

export function sanitizeData(data) {
  const {
    almond_croissants,
    butter_croissants,
    chocolate_croissants,
    lemon_tarts_small,
    lemon_tarts_large,
    almond_tarts_small,
    almond_tarts_large,
    bread_pudding_small,
    bread_pudding_large,
    ...rest
  } = data

  const returnValue = {
    ...rest,
    quantities: {
      almond_croissants,
      butter_croissants,
      chocolate_croissants,
      lemon_tarts_small,
      lemon_tarts_large,
      almond_tarts_small,
      almond_tarts_large,
      bread_pudding_small,
      bread_pudding_large,
    },
    costs: {
      almond_croissants: almond_croissants * 3.50,
      butter_croissants: butter_croissants * 3.50,
      chocolate_croissants: chocolate_croissants * 0,
      lemon_tarts_small: lemon_tarts_small * 4,
      lemon_tarts_large: lemon_tarts_large * 25,
      almond_tarts_small: almond_tarts_small * 4,
      almond_tarts_large: almond_tarts_large * 25,
      bread_pudding_small: bread_pudding_small * 3.50,
      bread_pudding_large: bread_pudding_large * 20,
    }
  }

  const croissantsSubtotalQuantity = returnValue.quantities.almond_croissants + returnValue.quantities.butter_croissants + returnValue.quantities.chocolate_croissants
  const tartsSubtotalQuantity = returnValue.quantities.lemon_tarts_small + returnValue.quantities.lemon_tarts_large + returnValue.quantities.almond_tarts_small + returnValue.quantities.almond_tarts_large
  const breadPuddingSubtotalQuantity = returnValue.quantities.bread_pudding_small + returnValue.quantities.bread_pudding_large
  const totalQuantity = croissantsSubtotalQuantity + tartsSubtotalQuantity + breadPuddingSubtotalQuantity

  returnValue.quantities.croissantsSubtotal = croissantsSubtotalQuantity
  returnValue.quantities.tartsSubtotal = tartsSubtotalQuantity
  returnValue.quantities.breadPuddingSubtotal = breadPuddingSubtotalQuantity
  returnValue.quantities.total = totalQuantity

  const croissantsSubtotal = returnValue.costs.almond_croissants + returnValue.costs.butter_croissants + returnValue.costs.chocolate_croissants
  const tartsSubtotal = returnValue.costs.lemon_tarts_small + returnValue.costs.lemon_tarts_large + returnValue.costs.almond_tarts_small + returnValue.costs.almond_tarts_large
  const breadPuddingSubtotal = returnValue.costs.bread_pudding_small + returnValue.costs.bread_pudding_large
  let total = croissantsSubtotal + tartsSubtotal + breadPuddingSubtotal
  if (rest.fulfillment === 'delivery' && total < 40) {
    total += 10
    returnValue.deliveryFee = true
  }

  returnValue.costs.croissantsSubtotal = croissantsSubtotal
  returnValue.costs.tartsSubtotal = tartsSubtotal
  returnValue.costs.breadPuddingSubtotal = breadPuddingSubtotal
  returnValue.costs.total = total

  return returnValue
}
