$(document).ready(function() {
  var $team = $('.team');
  var $loading = $('.loading');
  var $body = $('body');
  var $nav = $('nav');
  var $container = $('.container-fluid');
  var $link = $('a');
  var $back = $('#back');

  $team.on('click', function() {
    hideElements($team, $nav);
    toggleLoadingClass($body, $loading);
  });

  $link.on('click', function() {
    hideElements($nav, $container);
    toggleLoadingClass($body, $loading);
  });

  $back.on('click', function() {
    goBack();
  });
});

function hideElements(teams, nav) {
  teams.hide();
  nav.hide();
}

function toggleLoadingClass(body, loading) {
  body.addClass('background');
  loading.removeClass('hidden');
}

function goBack() {
  window.history.back();
}
