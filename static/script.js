$(document).ready(function() {
  function toggleCollapse() {
    const sublist = $(this).children("ul");
    if (sublist.length) {
      sublist.toggleClass("collapsed");
    }
  }

  function addItem() {
    const newItem = $("<li><span class='item' contenteditable='true'>New Item</span></li>");
    $("#rootList").append(newItem);
  }

  $(document).on("click", "li", toggleCollapse);
  $("#addItemBtn").on("click", addItem);
});
