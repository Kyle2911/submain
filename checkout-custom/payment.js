import {
  CustardModule,
  STEP_PAYMENT_METHOD,
  STEP_CONTACT_INFORMATION,
} from "@discolabs/custard-js";

export class Payment extends CustardModule {
  id() {
    return "payment";
  }

  steps() {
    return [STEP_PAYMENT_METHOD];
  }

  selector() {
    return '[data-step="' + STEP_PAYMENT_METHOD + '"]';
  }

  async setup() {
    if(!(window.CartItems && window.CartItems.length)) {
      const continueBtn = this.$("#continue_button");
      continueBtn.text('Return to Home Page');
      continueBtn.attr('type', 'button');
      continueBtn.on('click', function(e) {
        e.preventDefault();
        window.location.href = window.location.origin;
        return false;
      });
      return;
    }
    if (this.options.attributes.pickup_store_title) {
      var $methodReviewBlock = this.$(".review-block:contains(Method)");
      this.$(".review-block__content", $methodReviewBlock).html(
        this.options.html_templates.pickupReviewDetailsBlock
      );
    }
    const cartObj = await this.getCartItems();
    // if(window.localStorage.getItem('cachedItems') !== JSON.stringify(cartObj.items)) {
    //   this.redirectToContact();
    //   return;
    // }
    // if (this.options.attributes.pickup_store_title) {
    //   if (!window.localStorage.getItem("address")) {
    //     this.redirectToContact();
    //     return;
    //   }
    //   var $methodReviewBlock = this.$(".review-block:contains(Method)");
    //   this.$(".review-block__content", $methodReviewBlock).html(
    //     this.options.html_templates.pickupReviewDetailsBlock
    //   );
    //   await this.doubleCheckAddress();
    // } else {
    //   await this.doubleCheckShipping();
    // }

  }

  async getCartItems() {
    const res = await fetch(window.location.origin + '/cart.js');
    return await res.json();
  }

  redirectToContact() {
    window.location.href =
      window.location.origin + "/checkout?step=" + STEP_CONTACT_INFORMATION;
  }

