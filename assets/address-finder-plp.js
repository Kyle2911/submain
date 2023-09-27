// window.theme = window.theme || {};
// theme.AddressFinderPLP = (function () {
//   /**
//    * Check in store at product detail page
//    * @param {*} options - Option object
//    * @param {Node} element - the element
//    */
//   function AddressFinderPLP(options = {}, element) {
//     if (!element) {
//       return;
//     }
//     const defaultOptions = {};
//     this.element = element;
//     this.options = Object.assign(defaultOptions, options);
//     this.selectors = {
//       SHOW_STORE_BTN: "[data-check-in-store-button]",
//       SELECT: "[data-store-filter]",
//       SELECT_WRAPPER: "[data-store-filter-wrapper]",
//     };
//     this.namespace = "AddressFinderPLP";
//     this.defaultFetchData = {
//       AffiliateExternalID: window.affiliate_id,
//     };
//     this.defaulFetchString =
//       new URLSearchParams(this.defaultFetchData).toString() +
//       "&ProcessingOptions=AllItemsAvailable%3Dfalse%7CDistanceMetric%3D1%7CShowOnlyPickupLocation=true";
//     this.baseUrl =
//       "https://omniproxy-uat.goldenabc.com/api/endpoints/getproductinventoryaroundlocation/call";

//     this.selectFilterPlaceholder = `<option value="">${this.element.dataset.selectPlaceholder}</option>`;
//     this.html = {
//       selectOption: '<option value="%value%">%title%</option>',
//     };
//     this.disabledClass = "disabled";
//     this.hiddenClass = "hide";
//     this.init();
//   }
//   AddressFinderPLP.prototype = Object.assign(
//     {},
//     AddressFinderPLP.prototype,
//     {
//       async init() {
//         this.allSupplier = (await this.getAllSupplier()) || [];
//         this.bindEvents();
//         this.address = window.localStorage.getItem("address");
//         var buttonNode = document.querySelector(
//           this.selectors.SHOW_STORE_BTN
//         );
//         const selectFilterOptions =
//           window.localStorage.getItem("filterHTML");
//         if (window.localStorage.getItem("address")) {
//           this.inventories = await this.getInventoryByLocation();
//         } else {
//           this.inventories = [];
//         }
//         const selectedFilterOption =
//           window.localStorage.getItem("selectedFilter") || "";
//         if (this.address && !selectFilterOptions) {
//           if (buttonNode) {
//             buttonNode.classList.remove(this.hiddenClass);
//           }
//         }
//         if (selectFilterOptions && this.inventories.length && this.address ) {
//           var selectEl = this.element.querySelector(this.selectors.SELECT);
//           selectEl
//             .querySelectorAll("option")
//             .forEach((node) => node.remove());
//           selectEl.innerHTML = selectFilterOptions;
//           selectEl.value = selectedFilterOption;
//           selectEl.dispatchEvent(new Event("change"));
//           this.showFilterSelect();
//         }
//       },
//       setAddress() {
//         this.address = JSON.parse(localStorage.getItem("address"));
//       },
//       resetAll() {
//         window.localStorage.setItem("filterHTML", "");
//         const selectWrapper = document.querySelector(
//           this.selectors.SELECT_WRAPPER
//         );
//         if (selectWrapper) {
//           selectWrapper.classList.add(this.hiddenClass);
//         }
//       },
//       async getAllSupplier() {
//         const url =
//         "https://omnistorelocations.goldenabc.com/storelocations/Shopify/Api/GetStoreLocations?brand=penshoppe";
//         const response = await fetch(url);
//         const json = await response.json();
//         return json.message;
//       },
//       bindEvents() {
//         var showStoreButton = this.element.querySelector(
//           this.selectors.SHOW_STORE_BTN
//         );
//         var selectFilter = this.element.querySelector(
//           this.selectors.SELECT
//         );
//         if (showStoreButton) {
//           showStoreButton.off(`click.${this.namespace}`);
//           showStoreButton.on(
//             `click.${this.namespace}`,
//             async () => await this.onClickButtonShowStore.bind(this)()
//           );
//         }
//         if (selectFilter) {
//           selectFilter.off(`change.${this.namespace}`);
//           selectFilter.on(`change.${this.namespace}`, (evt) =>
//             this.onSelectFilter.bind(this, evt)()
//           );
//         }
//       },
//       onSelectFilter(evt) {
//         var value = evt.currentTarget.value;
//         var gridItems = document.querySelectorAll("[data-product-sku]");
//         if (!value) {
//           gridItems.forEach((node) =>
//             node.classList.remove(this.disabledClass)
//           );
//         } else {
//           if (gridItems) {
//             gridItems.forEach((node) =>
//               node.classList.add(this.disabledClass)
//             );
//           }
//           var selectedInventories = this.inventories.find(
//             (inv) => inv.SupplierFullName === value
//           );
//           const products = this.getProducts(selectedInventories);
//           products.map((prod = {}) => {
//             const node = document.querySelector(
//               `[data-product-sku="${prod.ProductPartNo}"]`
//             );
//             if (node) {
//               node.classList.remove(this.disabledClass);
//             }
//           });
//         }
//         window.localStorage.setItem(
//           "selectedFilter",
//           $(evt.currentTarget).val() || ""
//         );
//       },
//       getProducts(inventory = {}) {
//         var { Products } = inventory;
//         var { Product } = Products;
//         if (!Array.isArray(Product)) {
//           Product = [Product];
//         }
//         return Product;
//       },
//       hideButtonShowStore() {
//         this.element
//           .querySelector(this.selectors.SHOW_STORE_BTN)
//           .classList.add(this.hiddenClass);
//       },
//       async onClickButtonShowStore() {
//         this.hideButtonShowStore();
//         if (!this.inventories.length) {
//           this.inventories = await this.getInventoryByLocation();
//         }
//         this.mapInventoryName();
//         var selectFilterOptions = this.buildFilterHtml();
//         var selectEl = this.element.querySelector(this.selectors.SELECT);
//         selectEl
//           .querySelectorAll("option")
//           .forEach((node) => node.remove());
//         selectEl.innerHTML = selectFilterOptions;
//         window.localStorage.setItem("filterHTML", selectFilterOptions);
//         this.showFilterSelect();
//       },
//       showFilterSelect() {
//         var selectFilterWrapper = this.element.querySelector(
//           this.selectors.SELECT_WRAPPER
//         );
//         if (selectFilterWrapper) {
//           selectFilterWrapper.classList.remove(this.hiddenClass);
//         }
//       },
//       buildFilterHtml() {
//         return this.inventories.reduce((prev, curr) => {
//           return (
//             prev +
//             this.html.selectOption
//               .replace(/%value%/g, curr.SupplierFullName)
//               .replace(/%title%/g, curr.SupplierCompanyName)
//           );
//         }, this.selectFilterPlaceholder);
//       },
//       mapInventoryName() {
//         if (this.inventories) {
//           this.inventories = this.inventories.map((inventory) => {
//             const foundSupplier = this.allSupplier.find((sup) => {
//               return sup.siteId === Number(inventory.SupplierFullName);
//             });
//             return {
//               ...inventory,
//               SupplierCompanyName: foundSupplier ? foundSupplier.Title : '',
//             };
//           });
//         }
//       },
//       buildProductParams() {
//         const localArray = window.collectionProducts
//           ? window.collectionProducts.join(" | 1,") + " | 1"
//           : "";
//         return `PartnoOrOptionValueAndQty=${encodeURIComponent(
//           localArray
//         )}`;
//       },
//       getInventoryFromResponse(obj) {
//         var { ProductSuppliers = {} } = obj;
//         var { ProductSupplier = [] } = ProductSuppliers;

