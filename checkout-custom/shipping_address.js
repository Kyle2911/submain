import { CustardModule, STEP_CONTACT_INFORMATION } from "@discolabs/custard-js";
export class dropdownProvince extends CustardModule {
    id() {
        return 'dropdown-province';
    }
    steps() {
        return [STEP_CONTACT_INFORMATION];
    }
    selector() {
        return '[data-delivery-shipping-info]';
    }
    setup() {
        this.$element.find('#checkout_shipping_address_company').html(this.options.html_templates.dropdown_province);
    }
}