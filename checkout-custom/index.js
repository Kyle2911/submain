import { Custard } from "@discolabs/custard-js";

import { PickupLogo } from "./pickup-logo";
import { ContactInformationInit } from "./contact-information";
import { ShippingAddress } from "./shipping-address";
import { BillingAddress } from "./billing-address";
import { CheckoutHelpText } from "./checkout-help-text";
import { ShippingInformation } from "./shipping-information";
import { Payment } from "./payment";
import { Confirmation } from "./confirmation";
import { GABCNoteForEmployee } from './gabc-note';
import { ValidateFLNames } from './validate-shipping-names';
import { Theme } from "./theme-custom";
Theme();
window.custard = new Custard([
  PickupLogo,
  CheckoutHelpText,
  ContactInformationInit,
  ShippingAddress,
  ShippingInformation,
  Payment,
  Confirmation,
  BillingAddress,
  GABCNoteForEmployee,
  ValidateFLNames
]);
