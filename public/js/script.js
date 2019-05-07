function addToCart() {
  console.group();
  console.log("Button clicked");
  console.log("Add to Cart");
  console.groupEnd();
}

function buyItNow() {
  console.group();
  console.log("Button clicked");
  console.log("Add to Cart");
  console.groupEnd();
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
