     // Get a total count on result
    function getTotalResult(valueName){
         
      if(valueName === 'firstOutputTotal'){
            let totalResult= document.querySelectorAll(".filterData").length
          document.querySelector('#totalResult').innerHTML=totalResult;
      }else{
            let totalResult= document.querySelectorAll('.filterData[style*="display: flex;"]').length;
          document.querySelector('#totalResult').innerHTML=totalResult;
      
      }
      }

        // Get a reference to the input field
      const searchInput = document.getElementById("locationSearch");
 const searchInputProvince = document.getElementById("provinceSearch");
 const searchInputCity = document.getElementById("citySearch");


      // Add an event listener to the input field
      searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.trim().toLowerCase();
        searchLocations("store name",searchText);
        if(searchInput.value == ''){
            const searchTextprovince = document.querySelector(".provinceSearch").value.trim().toLowerCase();
        searchLocations("province",searchTextprovince);
           const searchTextcity = document.querySelector(".citySearch").value.trim().toLowerCase();
        searchLocations("city",searchTextcity);
        }else{
            var countValue=sessionStorage.getItem("countValue");
            fetchListStore(countValue)
        }
      });

     searchInputProvince.addEventListener("change", function () {
        const searchText = searchInputProvince.value.trim().toLowerCase();
        searchLocations("province",searchText);
      });

  searchInputCity.addEventListener("change", function () {
        const searchText = searchInputCity.value.trim().toLowerCase();
        searchLocations("city",searchText);
      });

      function searchLocations(condition,query) {
         // Get all the location labels
        const locationLabels = document.querySelectorAll(".filterData");
        if(condition === 'store name'){
           // Loop through each location label
        locationLabels.forEach((label) => {
          const locationName = label
            .querySelector(".locationName")
            .textContent.toLowerCase();

          // Check if the locationName contains the search query
          if (locationName.includes(query)) {
            // Show the matching location
            label.style.display = "flex";
           
          } else {
            // Hide the non-matching location
            label.style.display = "none";
          }

           getTotalResult('lastOutputTotal');
        });
        }else if(condition === 'province'){
           // Loop through each location label
        locationLabels.forEach((label) => {
          const locationName = label
            .querySelector(".province")
            .textContent.toLowerCase();

          // Check if the locationName contains the search query
          if (locationName.includes(query)) {
            // Show the matching location
            label.style.display = "flex";
           
          } else {
            // Hide the non-matching location
            label.style.display = "none";
          }

           getTotalResult('lastOutputTotal');
        });
        }else if(condition === 'city'){
           // Loop through each location label
        locationLabels.forEach((label) => {
          const locationName = label
            .querySelector(".city")
            .textContent.toLowerCase();

          // Check if the locationName contains the search query
          if (locationName.includes(query)) {
            // Show the matching location
            label.style.display = "flex";
           
          } else {
            // Hide the non-matching location
            label.style.display = "none";
          }

           getTotalResult('lastOutputTotal');
        });
        }
      }
