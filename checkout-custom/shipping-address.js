import { CustardModule, STEP_CONTACT_INFORMATION } from "@discolabs/custard-js";

export class ShippingAddress extends CustardModule {
  id() {
    return "shipping-address";
  }

  steps() {
    return [STEP_CONTACT_INFORMATION];
  }

  selector() {
    return "[data-delivery-shipping-info]";
  }

  bindEvents() {
    this.$element
      .find("#checkout_shipping_address_province")
      .on("change.load-city", onChangeProvinceHandler);
  }

  setup() {
    const selectors = {
      SECTION_CONTENT: ".section__content",
      COUNTRY_INPUT: "#checkout_shipping_address_country",
      BRG_WRAPPER: '[data-address-field="address1"]',
      PROVINCE_WRRAPPER: '[data-address-field="province"]',
      CITY_WRAPPER: '[data-address-field="city"]',
      PROVINCE_SELECT: "#checkout_shipping_address_province",
      CITY_SELECT: "#checkout_shipping_address_city",
      ZIP_WRAPPER: '[data-address-field="zip"]',
      ADDRESS2_WRAPPER: '[data-address-field="address2"]',
      ADDRESS1_WRAPPER: '[data-address-field="address1"]',
      INPUT_WRAPPER: ".field__input-wrapper",
    };
    const carretHtml = `<div class="field__caret shown-if-js">
    <svg class="icon-svg icon-svg--color-adaptive-lighter icon-svg--size-10 field__caret-svg" role="presentation" aria-hidden="true" focusable="false"> <use xlink:href="#caret-down"></use> </svg>
  </div>`;


    // Fixed country to Philippines
    const countryInput = this.$element.find(selectors.COUNTRY_INPUT);
    countryInput.val("Philippines").trigger("change").addClass("disabled");

    // Add barangay
    const brgQuery = this.$element.find(selectors.BRG_WRAPPER);
    const provinceSelect = document.querySelector(selectors.PROVINCE_SELECT);
    const cityWrapperQuery = this.$element.find(selectors.CITY_WRAPPER);
    const provinceWrapper = this.$element.find(selectors.PROVINCE_WRRAPPER);
    const zipWrapperQuery = this.$element.find(selectors.ZIP_WRAPPER);
    const address2Wrapper = this.$element.find(selectors.ADDRESS2_WRAPPER);
    const address1Wrapper = this.$element.find(selectors.ADDRESS1_WRAPPER);


    const adjustHTML = () => {
      provinceSelect.removeAttribute("disabled");
      cityWrapperQuery.hide();

      address2Wrapper
        .addClass("field--show-floating-label")
        .find(selectors.INPUT_WRAPPER)
        .addClass("field__input-wrapper--select")
        .append(
          `<select placeholder="${window.translation.city_placholder}" class="field__input field__input--select" name="checkout[shipping_address][address2]" id="custom-city-select"><option selected disabled value="">${window.translation.city_placholder}</option></select>${carretHtml}`
        );

      // zipWrapperQuery
      //   .addClass("field--show-floating-label")
      //   .find(selectors.INPUT_WRAPPER)
      //   .addClass("field__input-wrapper--select")
      //   .append(
      //     `<select placeholder="${window.translation.zip_label}" class="field__input field__input--select" name="checkout[shipping_address][zip]" id="custom-zip-select"><option selected disabled>${window.translation.zip_label}</option></select>${carretHtml}`
      //   );
      address1Wrapper
        .addClass("field--show-floating-label")
        .find(selectors.INPUT_WRAPPER)
        .addClass("field__input-wrapper--select")
        .append(
          `<select placeholder="${window.translation.barangay_placeholder}" class="field__input field__input--select" name="checkout[shipping_address][address1]" id="custom-bangaray-select"><option disabled selected value="">${window.translation.barangay_placeholder}</option></select>${carretHtml}`
        );

      address2Wrapper.find('input[type="text"]').remove();
      address1Wrapper.find('input[type="text"]').remove();
      zipWrapperQuery
        .find('input[type="text"]')
        .val("")
        .attr("placeholder", window.translation.zip_label)
        .addClass("disabled");

      provinceWrapper
        .insertAfter('[data-address-field="company"]')
        .removeClass("hidden");
      address2Wrapper.insertAfter(provinceWrapper);
      address1Wrapper.insertAfter(address2Wrapper);
      zipWrapperQuery.removeClass("field--half ");

      provinceWrapper.find("label").text(window.translation.province_label);
      provinceWrapper
        .find("option:disabled")
        .text(window.translation.province_label)
        .attr('value', "");
      provinceWrapper.find("option:not(:disabled)").remove();
      this.$(selectors.PROVINCE_SELECT).append(this.options.html_templates.province_list).val("");

      zipWrapperQuery.find("label").text(window.translation.zip_label);
    };
    this.$(selectors.PROVINCE_SELECT).on('change.checkout-custom', (evt) => {
      _onChangeProvinceHandler(evt);
    });
    adjustHTML();

    const $prov = document.querySelector("#checkout_shipping_address_province");
    const $city = document.querySelector("#custom-city-select");
    const $brgy = document.querySelector("#custom-bangaray-select");
    const $zip = document.querySelector("#checkout_shipping_address_zip");

    var retrievedObject =
        window.localStorage.getItem("address") &&
        JSON.parse(window.localStorage.getItem("address")),
      retrievedAddress = retrievedObject && {
        addBarangay:
          retrievedObject.barangay !== "" ? retrievedObject.barangay : "",
        addCity: retrievedObject.city !== "" ? retrievedObject.city : "",
        addProvince:
          retrievedObject.prov_chk !== "" ? retrievedObject.prov_chk : "",
        addZip: retrievedObject.zip !== "" ? retrievedObject.zip : "",
        province_name: retrievedObject.province,
        city_name: retrievedObject.city,
        bgry_name: retrievedObject.barangay,
      };

    this.$element
      .find("#custom-city-select")
      .on("change", (evt) => _onChangeCityHandler(evt));

    this.$element
      .find("#custom-bangaray-select")
      .on("change", (evt) => _onChangeBgruHandler(evt));

    const _onChangeProvinceHandler = (evt) => {
      const el = this.$(evt.target);
      const cityQuery = this.$(selectors.CITY_SELECT);
      const provinceName = el.find("option:selected").text();

      cityQuery.val(provinceName);
      const selectedOption = el.find("option:selected");
      getList("city", { value: selectedOption.attr("data-value") });
    };

    const _onChangeCityHandler = (evt) => {
      const el = this.$(evt.target);

      const selectedOption = el.find("option:selected");
      getList("brgy", { value: selectedOption.attr("data-value") });
    };

    const _onChangeBgruHandler = () => {
      const province = this.$(provinceSelect).find("option:selected").text();
      const city = this.$element.find("#custom-city-select").val();
      getList("zip", { province, city });
    };

    const getList = (list, obj) => {
      var url = "";
      var function_name = "";
      switch (list) {
        case "city":
          $brgy.disabled = true;
          url =
            "https://tools.gabcgfs.com/address_finder.php?PROVINCE=" +
            $prov.options[$prov.selectedIndex].text;
          function_name = "populateCity";
          this.$.ajax({
            url: url,
            type: "GET",
            dataType: "jsonp",
            contentType: "application/json; charset=UTF-8",
            jsonpCallback: function_name,
          });
          break;
        case "brgy":
          url =
            "https://tools.gabcgfs.com/address_finder.php?PROVINCE=" +
            $prov.options[$prov.selectedIndex].text
          function_name = "populateBrgy";
          this.$.ajax({
            url: url,
            type: "GET",
            dataType: "jsonp",
            contentType: "application/json; charset=UTF-8",
            jsonpCallback: function_name,
          });
          break;
        case "zip":
          populateZip();
      }
    };

    const populateCity = (json) => {
      const retrievedObject =
          window.localStorage.getItem("address") &&
          JSON.parse(window.localStorage.getItem("address")),
        retrievedAddress = retrievedObject && {
          addBarangay:
            retrievedObject.barangay !== "" ? retrievedObject.barangay : "",
          addCity: retrievedObject.city !== "" ? retrievedObject.city : "",
          addProvince:
            retrievedObject.prov_chk !== "" ? retrievedObject.prov_chk : "",
          addZip: retrievedObject.zip !== "" ? retrievedObject.zip : "",
          province_name: retrievedObject.province,
          city_name: retrievedObject.city,
          bgry_name: retrievedObject.barangay,
        };
      $city.classList.add("ui-loading");
      if (!json.Error) {
        this.$($city).find("option:not(:disabled)").remove();
        if (json[0]) {
          json[0].CITY.forEach((x) => {
            if (x.CITY) {
              const value = String(x.CITY);
              var option = document.createElement("option");
              option.text = value;
              option.value = value;
              $city.appendChild(option);
            }
          });
        }
      } else {
        alert(json.Message);
      }
      setTimeout(function () {
        $city.classList.remove("ui-loading");
        $city.disabled = false;
      }, 300);
      if (window.currentAddress) {
        const city = window.currentAddress.address2;
        $city.value = city;
        if ($city.selectedIndex === -1) {
          $city.selectedIndex = 0;
        } else {
          $city.dispatchEvent(event_change);
        }
      } else if (retrievedAddress != null) {
        if (retrievedAddress["addProvince"] === $prov.value || $prov.options[$prov.selectedIndex].text.toLowerCase() === String(retrievedAddress.province_name).toLowerCase()) {
          var _value = retrievedAddress["addCity"] ? retrievedAddress["addCity"] : retrievedAddress.city_name;
          $city.value = _value;

          if ($city.selectedIndex === -1) {
            $city.selectedIndex = 0;
          }
          $city.dispatchEvent(event_change);
        }
      } else {
        $city.selectedIndex = 0;
        $city.dispatchEvent(event_change);
      }
    };

    const populateBrgy = (json) => {
      $brgy.classList.add("ui-loading");
      const retrievedObject =
          window.localStorage.getItem("address") &&
          JSON.parse(window.localStorage.getItem("address")),
        retrievedAddress = retrievedObject && {
          addBarangay:
            retrievedObject.barangay !== "" ? retrievedObject.barangay : "",
          addCity: retrievedObject.city !== "" ? retrievedObject.city : "",
          addProvince:
            retrievedObject.prov_chk !== "" ? retrievedObject.prov_chk : "",
          addZip: retrievedObject.zip !== "" ? retrievedObject.zip : "",
          province_name: retrievedObject.province,
          city_name: retrievedObject.city,
          bgry_name: retrievedObject.barangay,
        };
      if (!json.Error) {
        this.$($brgy).find("option:not(:disabled)").remove();
        const city = $city.value;
        if(json[0] && json[0].CITY && city) {
          const { CITY } = json[0];
          const selectedCity = CITY.find(item => item.CITY === city);
          if(selectedCity) {
            selectedCity.BARANGAY.forEach((x) => {
              if (x.BARANGAY) {
                const value = String(x.BARANGAY);
                var option = document.createElement("option");
                option.text = value;
                option.value = value;
                option.dataset.zip = x.ZIP;
                $brgy.appendChild(option);
              }
            });
          }
        }
      } else {
        alert(json.Message);
      }
      setTimeout(function () {
        $brgy.classList.remove("ui-loading");
        $brgy.disabled = false;
      }, 300);
      if (window.currentAddress) {
        const brgy = window.currentAddress.address1;
        $brgy.value = brgy;
        if ($brgy.selectedIndex === -1) {
          $brgy.selectedIndex = 0;
        }
        $brgy.dispatchEvent(event_change);
      } else if (retrievedAddress) {

        if (
          String(retrievedAddress["addCity"]).toUpperCase() ===
            String($city.value).toUpperCase() ||
          String($city.value).toUpperCase() ===
            String(retrievedAddress.city_name).toUpperCase()
        ) {
          $brgy.value =
            String(retrievedAddress["addBarangay"] || retrievedAddress.bgry_name);
          if ($brgy.selectedIndex === -1) {
            $brgy.selectedIndex = 0;
          }
          $brgy.dispatchEvent(event_change);
        } else {
          $brgy.selectedIndex = 0;
          $brgy.dispatchEvent(event_change);
        }
      }
      if(!$city.selectedIndex){
        $brgy.selectedIndex = 0;
        $brgy.dispatchEvent(event_change);
      }
    };

    const populateZip = (json) => {
      if ($brgy.options[$brgy.selectedIndex]) {
        $zip.value =
          $brgy.options[$brgy.selectedIndex].getAttribute("data-zip");
      } else {
        $zip.value = 'Zip';
      }
    };

    window.populateCity = populateCity;
    window.populateBrgy = populateBrgy;
    window.populateZip = populateZip;

    /**
     * Load the selected address to contact form
     * @param {string[]} selectors - inputs selectors
     */
    const loadDefaultAddress = () => {
      let address =
        window.localStorage.getItem("address") &&
        JSON.parse(window.localStorage.getItem("address"));
      if (address) {
        reflectProvince(address.prov_id, address.province);
      }
      if (
        !(
          window.Customer &&
          Object.keys(window.Customer).length === 0 &&
          Object.getPrototypeOf(window.Customer) === Object.prototype
        )
      ) {
        !this.$('[name="checkout[shipping_address][first_name]"]').val() &&
          this.$('[name="checkout[shipping_address][first_name]"]').val(
            window.Customer.first_name
          );
        !this.$('[name="checkout[shipping_address][last_name]"]').val() &&
          this.$('[name="checkout[shipping_address][last_name]"]').val(
            window.Customer.last_name
          );
        !this.$('[name="checkout[shipping_address][phone]"]').val() &&
          this.$('[name="checkout[shipping_address][phone]"]').val(
            window.Customer.phone
          );
      }
    };
    const reflectProvince = (province, proName) => {
      const $province = document.getElementById(
        "checkout_shipping_address_province"
      );
      const $options = $province.querySelectorAll("option");
      const selectedOption = Array.from($options).find(
        (opt) =>
          String(opt.text).toUpperCase() === String(proName).toUpperCase()
      );
      if ($province) {
        $province.value = province;
        if ($province.selectedIndex === -1 && selectedOption) {
          $province.value = selectedOption.value;
        }
        if ($province.selectedIndex === -1) {
          $province.selectedIndex = 0;
        }
        $province.dispatchEvent(new Event("change"));
      }
    };
    const resetProvince = () => {
      const $province = document.getElementById(
        "checkout_shipping_address_province"
      );
      $province.selectedIndex = 0;
      $province.dispatchEvent(new Event("change"));
    };
    const getSelectedOption = (node, text) => {
      const option = this.$(node).find("options");
      return option;
    };
    window.loadDefaultAddress = loadDefaultAddress;
    // $prov.dispatchEvent(new Event('change'));
    this.$("#checkout_shipping_address_id").on("change", (evt) => {
      const $el = this.$(evt.target);
      const selectedOption = evt.target.options[evt.target.selectedIndex];
      let province_code = "";
      let province_name = "";
      if (selectedOption) {
        let selectedProperties = selectedOption.dataset.properties;
        selectedProperties = selectedProperties
          ? JSON.parse(selectedProperties)
          : null;
        if (selectedProperties) {
          province_name = selectedProperties.province;
          province_code = selectedProperties.province_code;
          window.currentAddress = selectedProperties;
        }
      }
      // Settimeout to makesure this logic runs behinde the checkout default flow
      setTimeout(() => {
        provinceSelect.removeAttribute("disabled");
        countryInput.val("Philippines").addClass("disabled");
        cityWrapperQuery.hide();
        zipWrapperQuery
          .find('input[type="text"]')
          .attr("placeholder", window.translation.zip_label)
          .addClass("disabled");

        provinceWrapper
          .insertAfter('[data-address-field="company"]')
          .removeClass("hidden");
        address2Wrapper.insertAfter(provinceWrapper);
        address1Wrapper.insertAfter(address2Wrapper);
        zipWrapperQuery.removeClass("field--half ");

        provinceWrapper.find("label").text(window.translation.province_label);
        provinceWrapper
          .find("option:disabled")
          .text(window.translation.province_label);
        provinceWrapper.find("option:not(:disabled)").remove();
        this.$(provinceSelect).append(
          this.options.html_templates.province_list
        );

        zipWrapperQuery.find("label").text(window.translation.zip_label);
        if (province_code || province_name) {
          reflectProvince(province_code, province_name);
        } else {
          resetProvince();
        }
      }, 500);
    });

    // Add the autocomplete off
    const disabledAutocomplete = () => {
      this.$element.find('input').attr('autocomplete', 'autocomplete="chrome-off"');
      this.$(document).find('#checkout_email').attr('autocomplete', 'autocomplete="chrome-off"');
    }
    this.$(document).on('page:change', () => {
      // Add the autocomplete off
      disabledAutocomplete()

    });
    disabledAutocomplete();
  }
}