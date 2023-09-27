window.theme = window.theme || {};
theme.StoreLocator = (function () {
  /**
   * Check in store at product detail page
   * @param {*} options - Option object
   * @param {Node} element - the element
   */
  function StoreLocator(options = {}, element) {
    if (!element) {
      return;
    }
    const defaultOptions = {};
    this.element = element;
    this.options = Object.assign(defaultOptions, options);
    this.selectors = {
      SELECTED_FIELD: "[data-selected-store-wrapper]",
      SELECTED_INPUT: "[data-selected-store]",
      MAP: "#map",
      ACTIVE: ".is-active",
      LOCATION_ITEMS: "[data-location-items]",
      LOCATION_ITEM: "[data-location-item]",
      COLUMN_LOCATION: "[data-column-locations]",
      COLUMNS: "[data-columns]",
      OPTION_NONE_FOUND: "[data-pickup-options-none-found]",
    };
    this.activeClass = "is-active";
    this.namespace = "StoreLocator";
    this.defaultFetchData = {
      AffiliateExternalID: window.affiliate_id,
    };
    this.defaulFetchString =
      new URLSearchParams(this.defaultFetchData).toString() +
      "&ProcessingOptions=AllItemsAvailable%3Dfalse%7CDistanceMetric%3D1%7CShowOnlyPickupLocation=true";
    this.baseUrl =
      "https://omniproxy-uat.goldenabc.com/api/endpoints/getproductinventoryaroundlocation/call";
    this.disabledClass = "disabled";
    this.loadingClass = "is-loading";
    this.hiddenClass = "hide";
    this.bangalore = {
      lat: 14.657117,
      lng: 121.006488,
    };
    this.delay = 100;
    this.htmls = {
      LOCATION_ITEM: `<div class="locations__item" data-location-item='%sup%'>
    <div class="locations__item__name">%title%</div>
    <div class="locations__item__address">%address%</div>
    <div class="spacer"></div>
    <div class="location__item__phone">Phone: %phone%</div>
    <div class="locations__items__open-hours">%open_hour%</div>
    <div class="spacer"></div>
    <a href="%direction_link%" class="locations__items__direction-link js-no-transition" target="_blank">Get directions</a>
  </div>`,
    };
    this.init();
  }
  StoreLocator.prototype = Object.assign({}, StoreLocator.prototype, {
    async init() {
      if (google) {
        this.geocoder = new google.maps.Geocoder();
      }
      this.initMap();
      this.address = window.localStorage.getItem("address");
      if (this.address) {
        this.showColumns();
        this.showLoading(true);
        this.allSupplier = await this.getAllSupplier();
        await this.onVerifyAddress();
      }
      this.bindEvents();
      // this.getDistanceAllSupplier();
    },
    getSiblings: (elm) => elm && elm.parentNode && [...elm.parentNode.children].filter(node => node != elm),
    setAddress() {
      this.address = JSON.parse(localStorage.getItem("address"));
    },
    showSelectedStore() {
      var node = this.element.querySelector(this.selectors.SELECTED_FIELD);
      if (node) {
        node.classList.remove(this.hiddenClass);
      }
    },
    hideSelectedStore() {
      var node = this.element.querySelector(this.selectors.SELECTED_FIELD);
      if (node) {
        node.classList.add(this.hiddenClass);
      }
    },
    initMap() {
      var that = this;
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: that.bangalore,
      });
      this.map = map;
      this.marker = new google.maps.Marker({
        map,
      });
    },
    rad: function (x) {
      return (x * Math.PI) / 180;
    },
    bindEvents() {
      var nodes = document.querySelectorAll("[data-location-item]");
      if (nodes) {
        nodes.forEach((node) => {
          node.off("click." + this.namespace);
          node.on("click." + this.namespace, (evt) =>
            this.onClickLocationItem.bind(this, evt)()
          );
        });
      }
    },
    onClickLocationItem(evt) {
      var $el = evt.target;
      var attribute = this.selectors.LOCATION_ITEM.replace(/[\[\]]/g, "");
      if (!$el.hasAttribute(attribute)) {
        $el = evt.target.closest(this.selectors.LOCATION_ITEM);
      }
      if (!$el) {
        return;
      }
      const sup = JSON.parse($el.dataset.locationItem);
      this.element.querySelector(this.selectors.SELECTED_INPUT).value =
        sup.Title;
      this.clearMap();
      const location = {
        lng: Number(sup.Longitude),
        lat: Number(sup.Latitude),
      };
      this.map.setCenter(location);
      this.marker.setPosition(location);
      this.marker.setMap(this.map);
      $el.classList.add(this.activeClass);
      const siblings = this.getSiblings($el);
      if(siblings) {
        siblings.forEach(node => node.classList.remove('is-active'))
      }
    },
    getDistance: function (p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = this.rad(Number(p2.Latitude) - p1.lat());
      var dLong = this.rad(Number(p2.Longitude) - p1.lng());
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.rad(p2.Latitude)) *
          Math.cos(this.rad(p2.Latitude)) *
          Math.sin(dLong / 2) *
          Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    },
    async getAllSupplier() {
      const url =
        "https://omnistorelocations.goldenabc.com/storelocations/Shopify/Api/GetStoreLocations?brand=oxygen";
      const response = await fetch(url);
      const json = await response.json();
      return json.message;
    },
    getSupplierFromResponse(obj) {
      var { Suppliers = {} } = obj;
      var { Supplier = [] } = Suppliers;

      var Supplier = Array.isArray(Supplier) ? Supplier : [Supplier];
      return Supplier;
    },
    async onVerifyAddress() {
      if (localStorage.getItem("address")) {
        const atLocatorPage = !!document.querySelector(
          "[data-address-store-locator]"
        );
        if (atLocatorPage) {
          this.showLoading();
        }
        const address = JSON.parse(localStorage.getItem("address"));

        const radias = address.radias || 20000;
        let res;
        try {
          if (!this.geocoder) {
            this.geocoder = new google.maps.Geocoder();
          }
          res = await this.geocoder.geocode({
            address:
              address.formattedAddress ||
              `${address.barangay}, ${address.city}, ${address.province}, ${address.zip}`,
          });
        } catch (err) {
          if (err.code === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            await theme.sleep(this.delay);
            this.delay += 10;
            await this.onVerifyAddress();
            return;
          } else if (atLocatorPage) {
            console.log("err", err);
            this.hideLoading();
            this.onNoneOptionFound();
            this.hideColumns();
            this.hideSelectedStore();
          }
        }
        if (res) {
          const { results } = res;
          if (!this.allSupplier) {
            this.allSupplier = await this.getAllSupplier();
          }
          this.filteredSuppliers = this.allSupplier.filter((sup) => {
            if (!(sup.Latitude && sup.Longitude)) {
              return;
            }
            const distance = this.getDistance(
              results[0].geometry.location,
              sup
            );
            return distance <= Number(radias);
          });
          if (this.filteredSuppliers.length) {
            document
              .querySelector(this.selectors.OPTION_NONE_FOUND)
              .classList.add(this.hiddenClass);
            this.buildSupplierHTML();
            this.showColumns();
            this.showSelectedStore();
          } else {
            this.onNoneOptionFound();
            this.hideColumns();
            this.hideSelectedStore();
          }
        }
        this.hideLoading(true);
      } else {
        this.onNoneOptionFound();
        this.hideColumns();
        this.hideSelectedStore(true);
      }
    },
    hideColumns() {
      document
        .querySelector(this.selectors.COLUMNS)
        .classList.add(this.hiddenClass);
    },
    showColumns() {
      document
        .querySelector(this.selectors.COLUMNS)
        .classList.remove(this.hiddenClass);
    },
    showLoading() {
      var node = document.querySelector(this.selectors.COLUMN_LOCATION);
      var columnsNode = document.querySelector(this.selectors.COLUMNS);
      if (columnsNode) {
        columnsNode.classList.remove(this.hiddenClass);
      }
      if (node) {
        node.classList.add(this.loadingClass);
      }
    },
    hideLoading() {
      var node = document.querySelector(this.selectors.COLUMN_LOCATION);
      if (node) {
        node.classList.remove(this.loadingClass);
      }
    },
    onNoneOptionFound() {
      document
        .querySelector(this.selectors.OPTION_NONE_FOUND)
        .classList.remove(this.hiddenClass);
    },
    getDirectionLink(sup = {}) {
      return `https://maps.google.com?saddr=Current+Location&daddr=${this.renderProp(
        sup.Street
      )}+${this.renderProp(sup.City)}+${this.renderProp(
        sup.Province
      )}+${this.renderProp(sup.Zipcode)}`;
    },
    renderAddress(val) {
      return val && val !== "null" ? val + ", " : "";
    },
    renderProp(val) {
      return val || "";
    },
    buildSupplierHTML() {
      var html = this.filteredSuppliers.reduce((curr, sup) => {
        let address =
          this.renderAddress(sup.Street) +
            this.renderAddress(sup.City) +
            this.renderAddress(sup.Province) +
            this.renderAddress(sup.Zipcode) || "";
        address = address.trim().slice(-1) === "," ? address.trim().slice(0, -1) : address;
        return (
          curr +
          this.htmls.LOCATION_ITEM.replace(
            /%title%/g,
            this.renderProp(sup.Title)
          )
            .replace(/%sup%/g, JSON.stringify(sup))
            .replace(/%address%/g, address)
            .replace(/%phone%/g, this.renderProp(sup.PhoneNumber))
            .replace(/%direction_link%/g, this.getDirectionLink(sup))
            .replace(/%open_hour%/g, this.renderProp(sup.OpeningHours))
        );
      }, "");
      document.querySelector("[data-location-items]").innerHTML = html;
      document.querySelector("[data-locations-total]").innerHTML =
        this.filteredSuppliers.length;
      this.bindEvents();
    },
    clearMap() {
      this.marker.setMap(null);
      let nodes = this.element.querySelectorAll(this.selectors.ACTIVE);
      if (nodes) {
        nodes.forEach((node) => node.classList.remove(this.activeClass));
      }
    },
    geocode(request) {
      this.geocoder.geocode(request).then((result) => {
        const { results } = result;
      });
    },
  });
  return StoreLocator;
})();
theme.DOMready(function () {
  if (typeof google !== undefined) {
    window.StoreLocator = new theme.StoreLocator(
      {},
      document.querySelector("[data-address-store-locator]")
    );
  }
});