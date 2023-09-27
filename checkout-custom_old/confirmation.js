import { CustardModule, STEP_THANK_YOU, STEP_ORDER_STATUS } from "@discolabs/custard-js";

export class Confirmation extends CustardModule {

  id() {
    return 'confirmation';
  }

  steps() {
    return [STEP_THANK_YOU, STEP_ORDER_STATUS];
  }

  selector() {
    return '.step'
  }

  setup() {
    const mapSelector = '.map';
    const contentBoxRowSelector = '.content-box__row';
    const pickedDesc = '.os-step__description'

    this.$element.find(mapSelector).closest(contentBoxRowSelector).remove();
    if (this.options.attributes.pickup_store_title) {
      var template = this.options.html_templates.pickupInfo;
      var pickedTemplate = this.options.html_templates.picked_info;

      var $pickupInfoHeader = this.$(`h3.heading-3:contains(${window.translation.pickup_title})`);
      var $pickedDesc = this.$(pickedDesc);
      $pickupInfoHeader.html(window.translation.pickup_title);
      $pickupInfoHeader.next().replaceWith(template);
      $pickedDesc.html(pickedTemplate);
    }
  }

}