import { Custard } from "@discolabs/custard-js";

import { PickupLogo } from "./pickup-logo";
import { ContactInformationInit } from "./contact-information";
import { ShippingAddress } from "./shipping-address";
import { BillingAddress } from "./billing-address";
Theme();
window.custard = new Custard([
  PickupLogo,
  ContactInformationInit,
  ShippingAddress,
  BillingAddress
]);
