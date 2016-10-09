'use strict';

var searchTerm;
var searchYear;

$('.search-form').submit(function(event) {
  event.preventDefault();
  $('#descriptionContainer').html('');
  $('#descriptionContainer').addClass('is-hidden');
  $('#movieContainer').removeClass('is-hidden');
  var url = 'http://www.omdbapi.com/?r=json&plot=full&'
  searchTerm = $('#search').prop('value');
  url += 's=' + searchTerm;
  searchYear = $('#year').prop('value');
  if (searchYear !== '') {
    url += '&y=' + searchYear;
  }
  $.getJSON(url,movies);
});

var movies = function(data) {
  console.log(data);
  var codeBlock = '';
  if (data.Response === 'False' && data.Error !== 'Movie not found!') {
    codeBlock += '<p class="no-movies">Sorry, but we were unable to process your search.<br>';
    codeBlock += data.Error + '</p>'
  } else if (data.Error === 'Movie not found!') {
    codeBlock += '<li class="no-movies">';
    codeBlock += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchTerm + ' for the year ' + searchYear + '.';
    codeBlock += '</li>';
  } else {
    $.each(data.Search,function(index,movie) {
      codeBlock += '<li>';
      codeBlock += '<div class="poster-wrap">';
      if (movie.Poster === 'N/A') {
        codeBlock += '<i class="material-icons poster-placeholder">crop_original</i>'
      } else {
        codeBlock += '<img class="movie-poster" src="' + movie.Poster + '">';
      }
      codeBlock += '</div>';
      codeBlock += '<span class="movie-title">' + movie.Title + '</span>';
      codeBlock += '<span class="movie-year">' + movie.Year + '</span>';
      codeBlock += '<p id="imdbid" class="is-hidden">' + movie.imdbID + '</p>';
      codeBlock += '</li>';
    });
  }
  $('#movies').html(codeBlock);
  profileLink();
};

var profileLink = function() {
  $('#movies li').click(function() {
    var id = $(this).find('p').html();
    var url = 'http://omdbapi.com/?i=' + id + '&plot=full&r=json';
    $.getJSON(url,descriptionPage);
  });
};

var descriptionPage = function(data) {
  var descriptionHTML = '<p class="back-to-search">< <span>Search results</span></p>';
  descriptionHTML += '<img class="description-poster" src="' + data.Poster + '" alt="Poster for ' + data.Title + '">';
  descriptionHTML += '<p class="description-title">' + data.Title + ' (' + data.Year + ')</p>';
  descriptionHTML += '<p class="description-rating">IMDB Rating: ' + data.imdbRating + '</p>'
  descriptionHTML += '<div class="main-content description-container-bottom">';
  descriptionHTML += '<p class="description-plot-title">Plot Synopsis:</p>';
  descriptionHTML += '<p class="description-plot">' + data.Plot + '</p>';
  descriptionHTML += '<a class="description-link" href="http://www.imdb.com/title/' + data.imdbID + '/">View on IMDB</a>';
  descriptionHTML += '</div>'
  $('#descriptionContainer').html(descriptionHTML);
  $('#descriptionContainer').removeClass('is-hidden');
  $('#movieContainer').addClass('is-hidden');
  $('.back-to-search').click(function() {
    $('#descriptionContainer').html('');
    $('#descriptionContainer').addClass('is-hidden');
    $('#movieContainer').removeClass('is-hidden');
  });
};
           
              
            
            
            
           