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

  if (area == "NCR") {
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
  }else{
    // Start date calculation
    let startDate = addDays(orderDate, 7);
    if (startDate.getDay() === 0) {
      startDate = addDays(startDate, 1 + 1); // If it's Sunday, add one more day
    }else{
     startDate = addDays(startDate, 1);
    }
    const start = formatDate(startDate);

    // End date calculation
    let endDate = addDays(startDate, 4);
    if (endDate.getDay() === 0) {
      endDate = addDays(endDate, 1); // If it's Sunday, add one more day
    }
    const end = formatDate(endDate);

    return start + " - " + end;
  }
}
