$(document).ready(function() {
  var $back = $('#back');

  $back.on('click', function() {
    goBack();
  });
});

function goBack() {
  window.history.back();
}
