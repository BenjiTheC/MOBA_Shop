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

// itemInCart: req.session.cart.length,
// userAsset: user.userAsset

const placeOrder = event => {
  const totalPriceStr = $("#total-price")[0].innerText;
  const total = totalPriceStr.split(" ")[0];

  $.post(
    "/cart/purchase",
    { total },
    data => {
      const userAsset = data.userAsset;
      $("#items-in-cart").html(data.itemInCart);
      $("#user-asset").html(data.userAsset);
      $("#place-order").attr("class", "btn btn-lg btn-success text-light mb-3");
      $("#place-order").html("You order has been placed!");
    },
    "json"
  );
};

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

$(".reply-form").submit(function(e) {
  e.preventDefault();
  const formId = $(this).attr("id");
  const conId = formId.split("-")[1];
  const comment = $(this).find("textarea")[0].value;
  const posterId = $(".user-card").attr("id");

  $.ajax({
    type: "PUT",
    url: "/conversation",
    data: { conId, posterId, comment },
    dataType: "json",
    success: function(data) {
      const { conId, comment } = data;
      const posterName = $("#user-name")[0].innerText;

      const liB4TheForm = $(`#form-${conId}`)
        .parent()
        .prev();

      const conLst = $(`#con-${conId}`);
      const newComment = $(
        `<li class="list-group-item">${posterName}: ${comment}</li>`
      );
      newComment.insertAfter(liB4TheForm);
      $(`#txt-ara-${conId}`).val("");
    }
  });
});
