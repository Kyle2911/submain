// window.theme = window.theme || {};
// theme.AddressFinder = (function () {
//   /**
//    * Address Finder plugin
//    * @param {object} options - the plugin options
//    * @param { string | undefined } options.errorElSelector - the error element selector
//    * @param { object | undefined} options.errorMessage - the error messages
//    * @param { string | undefined} options.errorMessage.PERMISSION_DENIED - the message when PERMISSION_DENIED
//    * @param { string | undefined} options.errorMessage.POSITION_UNAVAILABLE - the message when POSITION_UNAVAILABLE
//    * @param { string | undefined} options.errorMessage.TIMEOUT - the message when TIMEOUT
//    * @param { string | undefined} options.errorMessage.UNKNOWN_ERROR - the message when there is UNKNOWN_ERROR
//    */
//   function AddressFinder(options = {}, id) {
//     this.namespace = ".address-finder";
//     this.selectors = {
//       btn: "[data-locate-button]",
//       container: ".address-finder-container",
//       closeBtn: "[data-close-modal-btn]",
//     };
//     this.default = {
//       errorMessage: {
//         PERMISSION_DENIED: "User denied the request for Geolocation.",
//         POSITION_UNAVAILABLE: "Location information is unavailable.",
//         TIMEOUT: "The request to get user location timed out.",
//         UNKNOWN_ERROR: "An unknown error occurred.",
//         EMPTY_ADDRESS: "Can not find your address.",
//         USE_DEFAULT: "Please use the address finder form.",
//       },
//       errorSelector: ".error-message",
//       addressSelector: "[data-address-finder-text]",
//       modalOpenBtnSelector: "[data-address-finder-open-btn]",
//       editBtnText: "Edit your location?",
//       loadLocationBtnSelector: "[data-load-location-btn]",
//     };
//     this.options = Object.assign({}, this.default, options);
//     this.addressFinderPLPSelector = "[data-address-finder-plp]";
//     // if(typeof google !== undefined) {
//     //   this.geocode = new google.maps.Geocoder();
//     // }
//     this.addressElement = document.querySelectorAll(
//       this.options.addressSelector
//     );
//     this.container = document.getElementById(id) || document;
//     this.closeBtns = this.container.querySelectorAll(
//       this.selectors.closeBtn
//     );
//     this.defaultAddress = {
//       "results": [
//         {
//           "address_components": [
//             {
//               "long_name": "20",
//               "short_name": "20",
//               "types": [
//                 "street_number"
//               ]
//             },
//             {
//               "long_name": "Emilio Jacinto",
//               "short_name": "Emilio Jacinto",
//               "types": [
//                 "route"
//               ]
//             },
//             {
//               "long_name": "Matandang Balara",
//               "short_name": "Brgy. Matandang Balara",
//               "types": [
//                 "political",
//                 "sublocality",
//                 "sublocality_level_1"
//               ]
//             },
//             {
//               "long_name": "Quezon City",
//               "short_name": "QC",
//               "types": [
//                 "locality",
//                 "political"
//               ]
//             },
//             {
//               "long_name": "Metro Manila",
//               "short_name": "NCR",
//               "types": [
//                 "administrative_area_level_1",
//                 "political"
//               ]
//             },
//             {
//               "long_name": "Philippines",
//               "short_name": "PH",
//               "types": [
//                 "country",
//                 "political"
//               ]
//             },
//             {
//               "long_name": "1126",
//               "short_name": "1126",
//               "types": [
//                 "postal_code"
//               ]
//             }
//           ],
//           "formatted_address": "20 Emilio Jacinto, Matandang Balara, Quezon City, 1126 Metro Manila, Philippines",
//           "geometry": {
//             "bounds": {
//               "south": 14.6668199,
//               "west": 121.0904255,
//               "north": 14.6670672,
//               "east": 121.0907342
//             },
//             "location": {
//               "lat": 14.6669415,
//               "lng": 121.0905867
//             },
//             "location_type": "ROOFTOP",
//             "viewport": {
//               "south": 14.6655945697085,
//               "west": 121.0892704197085,
//               "north": 14.66829253029151,
//               "east": 121.0919683802915
//             }
//           },
//           "partial_match": true,
//           "place_id": "ChIJ78vGVOW5lzMRNS4POUuw_9I",
//           "types": [
//             "premise"
//           ]
//         }
//       ]
//     };
//     this.loaddingClass = "btn--loading";
//     this.disabledClass = "disabled";
//     this.isTest = this.container.dataset.testMode === "true";
//     // this.isTest = true;
//     this.hiddenClass = "hide";
//     this.init();
//   }
//   AddressFinder.prototype = Object.assign({}, AddressFinder.prototype, {
//     init: function () {
//       var that = this;
//       var container = this.container || document;
//       this.errorElement = container.querySelector(
//         this.options.errorSelector
//       );
//       this.btns = document.querySelectorAll(this.selectors.btn);
//       if (this.btns) {
//         this.btns.forEach((btn) => {
//           btn.off("click" + this.namespace);
//           btn.on("click" + this.namespace, (evt) => {
//             this.getLocation.bind(this, evt)();
//           });
//         });
//       }
//       if (this.closeBtns) {
//         this.closeBtns.forEach((btn) => {
//           btn.off("click" + this.namespace);
//           btn.on(
//             "click" + this.namespace,
//             async (evt) => await this.onVerifyAddress.bind(this, evt)()
//           );
//         });
//       }
//       this.loadData();
//     },
//     getLocation: function (evt) {
//       let $element = evt.target;
//       if (!$element.classList.contains("btn")) {
//         $element = evt.target.closest(".btn");
//       }
//       $element.classList.add(this.loaddingClass);
//       $element.classList.add(this.disabledClass);
//       if (this.isTest) {
//         this.onGeocodeSuccess(this.defaultAddress);
//         $element.classList.remove(this.loaddingClass);
//         $element.classList.remove(this.disabledClass);
//         return;
//       } else {
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               this.onGetLocationSuccessfully.bind(this, position)();
//             },
//             (error) => {
//               this.showError.bind(this, error)();
//               this.removeLoadingClass();
//             }
//           );
//         } else {
//           alert("Geolocation is not supported by this browser.");
//         }
//       }
//     },
//     showAddress() {
//       if (this.address.formattedAddress) {
//         var addressNodes = document.querySelectorAll(
//           this.options.addressSelector
//         );
//         var openModelBtnNodes = document.querySelectorAll(
//           this.options.modalOpenBtnSelector
//         );
//         if (addressNodes) {
//           addressNodes.forEach(
//             (node) => (node.innerHTML = this.address.formattedAddress)
//           );
//         }
//         if (openModelBtnNodes) {
//           openModelBtnNodes.forEach(
//             (node) => (node.innerHTML = this.options.editBtnText)
//           );
//         }
//       }
//     },
//     /**
//      * Load the location from session storate
//      * @return {void}
//      */
//     loadData() {

