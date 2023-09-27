import { CustardModule, STEP_CONTACT_INFORMATION } from "@discolabs/custard-js";

export class CheckoutHelpText extends CustardModule {
  id() {
    return "checkout-help-text";
  }

  steps() {
    return [STEP_CONTACT_INFORMATION];
  }

  selector() {
    return ".section--contact-information > .section__header";
  }

  setup() {
    this.$element.append(this.options.html_templates.checkoutHelpText);
  }
}
