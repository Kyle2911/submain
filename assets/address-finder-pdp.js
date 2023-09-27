window.theme = window.theme || {};
if(!theme.addressFinderPDP ) {
  theme.addressFinderPDP = (function () {
    /**
     * Check in store at product detail page
     * @param {*} options - Option object
     * @param {*} element - the element
     */
    function addressFinderPDP(options = {}, element) {
      if (!element) {
        return;
      }
      this.namespace = "check-in-store";
      this.defaultOptions = {
        hiddenClass: "hide",
      };
      this.options = Object.assign(this.defaultOptions, options);
      this.element = element;
      this.selectors = {
        CHECK_IN_STORE_BUTTON: "[data-check-in-store-button]",
        ADDRESS_FINDER: "[data-address-finder-pdp]",
        VARIANT_JSON: "[data-variant-json]",
        CURRENT_VARIANT_JSON: "[data-selected-variant-json]",
        SUPPLIER_LIST: "[data-location-list-pdp]",
        VIEWMORE_BTN: "[data-viewmore-button]",
        SUPPLIER_ITEM: "[data-supplier-item]",
        NONE_SUPPLIER_FOUND: "[data-pickup-options-none-found]",
        VARIANT_NONE_FOUND: "[data-variant-none-found]"
      };
      this.defaultFetchData = {
        AffiliateExternalID: window.affiliate_id,
      };
      this.defaulFetchString =
        new URLSearchParams(this.defaultFetchData).toString() +
        "&ProcessingOptions=AllItemsAvailable%3Dtrue%7CDistanceMetric%3D1%7CShowOnlyPickupLocation=true";
      this.baseUrl =
        "https://omniproxy-uat.goldenabc.com/api/endpoints/getproductinventoryaroundlocation/call";
      this.loadingClass = "btn--loading";
      this.disabledClass = "btn--disabled";
      this.html = JSON.parse(this.element.dataset.html);
      this.defaultAvailableQty = Number(this.element.dataset.defaultQty);
      this.currentIndex = this.defaultAvailableQty;
      this.init();
    }
    addressFinderPDP.prototype = Object.assign(
      {},
      addressFinderPDP.prototype,
      {
        init: async function () {
          this.variants = this.getVariants();
          this.currentVariantId = this.getCurrentVariantId();
          this.allSupplier = await this.getAllSupplier();
          // this.initializeCheckInStoreButton();
          this.bindEvents();
        },
        initializeCheckInStoreButton() {
          const btn = this.element.querySelector(
            this.selectors.CHECK_IN_STORE_BUTTON
          );
          // Find current available variant object
          const currentVariant = this.variants.find(
            (variant) =>
              Number(variant.id) === Number(this.currentVariantId) &&
              variant.available
          );
          if (btn && this.currentVariantId && currentVariant) {
            btn.classList.remove(this.disabledClass);
          }
        },
        setAddress() {
          this.address = JSON.parse(localStorage.getItem("address"));
        },
        getVariants() {
          var el = document.querySelector(this.selectors.VARIANT_JSON);
          if (el) {
            return JSON.parse(el.innerText.trim());
          }
          return [];
        },
        async getAllSupplier() {
          const url =
          "https://omnistorelocations.goldenabc.com/storelocations/Shopify/Api/GetStoreLocations?brand=penshoppe";
        const response = await fetch(url);
        const json = await response.json();
        return json.message;
        },
        resetAll() {
          const optionNoneFoundNode = this.element.querySelector(
            this.selectors.NONE_SUPPLIER_FOUND
          );
          if (optionNoneFoundNode) {
            optionNoneFoundNode.classList.add(this.options.hiddenClass);
          }
          const supplierListNode = this.element.querySelector(
            this.selectors.SUPPLIER_LIST
          );
          if (supplierListNode) {
            supplierListNode.classList.add(this.options.hiddenClass);
          }
        },
        bindEvents() {
          const checkInStoreBtns = this.element.querySelectorAll(
            this.selectors.CHECK_IN_STORE_BUTTON
          );
          if(checkInStoreBtns) {
            checkInStoreBtns.forEach(checkInStoreBtn => {
              checkInStoreBtn.off("click." + this.namespace);
              checkInStoreBtn.on("click." + this.namespace, async (evt) => {
                const modal = evt.currentTarget.closest(".modal--quick-shop");
                const container = modal || document;
                const currentJsonNode = container.querySelector(
                  this.selectors.CURRENT_VARIANT_JSON
                );
                const product_id = this.getProductId(container);
                if(!((window.currentVariant && window.currentVariant.product_id == product_id) || (currentJsonNode && currentJsonNode.innerText !== "null"))) {
                  this.showVariantNoneFound(container);
                  return;
                }
                const target = evt.currentTarget;
                if (modal) {
                  const productHandlerEl = target.closest(
                    "[data-product-handle]"
                  );
                  if (productHandlerEl) {
                    const productHandler = productHandlerEl.dataset.productHandle;
                    document.body.classList.add("unloading");
                    const variantSearch = window.currentVariant
                      ? `?variant=${window.currentVariant.id}`
                      : "";
                    window.setTimeout(function () {
                      window.location.href =
                        window.location.origin +
                        "/products/" +
                        productHandler +
                        variantSearch;
                    }, 50);
                  }
                } else {
                  await this.onClickCheckInStoreButton.bind(this, evt)();
                }
              });
            })
          }
          
          this.element.off("click.check-in-store-" + this.namespace);
          this.element.on(
            "click.check-in-store-" + this.namespace,
            async (evt) => {
              let isLoadmoreBtn = evt.target.dataset.checkInStoreButton;
              if (!isLoadmoreBtn) {
                isLoadmoreBtn =
                  evt.target.closest("button") &&
                  evt.target.closest("button").dataset.checkInStoreButton;
              }
              if (isLoadmoreBtn) {
                await this.onClickCheckInStoreButton.bind(this, evt)();
              }
            }
          );
          this.element.off("click." + this.namespace);
          this.element.on("click." + this.namespace, (evt) => {
            let isLoadmoreBtn = evt.target.dataset.viewmoreButton;
            if (!isLoadmoreBtn) {
              isLoadmoreBtn =
                evt.target.closest("button") &&
                evt.target.closest("button").dataset.viewmoreButton;
            }
            if (isLoadmoreBtn) {
              this.onClickLoadmore.bind(this)();
            }
          });
        },
        getProductId(container = document) {
          const node = container.querySelector('[data-product-id]');
          if(node) {
            return node.dataset.productId;
          }
          return '';
        },
        showVariantNoneFound(container = document) {
          const node = container.querySelector(this.selectors.VARIANT_NONE_FOUND);
          if(node) {
            node.classList.remove(this.options.hiddenClass);
          }
        },
        onClickLoadmore() {
          this.currentIndex += this.defaultAvailableQty;
          this.loadMoreSupplier();
        },
        loadMoreSupplier() {
          const $el = this.element.querySelector(
            this.selectors.SUPPLIER_LIST
          );
          if ($el) {
            const $supplierListEl = $el.querySelectorAll(
              this.selectors.SUPPLIER_ITEM
            );
            if ($supplierListEl) {
              $supplierListEl.forEach((node, index) => {
                if (index < this.currentIndex) {
                  node.classList.remove(this.options.hiddenClass);
                }
              });
            }
          }
        },
        async onClickCheckInStoreButton(evt) {
          this.currentIndex = this.defaultAvailableQty;
          var address = window.localStorage.getItem("address");
          var $el = evt.target;
          var attribute = this.selectors.CHECK_IN_STORE_BUTTON.replace(
            /[\[\]]/g,
            ""
          );
          if (!$el.hasAttribute(attribute)) {
            $el = evt.target.closest(this.selectors.CHECK_IN_STORE_BUTTON);
          }
          if (!$el) {
            return;
          }
          $el.classList.add(this.loadingClass);
          $el.classList.add(this.disabledClass);
          if (address) {
            address = JSON.parse(address);
            var res = {};
            try {
              res = await this.getInventoryByLocation();
              this.suppliers = this.getSuppliers(res);
              // Logic for testing viewmore.
              // this.suppliers = this.allSupplier.map(obj => {
              //   return {...obj,
              //     Products: {
              //       Product: {
              //         ProductQTY: 500
              //       }
              //     }
              //   }
              // });
              if (this.suppliers.length) {
                this.hideNoneSupplierFound();
                this.generateSupplierList();
              } else {
                this.showNoneSupplierFound();
                this.hideSupplierList();
              }
            } catch (err) {
            }
          } else {
            this.showAddressFinderBlock();
          }
          $el.classList.remove(this.loadingClass);
          $el.classList.remove(this.disabledClass);
        },
        showNoneSupplierFound() {
          var node = document.querySelector(
            this.selectors.NONE_SUPPLIER_FOUND
          );
          var wrapper = document.querySelector("[data-address-finder-pdp]");
          if (wrapper) {
            wrapper.classList.remove(this.options.hiddenClass);
          }
          if (node) {
            node.classList.remove(this.options.hiddenClass);
          }
        },
        hideNoneSupplierFound() {
          var node = document.querySelector(
            this.selectors.NONE_SUPPLIER_FOUND
          );
          if (node) {
            node.classList.add(this.options.hiddenClass);
          }
        },
        hideSupplierList() {
          var supplierElement = this.element.querySelector(
            this.selectors.SUPPLIER_LIST
          );
          if(supplierElement) {
            supplierElement.classList.add(this.options.hiddenClass);
          }
        },
        generateSupplierList() {
          var supplierHtml = this.buildSupplierHTML();
          var supplierElement = this.element.querySelector(
            this.selectors.SUPPLIER_LIST
          );
          supplierElement.innerHTML = supplierHtml;
          supplierElement.classList.remove(this.options.hiddenClass);
        },
        buildSupplierHTML() {
          if (this.suppliers) {
            const str = this.suppliers.reduce((prev, curr, currIndex) => {
              return (
                prev +
                this.html.location_item
                  .replace(/%title%/g, curr.SupplierCompanyName)
                  .replace(
                    /%distance%/g,
                    this.converMetreToKilometre(curr.Products.Product.ProductQTY)
                  )
                  .replace(
                    /%available%/g,
                    curr.isAv ? "" : this.options.hiddenClass
                  )
                  .replace(
                    /%unavailable%/g,
                    curr.isUnAv ? "" : this.options.hiddenClass
                  )
                  .replace(
                    /%warning%/g,
                    curr.isWarning ? "" : this.options.hiddenClass
                  )
                  .replace(
                    /%display%/g,
                    currIndex >= this.currentIndex
                      ? this.options.hiddenClass
                      : ""
                  )
              );
            }, "");
            const viewmoreBtnHtml = this.html.viewmore_btn.replace(
              /%display%/g,
              this.currentIndex < this.suppliers.length - 1
                ? ""
                : this.options.hiddenClass
            );
            return `<div class="inner">${str}</div>${viewmoreBtnHtml}`;
          }
          return "";
        },
        converMetreToKilometre(str) {
          const rs = Number(str);
          if (rs <= 5) {
            return 'Almost sold out';
          } else {
            return 'Available';
          }
        },
        convertMilesToKm(str) {
          return Math.round(Number(str) * 1.6 * 100) / 100;
        },
        /** Get the supplier from the API response */
        getSuppliers(res = {}) {
          const { ProductSuppliers = {} } = res;
          let { ProductSupplier = [] } = ProductSuppliers;
          if (!Array.isArray(ProductSupplier)) {
            ProductSupplier = [ProductSupplier];
          }
          const result = ProductSupplier.sort((a, b) =>
            this.sortingSupplier(a, b)
          ).map((obj) => {
            const foundSupplier = this.allSupplier.find((sup) => {
              return sup.siteId === Number(obj.SupplierFullName);
            });
            const productQty = Number(obj.Products.Product.ProductQTY);
            return {
              ...obj,
              SupplierCompanyName: foundSupplier ? foundSupplier.Title : '',
              isAv: productQty > this.defaultAvailableQty,
              isUnAv: productQty === 0,
              isWarning:
                productQty > 0 && productQty <= this.defaultAvailableQty,
            };
          });
          return result;
        },
        /**Sorting the Supplier by the product qty and the supplier distance */
        sortingSupplier(a, b) {
          return Number(a.Products.Product.ProductQTY) - Number(b.Products.Product.ProductQTY);
        },
        /**Get the product from the supplier */
        getProductFromSupplier(supplier = {}) {
          const { Products = {} } = supplier;
          const { Product = {} } = Products;
          return Product;
        },
        /**
         * Build the location parameters
         */
        buildUrlFromLocation() {
          const address = JSON.parse(window.localStorage.getItem("address"));
          return `SourcePostalCode=${
            address.postcode || address.zip
          }&SourceCountry=${address.country || "Philippines"}&SearchRadias=${
            address.radias || 20000
          }`;
        },
        /**
         * Async Get the inventory
         * @property {string} geocode
         * @return {Promise}
         */
        async getInventoryByLocation() {
          const productOptionStr = this.buildUrlFromSelectedOption();
          const locationStr = this.buildUrlFromLocation();
          const url = `${this.baseUrl}?${this.defaulFetchString}&${productOptionStr}&${locationStr}`;
          const response = await fetch(url);
          const text = await response.text();
          var xmlText = text;
          var x2js = new X2JS();
          var jsonObj = x2js.xml_str2json(xmlText);
          return jsonObj;
        },
        /** Get the current variant id */
        getCurrentVariantId() {
          if (window.location.search) {
            const searchParams = new URLSearchParams(window.location.search);
            const id = searchParams.get("variant");
            if(id) {
              return searchParams.get("variant");
            }
          }
          var el = document.querySelector(
            this.selectors.CURRENT_VARIANT_JSON
          );
          var currentVariant = JSON.parse(el.innerText.trim()) || {};
          return currentVariant.id;
        },
        buildUrlFromSelectedOption() {
          const currentVariantId = this.getCurrentVariantId();
          const variantObj =
            this.variants.find((variant) => variant.id == currentVariantId) ||
            {};
          const dataString = `${variantObj.sku} | 1`;
          return `PartnoOrOptionValueAndQty=${encodeURIComponent(
            dataString
          )}`;
        },
        showAddressFinderBlock() {
          var el = this.element.querySelector(this.selectors.ADDRESS_FINDER);
          if (el) {
            el.classList.remove(this.options.hiddenClass);
          }
        },
      }
    );
    return addressFinderPDP;
  })();
}
theme.DOMready(function() {
  if(!window.addressFinderPDP) {
    window.addressFinderPDP = new theme.addressFinderPDP(
      {},
      document.querySelector(".address-finder-pdp")
    );
  }
})