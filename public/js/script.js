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
      const placeOrderBtn = $("#place-order");
      placeOrderBtn.attr("class", "btn btn-lg btn-success mb-3");
      placeOrderBtn.html("You order has been placed!");
      placeOrderBtn.attr("onclick", "");
      placeOrderBtn.css("color", "#000");
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

      const newComment = $(
        `<li class="list-group-item d-flex align-items-center">
        <span class="fas fa-angle-double-right"></span>
        &nbsp;&nbsp;&nbsp;${comment}
        <span class="btn-group ml-auto">
          <span class="btn btn-outline-dark">By: </span>
          <span class="btn btn-dark text-light text-left">${posterName}</span>
        </span>
      </li>`
      );
      newComment.insertAfter(liB4TheForm);
      $(`#txt-ara-${conId}`).val("");
    }
  });
});