  async doubleCheckAddress() {
    const suppliers = await this.getInventoryByLocation();

    if (suppliers.length) {
      const selectedSupplier = suppliers.find(
        (supplier) => supplier.SupplierFullName === window.CheckoutSupplierId
      );
      const products = this.getProductFromSupplier(selectedSupplier);
      const isAllAv = this.qualifyProduct(selectedSupplier);
      
      if (!isAllAv) {
        const isShipableAllProducts = await this.getUnavProduct(products);
        if (!isShipableAllProducts) {
          this.redirectToContact();
        }
      }
    } else {
      this.redirectToContact();
    }
  }
  qualifyProperties = async () => {
    
  }
  /**Get UnAvPro
   * @return {boolean}
   */
  qualifyProduct = (supplier) => {
    const _products = this.getProductFromSupplier(supplier);
    return _products.every((pro) => {
      const proInCart = window.CartItems.find((item) => {
        return String(item.sku) === String(pro.ProductPartNo);
      });
      return Number(proInCart.quantity) <= Number(pro.ProductQTY);
    });
  };
  async getUnavProduct() {
    const baseUrl = `https://omniproxy-uat.goldenabc.com/api/endpoints/getinventorybyproductpartnooroptionvalue/call?AffiliateExternalID=`+ window.affiliate_id +`&SupplierFullNames=ALL&ProcessingOptions=SearchByUPC%3Dfalse&${this.buildUrlFromCartItems()}`;
    const response = await fetch(baseUrl);
    const text = await response.text();
    let result = true;
    var xmlText = text;
    var x2js = new X2JS();
    var jsonObj = x2js.xml_str2json(xmlText);
    let Product = jsonObj.ProductSuppliers.ProductSupplier.Products.Product;
    Product = Array.isArray(Product) ? Product : [Product];
    Product.map((pro) => {
      const cartItem = window.CartItems.find(
        (item) => item.sku == pro.ProductPartNo
      );
      if (pro.ProductQTY < cartItem.quantity) {
        result = false;
      }
    });
    return result;
  }
  buildItemsParams() {
    const dataString = window.CartItems.reduce(
      (prev, curr, currIndex) =>
        prev +
        curr.sku +
        " | " +
        curr.quantity +
        (currIndex === window.CartItems.length - 1 ? "" : ","),
      ""
    );
    return `PartnoOrOptionValueAndQty=${encodeURIComponent(dataString)}`;
  }
  async doubleCheckShipping() {
    const baseUrl = `https://omniproxy-uat.goldenabc.com/api/endpoints/getinventorybyproductpartnooroptionvalue/call?AffiliateExternalID=`+ window.affiliate_id +`&SupplierFullNames=ALL&ProcessingOptions=SearchByUPC%3Dfalse&${this.buildItemsParams()}`;
    const response = await fetch(baseUrl);
    const text = await response.text();
    var xmlText = text;
    var x2js = new X2JS();
    var jsonObj = x2js.xml_str2json(xmlText);
    const { ProductSuppliers = {} } = jsonObj;
        const {
          ProductSupplier,
          Response: { ResponseHasErrors = "false" },
        } = ProductSuppliers;
    const nearestStore = await this.getNearestStore();
    if (!ProductSupplier || ResponseHasErrors === "true") {
      if (this.options.shipping_address_zip) {
        if (!nearestStore) {
          this.redirectToContact();
        } else {
          this.handleUnav(nearestStore);
        }
      }
    } else {
      this.handleUnav(ProductSupplier, nearestStore);
    }
    // if (jsonObj.ProductSuppliers.Response.ResponseHasErrors === "true") {
    //   this.redirectToContact();
    //   return [];
    // }
    // const { ProductSuppliers = {} } = jsonObj;
    // let { ProductSupplier = {} } = ProductSuppliers;
    // const { Products } = ProductSupplier;
    // let { Product } = Products;
    // Product = Array.isArray(Product) ? Product : [Product];
    // const rs = Product.some((pro) => {
    //   const cartItem = window.CartItems.find(
    //     (item) => item.sku == pro.ProductPartNo
    //   );
    //   return pro.ProductQTY < cartItem.quantity;
    // });
    // if (rs) {
    //   this.redirectToContact();
    //   // console.log("result", rs);
    // }
  }
  handleUnav = (Supplier = {}, nearesSupplier) => {
    const Product = this.getProductFromSupplier(Supplier);
    let nearestSupplierProduct = [];
    if (nearesSupplier) {
      nearestSupplierProduct = this.getProductFromSupplier(nearesSupplier);
    }
    if (Product || nearestSupplierProduct) {
      const willUseProduct =
        nearestSupplierProduct.length > Product.length
          ? nearestSupplierProduct
          : Product;
      const unavProducts = this.getUnavProducts(willUseProduct) || [];
      if (unavProducts.length) {
        this.redirectToContact();
      }
    } else {
      this.redirectToContact();
    }
  }
  getUnavProducts = (ProductSupplier = []) => {
    return ProductSupplier.map((pro) => {
      const cartItem = CartItems.find(
        (item) => item.sku == pro.ProductPartNo
      );
      if (pro.ProductQTY < cartItem.quantity) {
        return cartItem;
      }
      return null;
    }).filter((item) => !!item);
  };
  getProductFromSupplier = function (supplier = {}) {
    const { Products = {} } = supplier;
    const { Product } = Products;
    if (Product) {
      return Array.isArray(Product) ? Product : [Product];
    }
    return [];
  };
  getNearestStore = async () => {
    const suppliers = (await this.getInventoryByLocation(true)) || [];
    return suppliers.sort(this.sortingSupplier)[0];
  };
  sortingSupplier = (a, b) => {
    const product1 = this.getProductFromSupplier(a);
    const porduct2 = this.getProductFromSupplier(b);
    if (product1.length === porduct2.length) {
      return a.SupplierDistance - b.SupplierDistance;
    }
    return porduct2.length - product1.length;
  };
  /**Get the product from the supplier */
  getProductFromSupplier = function (supplier = {}) {
    const { Products = {} } = supplier;
    const { Product = {} } = Products;

    return Array.isArray(Product) ? Product : [Product];
  };
  async getInventoryByLocation(isShipping) {
    const defaultFetchData = {
      AffiliateExternalID: window.affiliate_id,
    };
    const defaulFetchString =
      new URLSearchParams(defaultFetchData).toString() +
      `&ProcessingOptions=AllItemsAvailable%3Dfalse%7CDistanceMetric%3D1%7CShowOnlyPickupLocation=${isShipping? 'false' : 'true'}`;
    const baseUrl =
      "https://omniproxy-uat.goldenabc.com/api/endpoints/getproductinventoryaroundlocation/call";
    const cartItemsStr = this.buildUrlFromCartItems();
    const locationStr = this.buildUrlFromLocation(isShipping);
    const url = `${baseUrl}?${defaulFetchString}&${cartItemsStr}&${locationStr}`;
    const response = await fetch(url);
    const text = await response.text();
    var xmlText = text;
    var x2js = new X2JS();
    var jsonObj = x2js.xml_str2json(xmlText);
    if (jsonObj.ProductSuppliers.Response.ResponseHasErrors === "true") {
      return [];
    }
    const { ProductSuppliers = {} } = jsonObj;
    const { ProductSupplier = [] } = ProductSuppliers;
    return Array.isArray(ProductSupplier) ? ProductSupplier : [ProductSupplier];
  }
  /**
   * Build the productpartno parameters
   * @returns
   */
  buildUrlFromCartItems(items) {
    const localItems = items || [...window.CartItems];
    const dataString = localItems.reduce(
      (prev, curr, currIndex) =>
        prev +
        curr.sku +
        " | " +
        curr.quantity +
        (currIndex === window.CartItems.length - 1 ? "" : ","),
      ""
    );
    return `PartnoOrOptionValueAndQty=${encodeURIComponent(dataString)}`;
  }
  /**
   * Build the location parameters
   */
  buildUrlFromLocation(isShipping) {
    return `${this.getSearchRadiasStr(isShipping)}&${this.getPostCodeAndCountryStr(isShipping)}`;
  }
  /**
   * Get the search radius from the address from
   * @returns
   */
  getSearchRadiasStr(isShipping) {
    if(isShipping) {
      return `SearchRadias=1609344`
    }
    if (window.localStorage.getItem("address")) {
      const address = JSON.parse(window.localStorage.getItem("address"));
      const radiusValue = address.radias;
      return `SearchRadias=${radiusValue || 20000}`;
    }
    return `SearchRadias=20000`;
  }
  /**
   * Get the poscode from the address
   */
  getPostCodeAndCountryStr(isShipping) {
    if(isShipping) {
      return `SourcePostalCode=${this.options.address.zip}&SourceCountry=${this.options.address.country}`;
    }
    const address = JSON.parse(window.localStorage.getItem("address"));
    return `SourcePostalCode=${address.postcode || address.zip}&SourceCountry=${
      address.country || "Philippines"
    }`;
  }
}
