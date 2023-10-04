
function giveMsgError(){
    htmlError= `Please select store location`;
    document.querySelector("#MsgErrorFunction").innerHTML=htmlError;
}


ZipBarangay = [];
  const customer_address = JSON.parse(localStorage.getItem("customer_address"));
  getCity(customer_address.city);
  function getStoreListData(Title, listaddress, City, Province, Zipcode, Longitude, Latitude) {
$('.active-radio').click();
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

// Log the filtered data
      $('.StoreId_Data').html("");
      if (filteredData[0].id != '') {
        resOutput = ` <input type="hidden" value="${
          filteredData[0].id
        }" name="checkout[attributes][pickup_store_id]"/>`
        $('.StoreId_Data').html(resOutput);

      }
    })
    resOutput = `
         <input type="hidden" value="${Title}" name="checkout[attributes][pickup_store_title]"/>
          <input type="hidden" value="${listaddress}" name="checkout[attributes][pickup_store_street]"/>
           <input type="hidden" value="${City}" name="checkout[attributes][pickup_store_city]"/>
            <input type="hidden" value="${Province}" name="checkout[attributes][pickup_store_province]"/>
             <input type="hidden" value="${Zipcode}" name="checkout[attributes][pickup_store_zip]"/>
             <input type="hidden" value="{{ checkout.id }}" name="checkout[attributes][Checkout_#]"/>
              <input type="hidden" value="${Longitude}" name="checkout[attributes][Longitude]"/>
               <input type="hidden" value="${Latitude}" name="checkout[attributes][Latitude]"/>
       `;
    $('.attr_data').html(resOutput)
    setShippingMethod = `Pick up in store · <strong>${Title}</strong><br><p class="small-text">${listaddress} ${Zipcode}</p>`;
    localStorage.setItem('ShippingMethod', setShippingMethod)
  }


  function getCity(city) {

    url = `https://tools.gabcgfs.com/address_finder_dev.php?CITY=${city}`;
    jQuery.ajax({url: url, type: "GET", dataType: "jsonp", contentType: "application/json; charset=UTF-8"}).done(function(json) {

      for (let i = 0; i < json[0].CITY[0].BARANGAY.length; i++) {
        const arrZ = [
          json[0].CITY[0].BARANGAY[i].BARANGAY,
          json[0].CITY[0].BARANGAY[i].ZIP,
          json[0].CITY[0].BARANGAY[i].latitude,
          json[0].CITY[0].BARANGAY[i].longitude
        ];

        ZipBarangay.push(arrZ);
      }

      getBarangay(customer_address.barangay);

      function getBarangay(barangay) {

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
        getListStore(getlat, getlong);
      }

    });

  }


  function getListStore(lat, long) {

    html_loading = `<div style="display: flex; justify-content: center;"><span class="loader">Loading</span></div>`;
    document.querySelector(".nearBy").innerHTML = html_loading;

    function nearbydata(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance.toFixed(2);
    }

    const lat1 = lat;
    const lon1 = long;
    let url = "https://omnistorelocations.goldenabc.com/storelocations/Shopify/Api/GetStoreLocations?brand=penshoppe";
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
        const listStore = nearbydata(lat1, lon1, Latitude, Longitude);
        const listaddress = `${arr[i].Street.trim()} ${arr[i].City.trim()} ${arr[i].Country.trim()}`;

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

// Log the filtered data
      if (filteredData[0].id != '') {
       if (Longitude != null && Latitude != null && Title != "" && Title != "null") {
         
            html = `<div class="filterData" style="
    display: flex;
">
             <div class="radio__input">
      <input
        class="input-radio" onclick="getStoreListData('${Title.trim()}','${listaddress}','${City}','${Province}','${Zipcode}','${Longitude}','${Latitude}')"
        type="radio"
        value="${i}"
        name="checkout[attributes][id]"
        id="checkout_delivery_option_id_${i}"
        data-checkout-total-shipping="Free"
        data-checkout-total-shipping-cents="0"
      />
    </div>
    <label class="radio__label" for="checkout_delivery_option_id_${i}" style="
    display: flex;
"
      ><div class="radio__label__primary">
        <div class="locationName">${Title}</div>
        <div class="small-text">${listaddress}</div>
        <div class="small-text pickup-instructions show-on-mobile">
          Usually ready in 24 hours
        </div>
      </div>
      <div class="radio__label__accessory">
        <div class="content-box__emphasis">Free</div>
        <div class="small-text pickup-instructions hide-on-mobile">
          Usually ready in 24 hours
        </div>
        <span style="font-size: small; width: 10%">${listStore} Km</span>
      </div></label
    ></div>
                `;
            arr_data.push(html);
     
        }
    const locationData = arr_data.map((htmlString) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;
        const distanceText = tempDiv.querySelector("span:last-child").textContent;
        const distanceKm = parseFloat(distanceText.replace(" Km", ""));
        return {html: htmlString, distance: distanceKm};
     
      });

// Sort the location data by distance
      locationData.sort((a, b) => a.distance - b.distance);

// Rebuild the sorted HTML elements
      const sortedLocationElements = locationData.map((data) => data.html);

// Now you can use sortedLocationElements to update your HTML container
      if (sortedLocationElements.join("") == "") {
        document.querySelector(".nearBy").innerHTML = `<div style="display: flex; justify-content: center;"><h1 style="
            padding: 0 12px;
            background-color: red;
            color: white;
            font-weight: 400;
            width: 100%;
            text-align: -webkit-center;
            ">There is no store near you</h1></div>`;
      } else {
        document.querySelector(".nearBy").innerHTML = sortedLocationElements.join('');
      getTotalResult();
      }
      }
    })

    
      }

  
    }
  }