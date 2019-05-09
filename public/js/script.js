function addToCart(itemId) {
  $.post(
    "/cart",
    { itemId },
    function(data, textStatus, jqXHR) {
      console.log(data);
    },
    "json"
  );
  // $.ajax({
  //   type: "POST",
  //   url: "/cart",
  //   data: { itemId },
  //   async: false,
  //   dataType: "json",
  //   success: res => {
  //     console.log("successfully get somthing");
  //     console.log(res.responseTex);
  //   },
  //   error: res => {
  //     console.log(res);
  //   }
  // });
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
