'use strict';
import { listen, select } from './utils.js';
import movies from './movies.js';

const searchInput = select(".search");
const searchButton = select('button');
const dropdownMenu = select('.dropdown-menu');

/*
==========================================
INPUT FIELD FUNCTIONALITY
==========================================
*/

// Function to create a list item with given text
function createListItem(text) {
  const li = document.createElement('li');
  li.textContent = text;
  return li;
}

// Function to handle click event on list item
function handleListItemClick() {
  searchInput.value = this.textContent;
  dropdownMenu.innerHTML = '';
  dropdownMenu.classList.remove('visible');
}

// Function to populate dropdown menu with given movies
function populateDropdownMenu(movies) {
  movies.forEach(movie => {
    const li = createListItem(movie.title);
    li.addEventListener('click', handleListItemClick);
    dropdownMenu.appendChild(li);
  });
}

// Callback function for search input event listener
let dropdownCallback = function() {
  dropdownMenu.innerHTML = '';

  const keyword = this.value.toLowerCase();
  const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword));

  if (filteredMovies.length > 0) {
    populateDropdownMenu(filteredMovies);
    dropdownMenu.classList.add('visible');
  } else {
    dropdownMenu.appendChild(createListItem("Movie not found"));
    dropdownMenu.classList.add('visible');
  }

  dropdownMenu.style.display = this.value ? 'block' : 'none';
};

// Adding event listener to search input
listen('input', searchInput, dropdownCallback);

/*
==========================================
SEARCH BUTTON FUNCTIONALITY
==========================================
*/

// Function to create an element with given tag, text, and parent
function createElement(tag, text, parent) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (parent) parent.appendChild(element);
  return element;
}

// Function to create a button with given icon class, text, and parent
function createButton(iconClass, text, parent) {
  const button = createElement('button', null, parent);
  button.innerHTML = `<i class="${iconClass}"></i> ${text}`;
  return button;
}

// Function to create and append movie elements to the movie container
function createMovieElements(movie, movieContainer) {
  const movieDiv = createElement('div', null, movieContainer);
  movieDiv.classList.add('movie-info');

  const img = createElement('img', null, movieDiv);
  img.src = movie.poster;

  const textDiv = createElement('div', null, movieDiv);

  createElement('h2', movie.title, textDiv);
  createElement('p', `${movie.year} | ${movie.runningTime}`, textDiv);
  createElement('p', movie.description, textDiv);

  const genreList = createElement('ul', null, textDiv);
  movie.genre.forEach(genre => createElement('li', genre, genreList));

  const downloadButtonDiv = createElement('div', null, textDiv);
  downloadButtonDiv.classList.add('download-button-div');

  createButton('fas fa-download', 'Torrent Download', downloadButtonDiv);
  createButton('fas fa-magnet', 'Magnet Download', downloadButtonDiv);
}

// Add a click event listener to the search button to search for a movie and display its details
listen('click', searchButton, function(event) {
  event.preventDefault();

  const movieContainer = select('.movie-container');
  movieContainer.innerHTML = '';

  const keyword = searchInput.value.toLowerCase();
  const movie = movies.find(movie => movie.title.toLowerCase() === keyword);

  if (movie) {
    createMovieElements(movie, movieContainer);
  }

  dropdownMenu.classList.remove('visible');
});