import { Custard } from "@discolabs/custard-js";
import { changeMarketingText } from './marketing';
import { removeExisting } from './removeExistingLocaton';
import { pickUpList } from './pickuplist';
import { Payment } from './payment';
import { dropdownProvince } from './shipping_address';
window.custard = new Custard([changeMarketingText, removeExisting, pickUpList, Payment,dropdownProvince]);