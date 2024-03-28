'use strict';
import { listen, select } from './utils.js';
import movies from './movies.js';

const searchInput = select(".search");
const searchButton = select('button');
const dropdownMenu = select('.dropdown-menu');

let dropdownCallback = function() {
  // Clear dropdown menu
  dropdownMenu.innerHTML = '';

  // Filter movies
  // The this keyword is the search input
  const keyword = this.value.toLowerCase();
  const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword));

  if (filteredMovies.length === 0) {
    // If no movies were found, show a "Movie not found" message
    const li = document.createElement('li');
    li.textContent = "Movie not found";
    dropdownMenu.appendChild(li);
  } else {
    // Populate dropdown menu
    filteredMovies.forEach(movie => {
      const li = document.createElement('li');
      li.textContent = movie.title;
      dropdownMenu.appendChild(li);

      // Add click event listener to li
      li.addEventListener('click', function() {
        // Set search input value to clicked li's text
        searchInput.value = this.textContent;
        // Clear dropdown menu
        dropdownMenu.innerHTML = '';
      });
    });
  }

  // Show dropdown menu
  dropdownMenu.style.display = 'block';

  // If search input field is cleared, hide dropdown menu
  if (!this.value) {
    dropdownMenu.style.display = 'none';
  }
};

listen('input', searchInput, dropdownCallback);

searchButton.addEventListener('click', function(event) {
  event.preventDefault();

  const movieContainer = document.querySelector('.movie-container');
  movieContainer.innerHTML = ''; // Clear the movieContainer

  const keyword = searchInput.value;
  const movie = movies.find(movie => movie.title.toLowerCase() === keyword.toLowerCase());

  if (movie) {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie-info'); // Add a class for styling

    const img = document.createElement('img');
    img.src = movie.poster;
    movieDiv.appendChild(img);

    const textDiv = document.createElement('div'); // Create a new div for the text information

    const title = document.createElement('h2');
    title.textContent = movie.title;
    textDiv.appendChild(title);

    const yearAndRunningTime = document.createElement('p');
    yearAndRunningTime.textContent = `${movie.year}, ${movie.runningTime}`;
    textDiv.appendChild(yearAndRunningTime);

    const description = document.createElement('p');
    description.textContent = movie.description;
    textDiv.appendChild(description);

    const genreList = document.createElement('ul');
    movie.genre.forEach(genre => {
      const li = document.createElement('li');
      li.textContent = genre;
      genreList.appendChild(li);
    });
    textDiv.appendChild(genreList);

    movieDiv.appendChild(textDiv); // Append the textDiv to the movieDiv

    movieContainer.appendChild(movieDiv); // Append to movieContainer instead of mainDiv
  }
});