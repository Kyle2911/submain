    function getReadyPickUp(orderDate, area) {
  const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  };

  const formatDate = (date) => {
    return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  };

  if (area === "NCR") {
    // Start date calculation
    let startDate = addDays(orderDate, 5);
    if (startDate.getDay() === 0) {
      startDate = addDays(startDate, 1 + 1); // If it's Sunday, add one more day
    }else{
     startDate = addDays(startDate, 1);
    }
    const start = formatDate(startDate);

    // End date calculation
    let endDate = addDays(startDate, 2);
    if (endDate.getDay() === 0) {
      endDate = addDays(endDate, 1); // If it's Sunday, add one more day
    }
    const end = formatDate(endDate);

 return start + " - " + end;
  }
  if (area === "LUZON") {
    // Start date calculation
    let startDate = addDays(orderDate, 7);
    if (startDate.getDay() === 0) {
      startDate = addDays(startDate, 1 + 1); // If it's Sunday, add one more day
    }else{
     startDate = addDays(startDate, 1);
    }
    const start = formatDate(startDate);

    // End date calculation
    let endDate = addDays(startDate, 5);
    if (endDate.getDay() === 0) {
      endDate = addDays(endDate, 1); // If it's Sunday, add one more day
    }
    const end = formatDate(endDate);

    return start + " - " + end;
  }
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