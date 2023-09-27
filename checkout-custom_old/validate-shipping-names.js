import { CustardModule, STEP_CONTACT_INFORMATION } from "@discolabs/custard-js";

export class ValidateFLNames extends CustardModule {

  id() {
    return 'shipping__details';
  }

  steps() {
    return [STEP_CONTACT_INFORMATION];
  }

  selector() {
    return '[data-delivery-shipping-info]';
  }

  setup() {
    const continueBtnShipping = "#continue_button";
    const PHONE = "#checkout_shipping_address_phone";
    const FNAME = '#checkout_shipping_address_first_name';
    const LNAME = '#checkout_shipping_address_last_name';

    const htmlInput = `<div class="gabc-note__flnames"></div>`;

    this.$element.find('.section__title').append(htmlInput);
    this.$element.find('.section__title .gabc-note__flnames').html(this.options.html_templates.flNameNote);
    this.$element.find(PHONE).get(0).setAttribute('placeholder', this.options.html_templates.phonePlaceholder);
    this.$element.find(FNAME).get(0).setAttribute('maxlength','40');
    this.$element.find(LNAME).get(0).setAttribute('maxlength','40');

    const validateInputs = (e) => {
      if (e.currentTarget.value.length == 40) {
        this.$element.find(e.currentTarget).css({
          'border-color': '#ff6d6d',
          '-webkit-box-shadow': '0 0 0 1px #ff6d6d',
          'box-shadow': '0 0 0 1px #ff6d6d'
        });
      } else {
        this.$element.find(e.currentTarget).css({
          'border-color': '#d9d9d9',
          '-webkit-box-shadow': 'none',
          'box-shadow': 'none'
        });
      }
    }

    this.$(document).on('keyup.checkout-custom', FNAME, validateInputs)
                    .on('keyup.checkout-custom', LNAME, validateInputs)
  }
}