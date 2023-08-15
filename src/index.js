import './style.css';
import 'bootstrap';
import { showApiUrl } from './modules/showsAPI.js';
import './assets/bg-for-page.jpg';
import getMoviesData from './modules/functionalities.js';

const renderMovies = async () => {
  const data = await getMoviesData(showApiUrl);
  data.sort(() => 0.5 - Math.random());
  data.length = 20;
  const movieContainer = document.getElementById('movieContainer');

  data.forEach(async (movie) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('col-md-3', 'col-sm-6', 'mb-4');
    movieCard.innerHTML = `
        <div class="card custom-card">
          <img src=${movie.image.medium} class="card-img-top" alt="images">
          <div class="card-body">
            <div  class="name-like-button">
               <div>
                <span class="card-title">${movie.name}</span>
               </div>
              <div  class="likeBtnContainer">
                <span class="likesCount${movie.id}">0</span>
                <span class="likeBtn" data-movie-id="${movie.id}">&#9825</span>
              </div>
            </div>
            <div class="card-button">
              <button type="button" 
                      class="btn   btn-small comment-button " 
                      data-bs-toggle="modal" 
                      data-bs-target="#commentModal-${movie.id}">
                Comment
              </button>
 
              <button type="button"  
                      class="btn  reservationBtn"  
                      id="${movie.id}" data-toggle="modal" data-target="#exampleModal-${movie.id}" >Reservations</button>
            </div>
          </div>
        </div>
      `;
    movieContainer.appendChild(movieCard);
  });
};

renderMovies();