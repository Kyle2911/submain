export const Theme = () => {
  window.theme = window.theme || {};
  theme.delegate = {
    on: function (event, callback, options) {
      if (!this.namespaces)
        // save the namespaces on the DOM element itself
        this.namespaces = {};

      this.namespaces[event] = callback;
      options = options || false;

      this.addEventListener(event.split(".")[0], callback, options);
      return this;
    },
    off: function (event) {
      if (!this.namespaces) {
        return;
      }
      this.removeEventListener(event.split(".")[0], this.namespaces[event]);
      delete this.namespaces[event];
      return this;
    },
  };
  window.on = Element.prototype.on = theme.delegate.on;
  window.off = Element.prototype.off = theme.delegate.off;
  theme.utils = {
    defaultTo: function (value, defaultValue) {
      return value == null || value !== value ? defaultValue : value;
    },

    wrap: function (el, wrapper) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    },

    debounce: function (wait, callback, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) callback.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) callback.apply(context, args);
      };
    },

    throttle: function (limit, callback) {
      var waiting = false;
      return function () {
        if (!waiting) {
          callback.apply(this, arguments);
          waiting = true;
          setTimeout(function () {
            waiting = false;
          }, limit);
        }
      };
    },

    prepareTransition: function (el, callback) {
      el.addEventListener("transitionend", removeClass);

      function removeClass(evt) {
        el.classList.remove("is-transitioning");
        el.removeEventListener("transitionend", removeClass);
      }

      el.classList.add("is-transitioning");
      el.offsetWidth; // check offsetWidth to force the style rendering

      if (typeof callback === "function") {
        callback();
      }
    },

    // _.compact from lodash
    // Creates an array with all falsey values removed. The values `false`, `null`,
    // `0`, `""`, `undefined`, and `NaN` are falsey.
    // _.compact([0, 1, false, 2, '', 3]);
    // => [1, 2, 3]
    compact: function (array) {
      var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    },

    serialize: function (form) {
      var arr = [];
      Array.prototype.slice.call(form.elements).forEach(function (field) {
        if (
          !field.name ||
          field.disabled ||
          ["file", "reset", "submit", "button"].indexOf(field.type) > -1
        )
          return;
        if (field.type === "select-multiple") {
          Array.prototype.slice.call(field.options).forEach(function (option) {
            if (!option.selected) return;
            arr.push(
              encodeURIComponent(field.name) +
                "=" +
                encodeURIComponent(option.value)
            );
          });
          return;
        }
        if (["checkbox", "radio"].indexOf(field.type) > -1 && !field.checked)
          return;
        arr.push(
          encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value)
        );
      });
      return arr.join("&");
    },
  };

  theme.a11y = {
    trapFocus: function (options) {
      var eventsName = {
        focusin: options.namespace ? "focusin." + options.namespace : "focusin",
        focusout: options.namespace
          ? "focusout." + options.namespace
          : "focusout",
        keydown: options.namespace
          ? "keydown." + options.namespace
          : "keydown.handleFocus",
      };

      // Get every possible visible focusable element
      var focusableEls = options.container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      );
      var elArray = [].slice.call(focusableEls);
      var focusableElements = elArray.filter((el) => el.offsetParent !== null);

      var firstFocusable = focusableElements[0];
      var lastFocusable = focusableElements[focusableElements.length - 1];

      if (!options.elementToFocus) {
        options.elementToFocus = options.container;
      }

      options.container.setAttribute("tabindex", "-1");
      options.elementToFocus.focus();

      document.documentElement.off("focusin");
      document.documentElement.on(eventsName.focusout, function () {
        document.documentElement.off(eventsName.keydown);
      });

      document.documentElement.on(eventsName.focusin, function (evt) {
        if (evt.target !== lastFocusable && evt.target !== firstFocusable)
          return;

        document.documentElement.on(eventsName.keydown, function (evt) {
          _manageFocus(evt);
        });
      });

      function _manageFocus(evt) {
        if (evt.keyCode !== 9) return;
        /**
         * On the first focusable element and tab backward,
         * focus the last element
         */
        if (evt.target === firstFocusable && evt.shiftKey) {
          evt.preventDefault();
          lastFocusable.focus();
        }
      }
    },
    removeTrapFocus: function (options) {
      var eventName = options.namespace
        ? "focusin." + options.namespace
        : "focusin";

      if (options.container) {
        options.container.removeAttribute("tabindex");
      }

      document.documentElement.off(eventName);
    },

    lockMobileScrolling: function (namespace, element) {
      var el = element ? element : document.documentElement;
      document.documentElement.classList.add("lock-scroll");
      el.on("touchmove" + namespace, function () {
        return true;
      });
    },

    unlockMobileScrolling: function (namespace, element) {
      document.documentElement.classList.remove("lock-scroll");
      var el = element ? element : document.documentElement;
      el.off("touchmove" + namespace);
    },
  };
  theme.Modals = (function () {
    function Modal(id, name, options) {
      var defaults = {
        close: ".js-modal-close",
        open: ".js-modal-open-" + name,
        openClass: "modal--is-active",
        closingClass: "modal--is-closing",
        bodyOpenClass: "modal-open",
        bodyOpenSolidClass: "modal-open--solid",
        bodyClosingClass: "modal-closing",
        closeOffContentClick: true,
      };

      this.id = id;
      this.modal = document.getElementById(id);

      if (!this.modal) {
        return false;
      }

      this.modalContent = this.modal.querySelector(".modal__inner");

      this.config = Object.assign(defaults, options);
      this.modalIsOpen = false;
      this.focusOnOpen = this.config.focusIdOnOpen
        ? document.getElementById(this.config.focusIdOnOpen)
        : this.modal;
      this.isSolid = this.config.solid;

      this.init();
    }

    Modal.prototype.init = function () {
      document.querySelectorAll(this.config.open).forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        btn.addEventListener("click", this.open.bind(this));
      });

      this.modal.querySelectorAll(this.config.close).forEach((btn) => {
        btn.addEventListener("click", this.close.bind(this));
      });

      // Close modal if a drawer is opened
      document.addEventListener(
        "drawerOpen",
        function () {
          this.close();
        }.bind(this)
      );
    };

    Modal.prototype.open = function (evt) {
      // Keep track if modal was opened from a click, or called by another function
      var externalCall = false;

      // don't open an opened modal
      if (this.modalIsOpen) {
        return;
      }

      // Prevent following href if link is clicked
      if (evt) {
        evt.preventDefault();
      } else {
        externalCall = true;
      }

      // Without this, the modal opens, the click event bubbles up to $nodes.page
      // which closes the modal.
      if (evt && evt.stopPropagation) {
        evt.stopPropagation();
        // save the source of the click, we'll focus to this on close
        this.activeSource = evt.currentTarget.setAttribute(
          "aria-expanded",
          "true"
        );
      }

      if (this.modalIsOpen && !externalCall) {
        this.close();
      }

      this.modal.classList.add(this.config.openClass);

      document.documentElement.classList.add(this.config.bodyOpenClass);

      if (this.isSolid) {
        document.documentElement.classList.add(this.config.bodyOpenSolidClass);
      }

      this.modalIsOpen = true;

      theme.a11y.trapFocus({
        container: this.modal,
        elementToFocus: this.focusOnOpen,
        namespace: "modal_focus",
      });

      document.dispatchEvent(new CustomEvent("modalOpen"));
      document.dispatchEvent(new CustomEvent("modalOpen." + this.id));

      this.bindEvents();
    };

    Modal.prototype.close = function (evt) {
      // don't close a closed modal
      if (!this.modalIsOpen) {
        return;
      }

      // Do not close modal if click happens inside modal content
      if (evt) {
        if (evt.target.closest(".js-modal-close")) {
          // Do not close if using the modal close button
        } else if (evt.target.closest(".modal__inner")) {
          return;
        }
      }

      // deselect any focused form elements
      document.activeElement.blur();

      this.modal.classList.remove(this.config.openClass);
      this.modal.classList.add(this.config.closingClass);

      document.documentElement.classList.remove(this.config.bodyOpenClass);
      document.documentElement.classList.add(this.config.bodyClosingClass);

      window.setTimeout(
        function () {
          document.documentElement.classList.remove(
            this.config.bodyClosingClass
          );
          this.modal.classList.remove(this.config.closingClass);
          if (
            this.activeSource &&
            this.activeSource.getAttribute("aria-expanded")
          ) {
            this.activeSource.setAttribute("aria-expanded", "false").focus();
          }
        }.bind(this),
        500
      ); // modal close css transition

      if (this.isSolid) {
        document.documentElement.classList.remove(
          this.config.bodyOpenSolidClass
        );
      }

      this.modalIsOpen = false;

      theme.a11y.removeTrapFocus({
        container: this.modal,
        namespace: "modal_focus",
      });

      document.dispatchEvent(new CustomEvent("modalClose." + this.id));

      this.unbindEvents();
    };

    Modal.prototype.bindEvents = function () {
      window.on(
        "keyup.modal",
        function (evt) {
          if (evt.keyCode === 27) {
            this.close();
          }
        }.bind(this)
      );

      if (this.config.closeOffContentClick) {
        // Clicking outside of the modal content also closes it
        this.modal.on("click.modal", this.close.bind(this));
      }
    };

    Modal.prototype.unbindEvents = function () {
      document.documentElement.off(".modal");

      if (this.config.closeOffContentClick) {
        this.modal.off(".modal");
      }
    };

    return Modal;
  })();
  /**
   * Tab
   */
  theme.tab = (function () {
    var selectors = {
      trigger: ".tab-trigger",
      content: ".tab-content",
    };
    var classes = {
      hide: "hide",
      active: "is-active",
    };
    var namespace = ".tab";
    function init(scope) {
      var el = scope ? scope : document;
      el.querySelectorAll(selectors.trigger).forEach((trigger) => {
        var state = trigger.classList.contains(classes.open);
        trigger.setAttribute("aria-expanded", state);

        trigger.off("click" + namespace);
        trigger.on("click" + namespace, toggle);
      });
    }
    /**
     * Toggle the tab
     * @param {EventListenerOrEventListenerObject} event - Event object
     * @returns {void}
     */
    function toggle(event) {
      var el = event.currentTarget;
      var /** @type {string} */ moduleId = el.getAttribute("aria-controls");
      var /** @type {Node} */ container = document.getElementById(moduleId);
      var /** @type {boolean} */ isActive = el.classList.contains(
          classes.active
        );
      var /** @type {NodeList} */ siblingsEl = document.querySelectorAll(
          `${selectors.trigger}[data-id="${el.dataset.id}"]`
        );
      if (!moduleId || isActive) {
        return;
      }
      var newModule;
      siblingsEl.forEach((_el) => {
        newModule = document.querySelector(
          "#" + _el.getAttribute("aria-controls")
        );
        _el.classList.remove(classes.active);
        if (newModule) {
          newModule.classList.remove(classes.active);
        }
      });

      el.classList.add(classes.active);
      container.classList.add(classes.active);
    }
    return {
      init,
    };
  })();
  theme.AddressFinder = (function () {
    /**
     * Address Finder plugin
     * @param {object} options - the plugin options
     * @param { string | undefined } options.errorElSelector - the error element selector
     * @param { object | undefined} options.errorMessage - the error messages
     * @param { string | undefined} options.errorMessage.PERMISSION_DENIED - the message when PERMISSION_DENIED
     * @param { string | undefined} options.errorMessage.POSITION_UNAVAILABLE - the message when POSITION_UNAVAILABLE
     * @param { string | undefined} options.errorMessage.TIMEOUT - the message when TIMEOUT
     * @param { string | undefined} options.errorMessage.UNKNOWN_ERROR - the message when there is UNKNOWN_ERROR
     */
    function AddressFinder(options = {}, id) {
      this.namespace = ".address-finder";
      this.selectors = {
        btn: "[data-locate-button]",
        container: ".address-finder-container",
        closeBtn: "[data-close-modal-btn]",
      };
      this.default = {
        errorMessage: {
          PERMISSION_DENIED: "User denied the request for Geolocation.",
          POSITION_UNAVAILABLE: "Location information is unavailable.",
          TIMEOUT: "The request to get user location timed out.",
          UNKNOWN_ERROR: "An unknown error occurred.",
          EMPTY_ADDRESS: "Can not find your address.",
          USE_DEFAULT: "Please use the address finder form.",
        },
        errorSelector: ".error-message",
        addressSelector: "[data-address-finder-text]",
        modalOpenBtnSelector: "[data-address-finder-open-btn]",
        editBtnText: "Edit your location?",
        loadLocationBtnSelector: "[data-load-location-btn]",
      };
      this.options = Object.assign({}, this.default, options);
      this.addressFinderPLPSelector = "[data-address-finder-plp]";
      if(typeof google !== 'undefined') {
        this.geocode = new google.maps.Geocoder();
      }
      this.addressElement = document.querySelectorAll(
        this.options.addressSelector
      );
      this.container = document.getElementById(id) || document;
      this.closeBtns = this.container.querySelectorAll(this.selectors.closeBtn);
      this.defaultAddress = {
        "results": [
          {
            "address_components": [
              {
                "long_name": "20",
                "short_name": "20",
                "types": [
                  "street_number"
                ]
              },
              {
                "long_name": "Emilio Jacinto",
                "short_name": "Emilio Jacinto",
                "types": [
                  "route"
                ]
              },
              {
                "long_name": "Matandang Balara",
                "short_name": "Brgy. Matandang Balara",
                "types": [
                  "political",
                  "sublocality",
                  "sublocality_level_1"
                ]
              },
              {
                "long_name": "Quezon City",
                "short_name": "QC",
                "types": [
                  "locality",
                  "political"
                ]
              },
              {
                "long_name": "Metro Manila",
                "short_name": "NCR",
                "types": [
                  "administrative_area_level_1",
                  "political"
                ]
              },
              {
                "long_name": "Philippines",
                "short_name": "PH",
                "types": [
                  "country",
                  "political"
                ]
              },
              {
                "long_name": "1126",
                "short_name": "1126",
                "types": [
                  "postal_code"
                ]
              }
            ],
            "formatted_address": "20 Emilio Jacinto, Matandang Balara, Quezon City, 1126 Metro Manila, Philippines",
            "geometry": {
              "bounds": {
                "south": 14.6668199,
                "west": 121.0904255,
                "north": 14.6670672,
                "east": 121.0907342
              },
              "location": {
                "lat": 14.6669415,
                "lng": 121.0905867
              },
              "location_type": "ROOFTOP",
              "viewport": {
                "south": 14.6655945697085,
                "west": 121.0892704197085,
                "north": 14.66829253029151,
                "east": 121.0919683802915
              }
            },
            "partial_match": true,
            "place_id": "ChIJ78vGVOW5lzMRNS4POUuw_9I",
            "types": [
              "premise"
            ]
          }
        ]
      };
      this.loaddingClass = "btn--loading";
      this.disabledClass = "disabled";
      this.isTest = this.container.dataset.testMode === "true";
      // this.isTest = true;
      this.hiddenClass = "hidden";
      this.init();
    }
    AddressFinder.prototype = Object.assign({}, AddressFinder.prototype, {
      init: function () {
        var that = this;
        var container = this.container || document;
        this.errorElement = container.querySelector(this.options.errorSelector);
        this.btns = document.querySelectorAll(this.selectors.btn);
        if (this.btns) {
          this.btns.forEach((btn) => {
            btn.off("click" + this.namespace);
            btn.on("click" + this.namespace, (evt) =>
              this.getLocation.bind(this, evt)()
            );
          });
        }
        if (this.closeBtns) {
          this.closeBtns.forEach((btn) => {
            btn.off("click" + this.namespace);
            btn.on(
              "click" + this.namespace,
              async (evt) => await this.onVerifyAddress.bind(this, evt)()
            );
          });
        }
        this.loadData();
      },
      getLocation: function (evt) {
        let $element = evt.target;
        if (!$element.classList.contains("btn")) {
          $element = evt.target.closest(".btn");
        }
        $element.classList.add(this.loaddingClass);
        $element.classList.add(this.disabledClass);
        if (this.isTest) {
          this.onGeocodeSuccess(this.defaultAddress);
          $element.classList.remove(this.loaddingClass);
          $element.classList.remove(this.disabledClass);
          return;
        } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                this.onGetLocationSuccessfully.bind(this, position)();
              },
              (error) => {
                this.showError.bind(this, error)();
                this.removeLoadingClass();
              }
            );
          } else {
            alert("Geolocation is not supported by this browser.");
          }
        }
      },
      showAddress() {
        if (this.address.formattedAddress) {
          var addressNodes = document.querySelectorAll(
            this.options.addressSelector
          );
          var openModelBtnNodes = document.querySelectorAll(
            this.options.modalOpenBtnSelector
          );
          if (addressNodes) {
            addressNodes.forEach(
              (node) => (node.innerHTML = this.address.formattedAddress)
            );
          }
          if (openModelBtnNodes) {
            openModelBtnNodes.forEach(
              (node) => (node.innerHTML = this.options.editBtnText)
            );
          }
        }
      },
      /**
       * Load the location from session storate
       * @return {void}
       */
      loadData() {
        if (window.sessionStorage) {
          const address = JSON.parse(window.localStorage.getItem("address"));
          if (address) {
            this.address = address;
            this.showAddressOnModal();
            this.showAddressOnContentBox();
            this.updateOpenModalBtnText();
            this.showAddress();
            this.addClassToAddressFinder();
            if(address.radias) {
              this.reflectRadias(address.radias);
            }
            this.reflectProvince(address.prov_id, address.province);

          }
        }
      },
      /** Reflect stored radius to the select */
      reflectRadias(radias) {
        const radiusSelect = document.getElementById('radius');
        if(radiusSelect) {
          radiusSelect.value = radias;
        }
      },
      reflectProvince(province, proName) {
        const $province = document.getElementById('province');
        const $options = $province.querySelectorAll('option');
        const selectedOption = Array.from($options).find(opt => String(opt.text).toUpperCase() === String(proName).toUpperCase());
        if($province) {
          $province.value = province;
          if($province.selectedIndex === -1) {
            $province.value = selectedOption.value;
          }
          $province.dispatchEvent(new Event('change'));
        }
      },
      getSelectedOption() {

      },
      removeLoadingClass() {
        const $element = document.querySelector(".btn--loading");
        $element.classList.remove(this.loaddingClass);
        $element.classList.remove(this.disabledClass);
      },
      /**
       * Handler the getPosition success
       * @param {GeolocationPosition} position
       * @return {void}
       */
      onGetLocationSuccessfully(position = {}) {
        const { coords } = position;
        const latlng = {
          lat: parseFloat(coords.latitude),
          lng: parseFloat(coords.longitude),
        };
        this.geocode
          .geocode({ location: latlng })
          .then((res) => {
            this.removeLoadingClass();
            const postcode = this.getPostCode(res);
            if (!(res.results && postcode)) {
              this.showError(
                `${this.options.errorMessage.EMPTY_ADDRESS} <p>${this.options.errorMessage.USE_DEFAULT}</p>`
              );
              return;
            }
            this.onGeocodeSuccess(res);
          })
          .catch((err) => {
            this.onGeocodeError(err);
            this.removeLoadingClass();
          });
      },
      /**
       * On google map geocode success
       * @param {object} res - the success result from google map geocode api
       * @return {void}
       */
      onGeocodeSuccess(res = {}) {
        var postcode = this.getPostCode(res);
        var country = this.getCountry(res);
        var radias = this.getRadias();
        var city = this.getCity(res);
        var province = this.getProvince(res);
        var streetNumber = this.getStreetNumber(res) || '';
        var route = this.getRoute(res) || '';
        var address = {
          formattedAddress: res.results[0].formatted_address,
          country,
          postcode,
          radias,
          city,
          address_name: (streetNumber ? streetNumber : '') + (route ? `, ${route}` : ''),
          province,
        };
        if (address) {
          this.address = address;
        }
        this.showAddressOnModal();
        if (this.closeBtns) {
          this.closeBtns.forEach((btn) => btn.classList.remove("disabled"));
        }
      },

      updateOpenModalBtnText() {
        const nodes = document.querySelectorAll(
          this.options.modalOpenBtnSelector
        );
        if (nodes) {
          nodes.forEach((node) => (node.innerHTML = this.options.editBtnText));
        }
      },
      /**
       * Show found address on modal
       * @return {void}
       */
      showAddressOnModal() {
        const $element = this.container;
        if (this.address) {
          const addressNode = $element.querySelectorAll(
            this.options.addressSelector
          );
          if (addressNode) {
            addressNode.forEach(
              (node) => (node.innerHTML = this.address.formattedAddress)
            );
          }
        }
      },
      showAddressOnContentBox() {
        if (this.address) {
          const addressNode = document.querySelector(
            ".address-finder-box " + this.options.addressSelector
          );
          if (addressNode) {
            addressNode.innerHTML = this.address.formattedAddress;
          }
        }
      },
      /**
       * Save the found addresss to sesstion storage
       */
      storeData() {
        if (window.sessionStorage && this.address) {
          window.localStorage.setItem("address", JSON.stringify(this.address));
        }
      },
      /**
       * Get PostCode
       * @param {*} addressObj - the address object
       * @return {string}
       */
      getPostCode(addressObj) {
        var postCode = "";
        addressObj.results.map((item) => {
          item.address_components.map((address_component) => {
            if (address_component.types.includes("postal_code")) {
              postCode = address_component.long_name;
            }
          });
        });
        return postCode;
      },
      getCountry(addressObj) {
        var country = "";
        addressObj.results.map((item) => {
          item.address_components.map((address_component) => {
            if (address_component.types.includes("country")) {
              country = address_component.long_name;
            }
          });
        });
        return country;
      },
      getStreetNumber(addressObj) {
        var postCode = "";
        addressObj.results.map((item) => {
          item.address_components.map((address_component) => {
            if (address_component.types.includes("street_number")) {
              postCode = address_component.long_name;
            }
          });
        });
        return postCode;
      },
      getRoute(addressObj) {
        var postCode = "";
        addressObj.results.map((item) => {
          item.address_components.map((address_component) => {
            if (address_component.types.includes("route")) {
              postCode = address_component.long_name;
            }
          });
        });
        return postCode;
      },
      getCity(addressObj) {
        var country = "";
        addressObj.results.map((item) => {
          item.address_components.map((address_component) => {
            if (address_component.types.includes("locality")) {
              country = address_component.long_name;
            }
          });
        });
        return country;
      },
      getProvince(addressObj) {
        var country = "";
        addressObj.results.map((item) => {
          item.address_components.map((address_component) => {
            if (
              address_component.types.includes("administrative_area_level_2")
            ) {
              country = address_component.long_name;
            }
          });
        });
        return country;
      },
      getRadias() {
        const radiusEl = this.container.querySelectorAll(".radius-select");
        var radias = 20000;
        if (radiusEl) {
          radiusEl.forEach((node) => {
            if (node.offsetParent !== null) radias = node.value;
          });
        }
        return radias;
      },
      /**
       * Handler google map goecode error
       * @param {*} error - Geocode Error object
       * @return {void}
       */
      onGeocodeError(error) {
        if (this.isTest) {
          this.onGeocodeSuccess(this.defaultAddress);
        } else {
          this.showError(
            `${error.message} <p>${this.options.errorMessage.USE_DEFAULT}</p>`
          );
        }
      },

      /**
       * Handler the getPosition success
       * @param {GeolocationPositionError} error
       * @return {void}
       */
      showError(error) {
        if (typeof error === "string") {
          this.errorElement.innerHTML = error;
          return;
        }
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.errorElement.innerHTML = `${this.options.errorMessage.PERMISSION_DENIED} <p>${this.options.errorMessage.USE_DEFAULT}</p>`;
            break;
          case error.POSITION_UNAVAILABLE:
            this.errorElement.innerHTML = `${this.options.errorMessage.POSITION_UNAVAILABLE} <p>${this.options.errorMessage.USE_DEFAULT}</p>`;
            break;
          case error.TIMEOUT:
            this.errorElement.innerHTML = `${this.options.errorMessage.TIMEOUT} <p>${this.options.errorMessage.USE_DEFAULT}</p>`;
            break;
          case error.UNKNOWN_ERROR:
            this.errorElement.innerHTML = `${this.options.errorMessage.UNKNOWN_ERROR} <p>${this.options.errorMessage.USE_DEFAULT}</p>`;
            break;
        }
      },
      showLoadLocationBtn() {
        const btnNode = document.querySelector(
          this.options.loadLocationBtnSelector
        );
        if (btnNode && btnNode.classList) {
          btnNode.classList.remove(this.hiddenClass);
        }
      },
      hideOptionList() {
        const optionList = document.querySelector(
          "[data-location-list-display]"
        );
        if (optionList && optionList.classList) {
          optionList.classList.add(this.hiddenClass);
        }
      },
      hideNoneFound() {
        const noneFoundNode = document.querySelector(
          "[data-pickup-options-none-found]"
        );
        if (noneFoundNode && noneFoundNode.classList) {
          noneFoundNode.classList.add(this.hiddenClass);
        }
      },
      showStepFooter() {
        const node = document.querySelector(".step__footer");
        if (node && node.classList) {
          node.classList.remove(this.hiddenClass);
          node.classList.remove("hidden");
        }
      },
      showAddressOnheader() {
        if (this.address) {
          const addressNode = document.querySelectorAll(
            ".selected-address-text"
          );
          if (addressNode) {
            addressNode.forEach(
              (node) => (node.innerHTML = this.address.formattedAddress)
            );
          }
        }
      },
      manageAddressFinderPlp(flag) {
        var $el = document.querySelectorAll(this.addressFinderPLPSelector);
        if ($el) {
          $el.forEach((node) => {
            node.classList[flag ? "add" : "remove"]("has-address");
          });
        }
      },
      hideErrorMessage() {
        var $el = this.container.querySelector(".error-message");
        if ($el) {
          $el.classList.add(this.hiddenClass);
        }
      },
      removeDisabledLPL() {
        const nodes = document.querySelectorAll("[data-product-sku]");
        if (nodes) {
          nodes.forEach((node) => node.classList.remove(this.hiddenClass));
        }
      },
      showCheckInStoreBtn() {
        const nodes = document.querySelectorAll("[data-check-in-store-button]");
        if (nodes) {
          nodes.forEach((node) => node.classList.remove(this.hiddenClass));
        }
      },
      addClassToAddressFinder() {
        var nodes = document.querySelectorAll(".address-finder");
        var addressWrapper = document.querySelectorAll(".address-wrapper");
        if (nodes) {
          nodes.forEach((node) => node.classList.add("has-address"));
        }
        if (addressWrapper) {
          addressWrapper.forEach((node) => node.classList.add("has-address"));
        }
      },
      manageAddressFinderStoreLocator() {
        var nodes = document.querySelectorAll("[data-selected-store-wrapper]");
        if (nodes) {
          nodes.forEach((node) => node.classList.remove(this.hiddenClass));
        }
      },
      /**
       * On click the verify address button
       * @param {Event} evt
       */
      async onVerifyAddress(evt) {
        this.storeData();
        if (window.localStorage.address) {
          if (window.addressFinderModal) {
            window.addressFinderModal.close();
          }
          this.updateOpenModalBtnText();
          this.showAddressOnContentBox();
          this.showLoadLocationBtn();
          this.hideOptionList();
          this.hideNoneFound();
          this.hideErrorMessage();
          this.showStepFooter();
          this.showAddressOnheader();
          this.removeDisabledLPL();
          this.showCheckInStoreBtn();
          this.addClassToAddressFinder();
          const isLocatorPage = !!document.querySelector(
            "[data-address-store-locator]"
          );
          const isPLP = !!document.querySelector("[data-address-finder-plp]");
          const isPDP = !!document.querySelector(".address-finder-pdp");
          if (window.StoreLocator && isLocatorPage) {
            await window.StoreLocator.onVerifyAddress();
          }
          if (window.addressFinderPDP && isPDP) {
            window.addressFinderPDP.setAddress();
            window.addressFinderPDP.resetAll();
          }
          if (window.addressFinderPLP && isPLP) {
            window.addressFinderPLP.setAddress();
            window.addressFinderPLP.resetAll();
          }
          this.hidePickupOptionList();
          this.hidePickupOptionNoneFound();
          this.hideCheckoutFooterSection();
        } else {
          this.showError(
            `${this.options.errorMessage.EMPTY_ADDRESS} <p>${this.options.errorMessage.USE_DEFAULT}</p>`
          );
        }
      },
      hideCheckoutFooterSection() {
        const node = document.querySelector(".step__footer");
        if (node) {
          node.classList.add("hidden");
        }
      },
      hidePickupOptionList() {
        const node = document.querySelector("[data-location-list-display]");
        if (node) {
          node.classList.add("hidden");
        }
      },
      hidePickupOptionNoneFound() {
        const node = document.querySelector("[data-pickup-options-none-found]");
        if (node) {
          node.classList.add("hidden");
        }
      },
    });
    return AddressFinder;
  })();
  function DOMready(callback) {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
  }
  DOMready(function () {
    theme.tab.init();
  });
};