//       if (window.localStorage) {
//         const address = JSON.parse(window.localStorage.getItem("address"));
//         if (address) {
//           this.address = address;
//           this.showAddressOnModal();
//           this.showAddressOnContentBox();
//           this.updateOpenModalBtnText();
//           this.showAddress();
//           this.addClassToAddressFinder();
//           if(address.radias) {
//             this.reflectRadias(address.radias);
//           }
//           this.reflectProvince(address.prov_id, address.province);
//         }
//       }
//     },
//     /** Reflect stored radius to the select */
//     reflectRadias(radias) {
//       const radiusSelect = document.getElementById('radius');
//       if(radiusSelect) {
//         radiusSelect.value = radias;
//       }
//     },
//     reflectProvince(province, proName) {
//       const $province = document.getElementById('province');
//       const $options = $province.querySelectorAll('option');
//       const selectedOption = Array.from($options).find(opt => String(opt.text).toUpperCase() === String(proName).toUpperCase());
//       if($province) {
//         $province.value = province;
//         if($province.selectedIndex === -1) {
//           $province.value = selectedOption.value;
//         }
//         $province.dispatchEvent(new Event('change'));
//       }
//     },
//     removeLoadingClass() {
//       const $element = document.querySelectorAll(".btn--loading");
//       if ($element) {
//         $element.forEach((node) => {
//           node.classList.remove(this.loaddingClass);
//           node.classList.remove(this.disabledClass);
//         });
//       }
//     },
//     /**
//      * Handler the getPosition success
//      * @param {GeolocationPosition} position
//      * @return {void}
//      */
//     onGetLocationSuccessfully(position = {}) {
//       const { coords } = position;
//       const latlng = {
//         lat: parseFloat(coords.latitude),
//         lng: parseFloat(coords.longitude),
//       };
//       this.geocode
//         .geocode({ location: latlng })
//         .then((res) => {
//           this.removeLoadingClass();
//           const postcode = this.getPostCode(res);
//           if (!(res.results && postcode)) {
//             this.showError(
//               `${this.options.errorMessage.EMPTY_ADDRESS} <p>${this.options.errorMessage.USE_DEFAULT}</p>`
//             );
//             return;
//           }
//           this.onGeocodeSuccess(res);
//         })
//         .catch((err) => {
//           console.log("err", err);
//           this.onGeocodeError(err);
//           this.removeLoadingClass();
//         });
//     },
//     /**
//      * On google map geocode success
//      * @param {object} res - the success result from google map geocode api
//      * @return {void}
//      */
//     onGeocodeSuccess(res = {}) {
//       var postcode = this.getPostCode(res);
//       var country = this.getCountry(res);
//       var radias = this.getRadias();
//       var city = this.getCity(res);
//       var province = this.getProvince(res);
//       var streetNumber = this.getStreetNumber(res) || '';
//       var route = this.getRoute(res) || '';
//       var address = {
//         formattedAddress: res.results[0].formatted_address,
//         country,
//         postcode,
//         radias,
//         city,
//         address_name: (streetNumber ? streetNumber : '') + (route ? `, ${route}` : ''),
//         province,
//       };
//       if (address) {
//         this.address = address;
//       }
//       this.showAddressOnModal();
//       this.hideErrorMessage();
//       if (this.closeBtns) {
//         this.closeBtns.forEach((btn) => btn.classList.remove("disabled"));
//       }
//     },

