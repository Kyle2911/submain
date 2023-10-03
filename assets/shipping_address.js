 var arr_shipping_address = JSON.parse(localStorage.getItem("arrProvince"));
    if (arr_shipping_address != null) {
   
      province = [];
      var data = JSON.parse(localStorage.arrProvince);
      for (let i = 0; i < data.province.length; i++) {
        const arrP = `${
          data.province[i]
        }`;
        province.push(arrP);
      }
      $("#checkout_shipping_address_city").html(province.sort().join(""));
    } else {

      url = "https://tools.gabcgfs.com/address_finder_dev.php";
      province = [];
      province.push('<option value="" Selected>Province</option>');
      jQuery.ajax({url: url, type: "GET", dataType: "jsonp", contentType: "application/json; charset=UTF-8"}).done(function(json) {
        for (let i = 0; i < json.length; i++) {
          const arrP = `<option value="${
            json[i].PROVINCE
          }">${
            json[i].PROVINCE
          }</option>`;
          province.push(arrP);
        }
  
        $("#checkout_shipping_address_city").html(province.join(""));
        localStorage.setItem("arrProvince", JSON.stringify({province}));
      });

    }

 document.querySelector('#checkout_shipping_address_city').addEventListener("change",() => {
    let province = $("#checkout_shipping_address_city").val();
    url = `https://tools.gabcgfs.com/address_finder_dev.php?PROVINCE=${province}`;
    City = [];
    City.push('<option value="">Town or City</option>');
    jQuery
      .ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
      })
      .done(function (json) {
        if (json != "") {
          for (let i = 0; i < json[0].CITY.length; i++) {
            const arrC = `<option value="${json[0].CITY[i].CITY}">${json[0].CITY[i].CITY}</option>`;
            City.push(arrC);
          }
        } else {
          City.push();
        }

        $("#checkout_shipping_address_address2").html(City.join(""));
      });
  });   

 document.querySelector('#checkout_shipping_address_address2').addEventListener("change",()=> {
    let city = $("#checkout_shipping_address_address2").val();
    url = `https://tools.gabcgfs.com/address_finder_dev.php?CITY=${city}`;
    Brgy = [];

    Brgy.push('<option value="" Selected>Barangay</option>');
    jQuery
      .ajax({
        url: url,
        type: "GET",
        dataType: "jsonp",
        contentType: "application/json; charset=UTF-8",
      })
      .done(function (json) {
        for (let i = 0; i < json[0].CITY[0].BARANGAY.length; i++) {
          const arrC = `<option value="${json[0].CITY[0].BARANGAY[i].BARANGAY}">${json[0].CITY[0].BARANGAY[i].BARANGAY}</option>`;
          const arrZ = [
            json[0].CITY[0].BARANGAY[i].BARANGAY,
            json[0].CITY[0].BARANGAY[i].ZIP,
          ];
          Brgy.push(arrC);
          ZipBarangay.push(arrZ);
        }

        $("#checkout_shipping_address_address1").html(Brgy.join(""));
      });
  }); 

    document.querySelector('#checkout_shipping_address_address1').addEventListener("change",() => {
    let barangay = $("#checkout_shipping_address_address1").val();
    // Function to find the value for a given location
    function findValueForLocation(locationName) {
      for (let i = 0; i < ZipBarangay.length; i++) {
        if (ZipBarangay[i][0] === locationName) {
          return ZipBarangay[i][1];
        }
      }
      return null; // Return null if location is not found
    }
    const zipCode = findValueForLocation(barangay);
    $("#checkout_shipping_address_zip").val(zipCode);

       customer_address= `{"province":"${$('#checkout_shipping_address_city').val()}","city":"${$('#checkout_shipping_address_address2').val()}","barangay":"${$('#checkout_shipping_address_address1').val()}","zip":"${zipCode}","street_address":"${$('#checkout_shipping_address_company').val()}"}`;
         localStorage.setItem('customer_address',customer_address);
  });


  // For get the customer address data

    function AutoGetCity() {
    let province = $("#checkout_shipping_address_city").val();
    url = `https://tools.gabcgfs.com/address_finder_dev.php?PROVINCE=${province}`;
    City = [];
    City.push('<option value="">Town or City</option>');
    jQuery.ajax({url: url, type: "GET", dataType: "jsonp", contentType: "application/json; charset=UTF-8", }).done(function (json) {
        if (json != "") {
          for (let i = 0; i < json[0].CITY.length; i++) {
            const arrC = `<option value="${json[0].CITY[i].CITY}">${json[0].CITY[i].CITY}</option>`;
            City.push(arrC);
          }
        } else {
          City.push();
        }
          $("#checkout_shipping_address_address2").html(City.join(""));
      });
  }

    function AutoGetBarangay() {
      let city = $("#checkout_shipping_address_address2").val();
      url = `https://tools.gabcgfs.com/address_finder_dev.php?CITY=${city}`;
      Brgy = [];
      Brgy.push('<option value="" Selected>Barangay</option>');
      jQuery.ajax({url: url, type: "GET", dataType: "jsonp", contentType: "application/json; charset=UTF-8"}).done(function(json) {
        for (let i = 0; i < json[0].CITY[0].BARANGAY.length; i++) {
          const arrC = `<option value="${
            json[0].CITY[0].BARANGAY[i].BARANGAY
          }">${
            json[0].CITY[0].BARANGAY[i].BARANGAY
          }</option>`;
          Brgy.push(arrC);
        }
        $("#checkout_shipping_address_address1").html(Brgy.join(""));
      });
    }

        // Get a customer address if there is a existing data
        const addressGathering = JSON.parse(localStorage.getItem('customer_address'));
      if(addressGathering != null){
        $('#checkout_shipping_address_city').val(addressGathering.province);
          AutoGetCity();

        // delay a output
      setTimeout(()=>{
        document.querySelector('#checkout_shipping_address_address2').value=addressGathering.city;
        AutoGetBarangay();
         setTimeout(()=>{
        document.querySelector('#checkout_shipping_address_address1').value=addressGathering.barangay;
      },1000);
      },800);

         $('#checkout_shipping_address_company').val(addressGathering.street_address);
         $('#checkout_shipping_address_zip').val(addressGathering.zip);
      }