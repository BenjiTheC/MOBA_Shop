function addToCart(itemId) {
  $.post(
    "/cart",
    { itemId },
    data => {
      $("#items-in-cart").html(data.itemInCart);
    },
    "json"
  );
}

if ($("#passwordNotMatch").length > 0) {
  $("#password").css("border", "2px solid red");
  $("#confirmPassword").css("border", "2px solid red");
}

$("#password").change(function(e) {
  e.preventDefault();
  $(this).css("border", "1px solid #ced4da");
});

$("#confirmPassword").change(function(e) {
  e.preventDefault();
  $(this).css("border", "1px solid #ced4da");
});
