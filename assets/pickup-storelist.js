ZipBarangay = [];
const customer_address_store = JSON.parse(localStorage.getItem("customer_address"));
if (customer_address_store != null) {
  getCitystore(customer_address_store.city);
} else {

  window.document.querySelector('.resultList').style.display = "none";
}



function getCitystore(city) {

  url = `https://tools.gabcgfs.com/address_finder_dev.php?CITY=${city}`;
  jQuery.ajax({ url: url, type: "GET", dataType: "jsonp", contentType: "application/json; charset=UTF-8" }).done(function (json) {

    for (let i = 0; i < json[0].CITY[0].BARANGAY.length; i++) {
      const arrZ = [
        json[0].CITY[0].BARANGAY[i].BARANGAY,
        json[0].CITY[0].BARANGAY[i].ZIP,
        json[0].CITY[0].BARANGAY[i].latitude,
        json[0].CITY[0].BARANGAY[i].longitude
      ];

      ZipBarangay.push(arrZ);
    }

    getBarangaystore(customer_address_store.barangay);

    function getBarangaystore(barangay) {

      // Function to find the value for a given location
      function findValueForLocation(locationName) {
        for (let i = 0; i < ZipBarangay.length; i++) {

          if (ZipBarangay[i][0] === locationName) {
            return ZipBarangay[i][1];
          }
        }
        return null; // Return null if location is not found
      }
      function findValueForlat(locationName) {
        for (let i = 0; i < ZipBarangay.length; i++) {
          if (ZipBarangay[i][0] === locationName) {
            return ZipBarangay[i][2];
          }
        }
        return null; // Return null if location is not found
      }
      function findValueForlong(locationName) {
        for (let i = 0; i < ZipBarangay.length; i++) {
          if (ZipBarangay[i][0] === locationName) {
            return ZipBarangay[i][3];
          }
        }
        return null; // Return null if location is not found
      }

      const getZip = findValueForLocation(barangay);
      const getlat = findValueForlat(barangay);
      const getlong = findValueForlong(barangay);

      $("#zip").val(getZip);
      getList_Store(getlat, getlong);

    }

  });

}


function getList_Store(lat, long) {
  const lat1 = lat;
  const lon1 = long;
  function nearbydata(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2);
  }

  html_loading = `<div style="display: flex; justify-content: center;"><span class="loader">Loading</span></div>`;
  document.querySelector(".listStore").innerHTML = html_loading;

  let url = "https://omnistorelocations-dev.goldenabc.com/storelocations/Shopify/Api/GetStoreLocations?brand=penshoppe";
  fetch(url).then((response) => response.json()).then((json) => getlocation(json));

  function getlocation(data) {

    let arr_data = [];
    let arr = data.message;

    for (let i = 0; i < arr.length; i++) {
      const Title = arr[i].Title;
      const City = arr[i].City;
      const Province = arr[i].Province;
      const Zipcode = arr[i].Zipcode;
      const Latitude = arr[i].Latitude;
      const Longitude = arr[i].Longitude;

      fetch('https://tools.gabcgfs.com/shoplocation.php').then(response => response.json()).then(data => {
        const jsonData = data;

        // Get the value of the 'name' parameter from the URL
        const nameParam = Title;

        // Filter the data based on the 'name' parameter
        const filteredData = jsonData.filter(item => {
          if (nameParam) {
            return item.name.toLowerCase().includes(nameParam.toLowerCase());
          } else {
            return true; // If 'name' parameter is not provided, return all items
          }
        });

        // get the store we have in UAT dev
        if (filteredData[0].id != '') {
          const listaddress_storedata = `${arr[i].Street
            } ${arr[i].City
            } ${arr[i].Country
            }`;

          const listStore_getkm = nearbydata(lat1, lon1, Latitude, Longitude);

          if (Longitude != null && Latitude != null && Title != "" && Title != "null") {
            if (listStore_getkm <= 10) {

              html = `<div>
            <label class="radio__label" for="checkout_delivery_option_id_${i}" style="display: flex; margin: 10px;"
            ><div class="radio__label__primary" style="width: 80%;">
            <div style="font-size:16px;"><b>${Title}</b></div>
            <p style="margin-bottom:0;">
            ${listaddress_storedata}
            <br>
            Open ·  Closes 10 PM
            <br>
            In-store · shopping In-store pickup
            </p>
            </div>
            <div class="radio__label__accessory" style="width: 20%; text-align: end;">
            <span style="width: 10%"><b>${listStore_getkm} Km</b></span>
            </div></label
            ></div>
                `;

              arr_data.push(html);

            }
          }
        }

        const locationData = arr_data.map((htmlString) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = htmlString;
          const distanceText = tempDiv.querySelector("span:last-child").textContent;
          const distanceKm = parseFloat(distanceText.replace(" Km", ""));
          return { html: htmlString, distance: distanceKm };
        });

        // Sort the location data by distance
        locationData.sort((a, b) => a.distance - b.distance);

        // Rebuild the sorted HTML elements
        const sortedLocationElements = locationData.map((data) => data.html);

        // Now you can use sortedLocationElements to update your HTML container
        if (sortedLocationElements.join("") == "") {
          document.querySelector(".listStore").innerHTML = `<div style="display: flex; justify-content: center;"><h4 style="
            padding: 0 12px 0 58px;
            width: 100%;
            text-align: -webkit-center;
            ">There is no store near you</h4></div>`;
        } else {
          document.querySelector(".listStore").innerHTML = sortedLocationElements.join('');
        }
      })
    }
  }
}