function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function setCookie(name, value, days) {
  var d = new Date;
  d.setTime(d.getTime() + 24*60*60*1000*days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function remove_item(key) {
  event.preventDefault();
  var data = {
    quantity: 0,
    id: key
  }

  fetch(theme.routes.cartChange, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "same-origin",
    headers: {
        "Content-Type": "application/json"
    }
  }).then(e => e.json()).then(function(e) {
  if (422 === e.status || "bad_request" === e.status)
  ;
    document.dispatchEvent(new CustomEvent('cart:build'));
  }
  .bind(this));
}