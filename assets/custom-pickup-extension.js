function getReadyPickUp(orderDate,area){
     baseDate =orderDate;
  const getBaseDate = baseDate.getDate();
        const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
  
    if(area == 'NCR'){
        min = baseDate.setDate(getBaseDate + 4);
        max = baseDate.setDate(getBaseDate + 12);
    }else if(area == 'LUZON'){
        min = baseDate.setDate(getBaseDate + 8);
        max = baseDate.setDate(getBaseDate + 15);
    }
  
  return months[baseDate.getMonth()] + " " + baseDate.getDate() + ", " + baseDate.getFullYear()
}

// function getReadyPickUp(orderDate,deliveryWeekName){

 //      const intervalValue=10;
 //      const deliveryDateStore = deliveryWeekName;
 //      const baseDate =orderDate;
 //      const conditionData = baseDate.getDay() - 1;
 //      if(conditionData < 0){
 //         getBaseWeek = baseDate.getDay() + 6;
 //      }else{
 //         getBaseWeek = conditionData;
 //      }
  
 //      const getBaseMonth = baseDate.getMonth();
 //      const getBaseYear = baseDate.getFullYear();
 //      const getBaseDate = baseDate.getDate();
 //      const day = [
 //        "Monday",
 //        "Tuesday",
 //        "Wednesday",
 //        "Thursday",
 //        "Friday",
 //        "Saturday",
 //        "Sunday",
 //      ];
 //      const months = [
 //        "January",
 //        "February",
 //        "March",
 //        "April",
 //        "May",
 //        "June",
 //        "July",
 //        "August",
 //        "September",
 //        "October",
 //        "November",
 //        "December",
 //      ];
 //      if (deliveryDateStore == "Monday") {
 //        switch (day[getBaseWeek]) {
 //          case "Monday":
 //            baseDate.setDate(getBaseDate + 7);
 //            break;
 //          case "Tuesday":
 //            baseDate.setDate(getBaseDate + 6 + intervalValue);
 //            break;
 //          case "Wednesday":
 //            baseDate.setDate(getBaseDate + 5 + intervalValue);
 //            break;
 //          case "Thursday":
 //            baseDate.setDate(getBaseDate + 4 + intervalValue);
 //            break;
 //          case "Friday":
 //            baseDate.setDate(getBaseDate + 3 + intervalValue);
 //            break;
 //          case "Saturday":
 //            baseDate.setDate(getBaseDate + 2 + intervalValue);
 //            break;
 //          case "Sunday":
 //            baseDate.setDate(getBaseDate + 1 + intervalValue);
 //            break;

 //          default:
 //            break;
 //        }
 //      } else if (deliveryDateStore == "Tuesday") {
 //        switch (day[getBaseWeek]) {
 //          case "Monday":
 //            baseDate.setDate(getBaseDate + 1 + intervalValue);
 //            break;
 //          case "Tuesday":
 //            baseDate.setDate(getBaseDate + 7);
 //            break;
 //          case "Wednesday":
 //            baseDate.setDate(getBaseDate + 6 + intervalValue);
 //            break;
 //          case "Thursday":
 //            baseDate.setDate(getBaseDate + 5 + intervalValue);
 //            break;
 //          case "Friday":
 //            baseDate.setDate(getBaseDate + 4 + intervalValue);
 //            break;
 //          case "Saturday":
 //            baseDate.setDate(getBaseDate + 3 + intervalValue);
 //            break;
 //          case "Sunday":
 //            baseDate.setDate(getBaseDate + 2 + intervalValue);
 //            break;

 //          default:
 //            break;
 //        }
 //      } else if (deliveryDateStore == "Wednesday") {
 //        switch (day[getBaseWeek]) {
 //          case "Monday":
 //            baseDate.setDate(getBaseDate + 2 + intervalValue);
 //            break;
 //          case "Tuesday":
 //            baseDate.setDate(getBaseDate + 1 + intervalValue);
 //            break;
 //          case "Wednesday":
 //            baseDate.setDate(getBaseDate + 7);
 //            break;
 //          case "Thursday":
 //            baseDate.setDate(getBaseDate + 6 + intervalValue);
 //            break;
 //          case "Friday":
 //            baseDate.setDate(getBaseDate + 5 + intervalValue);
 //            break;
 //          case "Saturday":
 //            baseDate.setDate(getBaseDate + 4 + intervalValue);
 //            break;
 //          case "Sunday":
 //            baseDate.setDate(getBaseDate + 3 + intervalValue);
 //            break;

 //          default:
 //            break;
 //        }
 //      } else if (deliveryDateStore == "Thursday") {
 //        switch (day[getBaseWeek]) {
 //          case "Monday":
 //            baseDate.setDate(getBaseDate + 3 + intervalValue);
 //            break;
 //          case "Tuesday":
 //            baseDate.setDate(getBaseDate + 2 + intervalValue);
 //            break;
 //          case "Wednesday":
 //            baseDate.setDate(getBaseDate + 1 + intervalValue);
 //            break;
 //          case "Thursday":
 //            baseDate.setDate(getBaseDate + 7);
 //            break;
 //          case "Friday":
 //            baseDate.setDate(getBaseDate + 6 + intervalValue);
 //            break;
 //          case "Saturday":
 //            baseDate.setDate(getBaseDate + 5 + intervalValue);
 //            break;
 //          case "Sunday":
 //            baseDate.setDate(getBaseDate + 4 + intervalValue);
 //            break;

 //          default:
 //            break;
 //        }
 //      } else if (deliveryDateStore == "Friday") {
 //        switch (day[getBaseWeek]) {
 //          case "Monday":
 //            baseDate.setDate(getBaseDate + 4 + intervalValue);
 //            break;
 //          case "Tuesday":
 //            baseDate.setDate(getBaseDate + 3 + intervalValue);
 //            break;
 //          case "Wednesday":
 //            baseDate.setDate(getBaseDate + 2 + intervalValue);
 //            break;
 //          case "Thursday":
 //            baseDate.setDate(getBaseDate + 1 + intervalValue);
 //            break;
 //          case "Friday":
 //            baseDate.setDate(getBaseDate + 7);
 //            break;
 //          case "Saturday":
 //            baseDate.setDate(getBaseDate + 6 + intervalValue);
 //            break;
 //          case "Sunday":
 //            baseDate.setDate(getBaseDate + 5 + intervalValue);
 //            break;

 //          default:
 //            break;
 //        }
 //      } else if (deliveryDateStore == "Saturday") {
 //        switch (day[getBaseWeek]) {
 //          case "Monday":
 //            baseDate.setDate(getBaseDate + 5 + intervalValue);
 //            break;
 //          case "Tuesday":
 //            baseDate.setDate(getBaseDate + 4 + intervalValue);
 //            break;
 //          case "Wednesday":
 //            baseDate.setDate(getBaseDate + 3 + intervalValue);
 //            break;
 //          case "Thursday":
 //            baseDate.setDate(getBaseDate + 2 + intervalValue);
 //            break;
 //          case "Friday":
 //            baseDate.setDate(getBaseDate + 1 + intervalValue);
 //            break;
 //          case "Saturday":
 //            baseDate.setDate(getBaseDate + 7);
 //            break;
 //          case "Sunday":
 //            baseDate.setDate(getBaseDate + 6 + intervalValue);
 //            break;

 //          default:
 //            break;
 //        }
 //      } else if (deliveryDateStore == "Sunday") {
 //        switch (day[getBaseWeek]) {
 //          case "Monday":
 //            baseDate.setDate(getBaseDate + 6 + intervalValue);
 //            break;
 //          case "Tuesday":
 //            baseDate.setDate(getBaseDate + 5 + intervalValue);
 //            break;
 //          case "Wednesday":
 //            baseDate.setDate(getBaseDate + 4 + intervalValue);
 //            break;
 //          case "Thursday":
 //            baseDate.setDate(getBaseDate + 3 + intervalValue);
 //            break;
 //          case "Friday":
 //            baseDate.setDate(getBaseDate + 2 + intervalValue);
 //            break;
 //          case "Saturday":
 //            baseDate.setDate(getBaseDate + 1 + intervalValue);
 //            break;
 //          case "Sunday":
 //            baseDate.setDate(getBaseDate + 7);
 //            break;

 //          default:
 //            break;
 //        }
 //      }

 //     return months[baseDate.getMonth()] + " " + baseDate.getDate() + ", " + baseDate.getFullYear()
 //    }