
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

  fetch("https://tools.gabcgfs.com/graphql/getStoreLocation.php")
    .then((response) => response.json())
    .then((data) => fetchData(data));

  function fetchData(json) {
    arr = [];
    arr_data = [];
    let getList = json.data.locations.edges;

    for (let i = 0; i < getList.length; i++) {
      pizza = getList[i].node.id.split("/");
      const id = pizza[4];
      const storeName = getList[i].node.name;

      arr.push({
        id: id,
        Title: storeName
      });
    }

    fetch(
        "https://omnistorelocations.goldenabc.com/storelocations/Shopify/Api/GetStoreLocations?brand=penshoppe"
      )
      .then((response) => response.json())
      .then((jsonData) => {
        data1 = arr;
        data2 = jsonData;
        // Parse the JSON strings into JavaScript objects
        const array1 = data1;
        const array2 = data2.message;

        // Create an empty result array
        const mergedArray = [];
        // Iterate through array1
        for (const obj1 of array1) {
          // Find a matching object in array2 based on the "name" property
          const obj2 = array2.find((item) => item.Title === obj1.Title);

          // If a match is found, merge the properties into a new object
          if (obj2) {
            const mergedObject = {
              ...obj1,
              ...obj2
            };
            mergedArray.push(mergedObject);
          }
        }

        for (let i = 0; i < mergedArray.length; i++) {
          const Title = mergedArray[i].Title;
          const City = mergedArray[i].City;
          const Province = mergedArray[i].Province;
          const Zipcode = mergedArray[i].Zipcode;
          const Latitude = mergedArray[i].Latitude;
          const Longitude = mergedArray[i].Longitude;
          const listaddress = `${mergedArray[i].Street.trim()} ${mergedArray[i].City.trim()} ${mergedArray[i].Country.trim()}`;
          html = `
          <div class="filterData" style="display: flex;">

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
   
             <label class="radio__label" for="checkout_delivery_option_id_${i}" style="display: flex;">
              <div class="radio__label__primary">
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
              </div>
             </label>

          </div>
                `;

          arr_data.push(html);

        }

        if (arr_data.join("") == "") {
          document.querySelector(".nearBy").innerHTML = `<div style="display: flex; justify-content: center;"><h1 style="
            padding: 0 12px;
            background-color: red;
            color: white;
            font-weight: 400;
            width: 100%;
            text-align: -webkit-center;
            ">There is no store near you</h1></div>`;
        } else {
          document.querySelector(".nearBy").innerHTML = arr_data.join('');
          getTotalResult('firstOutputTotal');
        }
      });
  }