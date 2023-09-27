import { Custard } from "@discolabs/custard-js";

import { PickupLogo } from "./pickup-logo";
import { ContactInformationInit } from "./contact-information";
import { ShippingAddress } from "./shipping-address";
import { BillingAddress } from "./billing-address";
import { ShippingInformation } from "./shipping-information";
import { Payment } from "./payment";
window.custard = new Custard([
  PickupLogo,
  ContactInformationInit,
  ShippingAddress,
  ShippingInformation,
  Payment,
  BillingAddress,
]);
