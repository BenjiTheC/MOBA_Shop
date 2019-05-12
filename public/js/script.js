function addToCart(combinedId) {
  let itemId, ownerId;
  [itemId, ownerId] = combinedId.split("|");
  $.post(
    "/cart",
    { itemId, ownerId },
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

$("#itemimage").change(event => {
  // display the file name when choose a file
  console.log("in here itemimg");
  const filename = event.currentTarget.files[0].name;
  $("#itemimagelable").html(filename);
});
