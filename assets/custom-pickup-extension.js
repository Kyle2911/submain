 function getReadyPickUp(orderDate,deliveryWeekName){

     
      const deliveryDateStore = deliveryWeekName;
      const baseDate =orderDate;

      const getBaseWeek = baseDate.getDay() - 1;
      const getBaseMonth = baseDate.getMonth();
      const getBaseYear = baseDate.getFullYear();
      const getBaseDate = baseDate.getDate();
      const day = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
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

      if (deliveryDateStore == "Monday") {
        switch (day[getBaseWeek]) {
          case "Monday":
            baseDate.setDate(getBaseDate + 10);
            break;
          case "Tuesday":
            baseDate.setDate(getBaseDate + 6+10);
            break;
          case "Wednesday":
            baseDate.setDate(getBaseDate + 5+10);
            break;
          case "Thursday":
            baseDate.setDate(getBaseDate + 4+10);
            break;
          case "Friday":
            baseDate.setDate(getBaseDate + 3+10);
            break;
          case "Saturday":
            baseDate.setDate(getBaseDate + 2+10);
            break;
          case "Sunday":
            baseDate.setDate(getBaseDate + 1+10);
            break;

          default:
            break;
        }
      } else if (deliveryDateStore == "Tuesday") {
        switch (day[getBaseWeek]) {
          case "Monday":
            baseDate.setDate(getBaseDate + 1+10);
            break;
          case "Tuesday":
            baseDate.setDate(getBaseDate + 10);
            break;
          case "Wednesday":
            baseDate.setDate(getBaseDate + 6+10);
            break;
          case "Thursday":
            baseDate.setDate(getBaseDate + 5+10);
            break;
          case "Friday":
            baseDate.setDate(getBaseDate + 4+10);
            break;
          case "Saturday":
            baseDate.setDate(getBaseDate + 3+10);
            break;
          case "Sunday":
            baseDate.setDate(getBaseDate + 2+10);
            break;

          default:
            break;
        }
      } else if (deliveryDateStore == "Wednesday") {
        switch (day[getBaseWeek]) {
          case "Monday":
            baseDate.setDate(getBaseDate + 2 + 10);
            break;
          case "Tuesday":
            baseDate.setDate(getBaseDate + 1 + 10);
            break;
          case "Wednesday":
            baseDate.setDate(getBaseDate + 10);
            break;
          case "Thursday":
            baseDate.setDate(getBaseDate + 6 + 10);
            break;
          case "Friday":
            baseDate.setDate(getBaseDate + 5 + 10);
            break;
          case "Saturday":
            baseDate.setDate(getBaseDate + 4 + 10);
            break;
          case "Sunday":
            baseDate.setDate(getBaseDate + 3 + 10);
            break;

          default:
            break;
        }
      } else if (deliveryDateStore == "Thursday") {
        switch (day[getBaseWeek]) {
          case "Monday":
            baseDate.setDate(getBaseDate + 3 + 10);
            break;
          case "Tuesday":
            baseDate.setDate(getBaseDate + 2 + 10);
            break;
          case "Wednesday":
            baseDate.setDate(getBaseDate + 1 + 10);
            break;
          case "Thursday":
            baseDate.setDate(getBaseDate + 10);
            break;
          case "Friday":
            baseDate.setDate(getBaseDate + 6 + 10);
            break;
          case "Saturday":
            baseDate.setDate(getBaseDate + 5 + 10);
            break;
          case "Sunday":
            baseDate.setDate(getBaseDate + 4 + 10);
            break;

          default:
            break;
        }
      } else if (deliveryDateStore == "Friday") {
        switch (day[getBaseWeek]) {
          case "Monday":
            baseDate.setDate(getBaseDate + 4 + 10);
            break;
          case "Tuesday":
            baseDate.setDate(getBaseDate + 3 + 10);
            break;
          case "Wednesday":
            baseDate.setDate(getBaseDate + 2 + 10);
            break;
          case "Thursday":
            baseDate.setDate(getBaseDate + 1 + 10);
            break;
          case "Friday":
            baseDate.setDate(getBaseDate + 10);
            break;
          case "Saturday":
            baseDate.setDate(getBaseDate + 6 + 10);
            break;
          case "Sunday":
            baseDate.setDate(getBaseDate + 5 + 10);
            break;

          default:
            break;
        }
      } else if (deliveryDateStore == "Saturday") {
        switch (day[getBaseWeek]) {
          case "Monday":
            baseDate.setDate(getBaseDate + 5 + 10);
            break;
          case "Tuesday":
            baseDate.setDate(getBaseDate + 4 + 10);
            break;
          case "Wednesday":
            baseDate.setDate(getBaseDate + 3 + 10);
            break;
          case "Thursday":
            baseDate.setDate(getBaseDate + 2 + 10);
            break;
          case "Friday":
            baseDate.setDate(getBaseDate + 1 + 10);
            break;
          case "Saturday":
            baseDate.setDate(getBaseDate + 10);
            break;
          case "Sunday":
            baseDate.setDate(getBaseDate + 6 + 10);
            break;

          default:
            break;
        }
      } else if (deliveryDateStore == "Sunday") {
        switch (day[getBaseWeek]) {
          case "Monday":
            baseDate.setDate(getBaseDate + 6 + 10);
            break;
          case "Tuesday":
            baseDate.setDate(getBaseDate + 5 + 10);
            break;
          case "Wednesday":
            baseDate.setDate(getBaseDate + 4 + 10);
            break;
          case "Thursday":
            baseDate.setDate(getBaseDate + 3 + 10);
            break;
          case "Friday":
            baseDate.setDate(getBaseDate + 2 + 10);
            break;
          case "Saturday":
            baseDate.setDate(getBaseDate + 1 + 10);
            break;
          case "Sunday":
            baseDate.setDate(getBaseDate + 10);
            break;

          default:
            break;
        }
      }

     return   months[baseDate.getMonth()] + " " + baseDate.getDate() + ", " + baseDate.getFullYear()
    }