let placeSearch, autocomplete;

export function initAutocomplete() {
  // set 10 mile radius for delivery from Restaurant
  const restaurantLocation = {
    lat: 34.024397,
    lng: -118.3985791
  };

  const tenMilesInMeters = 16093.4

  const circle = new google.maps.Circle({
    center: restaurantLocation,
    radius: tenMilesInMeters
  });

  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('location'),
    {
      types: ['geocode'],
      bounds: circle.getBounds(),
      strictBounds: true
    }
  );

  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(['address_component']);

  document.getElementById('location').addEventListener('keyup', () => {
    document.getElementById('next2').disabled = true
  })

  document.getElementById('fulfillment-type').addEventListener('change', (e) => {
    // document.getElementById('next2').disabled = true
    if (e.target.value === 'delivery') {
      document.getElementById('next2').disabled = true
    } else {
      document.getElementById('next2').disabled = false
    }
  })

  autocomplete.addListener('place_changed', () => {
    document.getElementById('next2').disabled = false
  })
}

// export function checkAddress() {
//   // Get the place details from the autocomplete object.
//   var place = autocomplete.getPlace();
//   // if (!place) {
//   //   console.log('FAIL')
//   // } else {
//   //   console.log(place)
//   // }
// }

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
export function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      const circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });

      autocomplete.setBounds();
    });
  }
}
