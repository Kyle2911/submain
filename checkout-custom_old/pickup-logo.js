import { CustardModule, STEP_CONTACT_INFORMATION } from "@discolabs/custard-js";

export class PickupLogo extends CustardModule {

  id() {
    return 'pickup-logi';
  }

  steps() {
    return [STEP_CONTACT_INFORMATION];
  }

  selector() {
    return '[data-delivery-pickup-radio-label]';
  }

  setup() {
    this.$element.find('svg').remove();
    this.$element.prepend(this.options.html_templates.pickup_logo)
  }

}