//     updateOpenModalBtnText() {
//       const nodes = document.querySelectorAll(
//         this.options.modalOpenBtnSelector
//       );
//       if (nodes) {
//         nodes.forEach(
//           (node) => (node.innerHTML = this.options.editBtnText)
//         );
//       }
//     },
//     /**
//      * Show found address on modal
//      * @return {void}
//      */
//     showAddressOnModal() {
//       const $element = this.container;
//       if (this.address) {
//         const addressNode = $element.querySelectorAll(
//           this.options.addressSelector
//         );
//         if (addressNode) {
//           addressNode.forEach(
//             (node) => (node.innerHTML = this.address.formattedAddress)
//           );
//         }
//       }
//     },
//     showAddressOnContentBox() {
//       if (this.address) {
//         const addressNode = document.querySelector(
//           ".address-finder-box " + this.options.addressSelector
//         );
//         if (addressNode) {
//           addressNode.innerHTML = this.address.formattedAddress;
//         }
//       }
//     },
//     /**
//      * Save the found addresss to sesstion storage
//      */
//     storeData() {
//       if (window.sessionStorage && this.address) {
//         const radias = this.getRadias();
//         this.address = { ...this.address, radias };
//         window.localStorage.setItem(
//           "address",
//           JSON.stringify(this.address)
//         );
//       }
//     },
//     /**
//      * Get PostCode
//      * @param {*} addressObj - the address object
//      * @return {string}
//      */
//     getPostCode(addressObj) {
//       var postCode = "";
//       addressObj.results.map((item) => {
//         item.address_components.map((address_component) => {
//           if (address_component.types.includes("postal_code")) {
//             postCode = address_component.long_name;
//           }
//         });
//       });
//       return postCode;
//     },
//     getStreetNumber(addressObj) {
//       var postCode = "";
//       addressObj.results.map((item) => {
//         item.address_components.map((address_component) => {
//           if (address_component.types.includes("street_number")) {
//             postCode = address_component.long_name;
//           }
//         });
//       });
//       return postCode;
//     },
//     getRoute(addressObj) {
//       var postCode = "";
//       addressObj.results.map((item) => {
//         item.address_components.map((address_component) => {
//           if (address_component.types.includes("route")) {
//             postCode = address_component.long_name;
//           }
//         });
//       });
//       return postCode;
//     },
//     getCountry(addressObj) {
//       var country = "";
//       addressObj.results.map((item) => {
//         item.address_components.map((address_component) => {
//           if (address_component.types.includes("country")) {
//             country = address_component.long_name;
//           }
//         });
//       });
//       return country;
//     },
//     getCity(addressObj) {
//       var country = "";
//       addressObj.results.map((item) => {
//         item.address_components.map((address_component) => {
//           if (address_component.types.includes("locality")) {
//             country = address_component.long_name;
//           }
//         });
//       });
//       return country;
//     },
//     getProvince(addressObj) {
//       var country = "";
//       addressObj.results.map((item) => {
//         item.address_components.map((address_component) => {
//           if (
//             address_component.types.includes("administrative_area_level_2")
//           ) {
//             country = address_component.long_name;
//           }
//         });
//       });
//       return country;
//     },
//     getRadias() {
//       const radiusEl = document.querySelector("#radius-select");
//       var radias = 20000;
//       if (radiusEl) {
//         radias = radiusEl.value;
//       }
//       return radias;
//     },
//     /**
//      * Handler google map goecode error
//      * @param {*} error - Geocode Error object
//      * @return {void}
//      */
//     onGeocodeError(error) {
//       if (this.isTest) {
//         this.onGeocodeSuccess(this.defaultAddress);
//       } else {
//         this.showError(
//           `${error.message} <p>${this.options.errorMessage.USE_DEFAULT}</p>`
//         );
//       }
//     },