//         var ProductSupplier = Array.isArray(ProductSupplier)
//           ? ProductSupplier
//           : [ProductSupplier];
//         return ProductSupplier;
//       },
//       getSupplierFromResponse(obj) {
//         var { Suppliers = {} } = obj;
//         var { Supplier = [] } = Suppliers;

//         var Supplier = Array.isArray(Supplier) ? Supplier : [Supplier];
//         return Supplier;
//       },
//       /**
//        * Build the location parameters
//        */
//       buildUrlFromLocation() {
//         const address = JSON.parse(window.localStorage.getItem("address"));
//         return `SourcePostalCode=${
//           address.postcode || address.zip
//         }&SourceCountry=${address.country || "Philippines"}&SearchRadias=${
//           address.radias || 20000
//         }`;
//       },
//       /**
//        * Async Get the inventory
//        * @property {string} geocode
//        * @return {Promise}
//        */
//       async getInventoryByLocation() {
//         const productOptionStr = this.buildProductParams();
//         const locationStr = this.buildUrlFromLocation();
//         const url = `${this.baseUrl}?${this.defaulFetchString}&${productOptionStr}&${locationStr}`;
//         const response = await fetch(url);
//         const text = await response.text();
//         var xmlText = text;
//         var x2js = new X2JS();
//         var jsonObj = x2js.xml_str2json(xmlText);
//         var suppliers = this.getInventoryFromResponse(jsonObj || {});
//         return suppliers;
//       },
//     }
//   );
//   return AddressFinderPLP;
// })();
// theme.DOMready(function() {
//   window.addressFinderPLP = new theme.AddressFinderPLP(
//     {},
//     document.querySelector("[data-address-finder-plp]")
//   );
// })