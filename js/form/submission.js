export async function submitOrderRequest(data) {
  console.log(data)
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