//     /**
//      * Handler the getPosition success
//      * @param {GeolocationPositionError} error
//      * @return {void}
//      */
//     showError(error) {
//       if (typeof error === "string") {
//         this.errorElement.innerHTML = error;
//         return;
//       }
//       switch (error.code) {
//         case error.PERMISSION_DENIED:
//           this.errorElement.innerHTML = `${this.options.errorMessage.PERMISSION_DENIED} <p>${this.options.errorMessage.USE_DEFAULT}</p>`;
//           break;
//         case error.POSITION_UNAVAILABLE:
//           this.errorElement.innerHTML = `${this.options.errorMessage.POSITION_UNAVAILABLE} <p>${this.options.errorMessage.USE_DEFAULT}</p>`;
//           break;
//         case error.TIMEOUT:
//           this.errorElement.innerHTML = `${this.options.errorMessage.TIMEOUT} <p>${this.options.errorMessage.USE_DEFAULT}</p>`;
//           break;
//         case error.UNKNOWN_ERROR:
//           this.errorElement.innerHTML = `${this.options.errorMessage.UNKNOWN_ERROR} <p>${this.options.errorMessage.USE_DEFAULT}</p>`;
//           break;
//       }
//     },
//     showLoadLocationBtn() {
//       const btnNode = document.querySelector(
//         this.options.loadLocationBtnSelector
//       );
//       if (btnNode && btnNode.classList) {
//         btnNode.classList.remove(this.hiddenClass);
//       }
//     },
//     hideOptionList() {
//       const optionList = document.querySelector(
//         "[data-location-list-display]"
//       );
//       if (optionList && optionList.classList) {
//         optionList.classList.add(this.hiddenClass);
//       }
//     },
//     hideNoneFound() {
//       const noneFoundNode = document.querySelector(
//         "[data-pickup-options-none-found]"
//       );
//       if (noneFoundNode && noneFoundNode.classList) {
//         noneFoundNode.classList.add(this.hiddenClass);
//       }
//     },
//     showStepFooter() {
//       const node = document.querySelector(".step__footer");
//       if (node && node.classList) {
//         node.classList.remove(this.hiddenClass);
//       }
//     },
//     showAddressOnheader() {
//       if (this.address) {
//         const addressNode = document.querySelectorAll(
//           ".selected-address-text"
//         );
//         if (addressNode) {
//           addressNode.forEach(
//             (node) => (node.innerHTML = this.address.formattedAddress)
//           );
//         }
//       }
//     },
//     manageAddressFinderPlp(flag) {
//       var $el = document.querySelectorAll(this.addressFinderPLPSelector);
//       if ($el) {
//         $el.forEach((node) => {
//           node.classList[flag ? "add" : "remove"]("has-address");
//         });
//       }
//     },
//     hideErrorMessage() {
//       var $el = this.container.querySelector(".error-message");
//       if ($el) {
//         $el.classList.add(this.hiddenClass);
//       }
//     },
//     removeDisabledLPL() {
//       const nodes = document.querySelectorAll("[data-product-sku]");
//       if (nodes) {
//         nodes.forEach((node) => node.classList.remove(this.hiddenClass));
//       }
//     },
//     showCheckInStoreBtn() {
//       const nodes = document.querySelectorAll(
//         "[data-check-in-store-button]"
//       );
//       if (nodes) {
//         nodes.forEach((node) => node.classList.remove(this.hiddenClass));
//       }
//     },
//     addClassToAddressFinder() {
//       var nodes = document.querySelectorAll(".address-finder");
//       var addressWrapper = document.querySelectorAll(".address-wrapper");
//       if (nodes) {
//         nodes.forEach((node) => node.classList.add("has-address"));
//       }
//       if (addressWrapper) {
//         addressWrapper.forEach((node) => node.classList.add("has-address"));
//       }
//     },
//     manageAddressFinderStoreLocator() {
//       var nodes = document.querySelectorAll(
//         "[data-selected-store-wrapper]"
//       );
//       if (nodes) {
//         nodes.forEach((node) => node.classList.remove(this.hiddenClass));
//       }
//     },
//     /**
//      * On click the verify address button
//      * @param {Event} evt
//      */
//     async onVerifyAddress(evt) {
//       this.storeData();
//       if (window.localStorage.address) {
//         if (window.addressFinderModal) {
//           window.addressFinderModal.close();
//         }
//         this.updateOpenModalBtnText();
//         this.showAddressOnContentBox();
//         this.showLoadLocationBtn();
//         this.hideOptionList();
//         this.hideNoneFound();
//         this.hideErrorMessage();
//         this.showStepFooter();
//         this.showAddressOnheader();
//         this.removeDisabledLPL();
//         this.showCheckInStoreBtn();
//         this.addClassToAddressFinder();
//         const isLocatorPage = !!document.querySelector(
//           "[data-address-store-locator]"
//         );
//         const isPLP = !!document.querySelector("[data-address-finder-plp]");
//         const isPDP = !!document.querySelector(".address-finder-pdp");
//         if (window.StoreLocator && isLocatorPage) {
//           await window.StoreLocator.onVerifyAddress();
//         }
//         if (window.addressFinderPDP && isPDP) {
//           window.addressFinderPDP.setAddress();
//           window.addressFinderPDP.resetAll();
//         }
//         if (window.addressFinderPLP && isPLP) {
//           window.addressFinderPLP.setAddress();
//           window.addressFinderPLP.resetAll();
//         }
//       } else {
//         this.showError(
//           `${this.options.errorMessage.EMPTY_ADDRESS} <p>${this.options.errorMessage.USE_DEFAULT}</p>`
//         );
//       }
//     },
//   });
//   return AddressFinder;
// })();