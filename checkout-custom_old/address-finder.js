import { CustardModule, STEP_CONTACT_INFORMATION } from "@discolabs/custard-js";

export class AddressFinder extends CustardModule {

  id() {
    return 'address-finder';
  }

  steps() {
    return [STEP_CONTACT_INFORMATION];
  }

  selector() {
    return 'body';
  }

  setup() {
    this.$element.append(this.options.html_templates.cartItems);
  }

}