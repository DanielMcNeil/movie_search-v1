'use strict()';

var searchTerm;
var searchYear;

// ajax request on search form submission
$('.search-form').submit(function(event) {
  event.preventDefault();
  // clear description page if a search is sent from there
  $('#descriptionContainer').html('');
  $('#descriptionContainer').addClass('is-hidden');
  $('#movieContainer').removeClass('is-hidden');
  // ajax request
  var url = 'http://www.omdbapi.com/?r=json&plot=full&';
  searchTerm = $('#search').prop('value');
  url += 's=' + searchTerm;
  searchYear = $('#year').prop('value');
  if (searchYear !== '') {
    url += '&y=' + searchYear;
  }
  $.getJSON(url,movies);
});

// callback for ajax request
// create code block to display search results on the screen
var movies = function(data) {
  console.log(data);
  var codeBlock = '';
  // if search was not completed for some reason
  if (data.Response === 'False' && data.Error !== 'Movie not found!') {
    codeBlock += '<p class="no-movies">Sorry, but we were unable to process your search.<br>';
    codeBlock += data.Error + '</p>';
  // if no results were found
  } else if (data.Error === 'Movie not found!') {
    codeBlock += '<li class="no-movies">';
    codeBlock += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchTerm + ' for the year ' + searchYear + '.';
    codeBlock += '</li>';
  } else {
    $.each(data.Search,function(index,movie) {
      codeBlock += '<li>';
      codeBlock += '<div class="poster-wrap">';
      // if there's no movie poster
      if (movie.Poster === 'N/A') {
        codeBlock += '<i class="material-icons poster-placeholder">crop_original</i>';
      } else {
        codeBlock += '<img class="movie-poster" src="' + movie.Poster + '">';
      }
      codeBlock += '</div>';
      codeBlock += '<span class="movie-title">' + movie.Title + '</span>';
      codeBlock += '<span class="movie-year">' + movie.Year + '</span>';
      // imbd id is used to make a ajax request for the description page
      codeBlock += '<p id="imdbid" class="is-hidden">' + movie.imdbID + '</p>';
      codeBlock += '</li>';
    });
  }
  $('#movies').html(codeBlock);
  profileLink();
};

// set click event which will create an ajax request for additional data when a movie is clicked
// and then create the description page
var profileLink = function() {
  $('#movies li').click(function() {
    var id = $(this).find('p').html();
    var url = 'http://omdbapi.com/?i=' + id + '&plot=full&r=json';
    $.getJSON(url,descriptionPage);
  });
};

// callback for the description page
// creates code block to render the description page on the screen
var descriptionPage = function(data) {
  var descriptionHTML = '<div class="description-left">';
  descriptionHTML += '<p class="back-to-search">< <span>Search results</span></p>';
  descriptionHTML += '<img class="description-poster" src="' + data.Poster + '" alt="Poster for ' + data.Title + '">';
  descriptionHTML += '</div>';
  descriptionHTML += '<div class="description-right">';
  descriptionHTML += '<p class="description-title">' + data.Title + ' (' + data.Year + ')</p>';
  descriptionHTML += '<p class="description-rating">IMDB Rating: ' + data.imdbRating + '</p>';
  descriptionHTML += '<p class="description-plot-title">Plot Synopsis:</p>';
  descriptionHTML += '<p class="description-plot">' + data.Plot + '</p>';
  descriptionHTML += '<a class="description-link" href="http://www.imdb.com/title/' + data.imdbID + '/">View on IMDB</a>';
  descriptionHTML += '</div>';
  $('#descriptionContainer').html(descriptionHTML);
  // after rendering description page, show description page and hide search page
  $('#descriptionContainer').removeClass('is-hidden');
  $('#movieContainer').addClass('is-hidden');
  // when 'back to search results' is clicked, delete description page, hide description page, and show search page
  $('.back-to-search').click(function() {
    $('#descriptionContainer').html('');
    $('#descriptionContainer').addClass('is-hidden');
    $('#movieContainer').removeClass('is-hidden');
  });
};