import { CustardModule, STEP_CONTACT_INFORMATION } from "@discolabs/custard-js";

export class GABCNoteForEmployee extends CustardModule {

  id() {
    return 'gabc-note';
  }

  steps() {
    return [STEP_CONTACT_INFORMATION];
  }

  selector() {
    return '[data-shipping-address]';
  }

  setup() {
    const EMAIL_INPUT_SELECTOR = '[name="checkout[email]"]';
    const checkIfEmployee = () => {
      const emailInput = this.$(EMAIL_INPUT_SELECTOR);
      if (emailInput.val().split('@').pop() == 'goldenabc.com') {
        if (this.$element.find('#section-delivery-title .gabc-note__container').length == 0) {
          this.$element.find('#section-delivery-title').append(this.options.html_templates.gabcNote);
        }
      } else {
        this.$element.find('.gabc-note__container').remove();
      }
    }
    this.$(document).on('page:change', checkIfEmployee)
                    .on('keyup.checkout-custom', EMAIL_INPUT_SELECTOR, checkIfEmployee)

    checkIfEmployee();
  }
}