function googlePinMaps(){
    fetch("http://localhost/reversedomain/data.php")
      .then((response) => response.json())
      .then((json) => GetData(json));

    function GetData(zipCodeData) {


      function findZipCode(lat, lon) {
        // Calculate the closest ZIP code based on latitude and longitude
        let closestZipCode = null;
        // MAX_SAFE_INTEGER and it is 9007199254740991
        let closestDistance = Infinity;

        for (const entry of zipCodeData) {
          const distance = calculateDistance(lat, lon, entry.lat, entry.lon);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestZipCode = entry.postalCode;
            Province = entry.province;
            City = entry.city;
            Barangay = entry.barangay;

          }
        }
        customer_address= `{"province":"${Province}","city":"${City}","barangay":"${Barangay}","zip":"${closestZipCode}","street_address":""}`;
         localStorage.setItem('customer_address',customer_address);
      }

      // Helper function to calculate distance between two points using Haversine formula
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const radius = 6371; // Earth's radius in kilometers
        const dLat = degToRad(lat2 - lat1);
        const dLon = degToRad(lon2 - lon1);

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = radius * c;

        return distance;
      }

      // Helper function to convert degrees to radians
      function degToRad(deg) {
        return deg * (Math.PI / 180);
      }

      getLocation()

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }
      }

      function showPosition(position) {
        // Example usage
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const zipCode = findZipCode(latitude, longitude);
        console.log(`The nearest ZIP code is ${zipCode}`);
        document.getElementById('address').innerHTML = zipCode;
      }


    }
}