import './style.css';
import TypeIt from 'typeit';
import 'bootstrap';
import { showApiUrl } from './modules/showsAPI.js';
import navbarHamburgerToggler from './modules/navbar.js';
import { likeApi, commentApi, reservationApi } from './modules/involvementAPI.js';
import './assets/bg-for-page.jpg';
import './assets/button-menu.png';
import './assets/close-icon.svg';
import {
  getMoviesData,
  postLikes, postComment,
  getLikesForUnclick,
  fetchCommentsFromApi,
  renderComments,
  getLikes,
  postReservations,
  fetchReservations,
  renderReservations,
} from './modules/functionalities.js';

import { countComments, countReservations } from './modules/counter.js';

const renderMovies = async () => {
  const data = await getMoviesData(showApiUrl);
  data.sort(() => 0.5 - Math.random());
  data.length = 20;
  const numberOfLatestShows = data.length;
  const latestShowsLink = document.getElementById('latestShowsLink');
  latestShowsLink.innerHTML = `Latest Shows <span class="badge">(${numberOfLatestShows})</span>`;

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
                <span class="likeBtn" data-movie-id="${movie.id}">&nbsp;&#9825</span>
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
                    class="btn   btn-small reservation-button " 
                    data-bs-toggle="modal" 
                    data-bs-target="#reservationsModal-${movie.id}">
              Reservations
              </button>
            </div>
          </div>
        </div>
      `;

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = `commentModal-${movie.id}`;
    modal.setAttribute(
      'aria-labelledby',
      `exampleModalCenterTitle-${movie.id}`,
    );
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
    <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
         <div>
           <img src=${
  movie.image.medium
} class=" image-fluid" alt="popup image">
         </div>
         <div><h3>${movie.name}</h3></div>
         <div  class="movieSummary">${movie.summary}</div>
         <div  class="afterSummary">
           <div><h4>Genres: <span>${movie.genres.join(', ')}</span></h4> </div>
           <div><h4>Ratings:<span> ${movie.rating.average}</span></h4></div>
           <div><h4>Premiered: <span>${movie.premiered}</span></h4></div>
         </div>
         <div class="commentArea">
         </div>
         <div><span class="commentsCounter"></span></div>

         <div>
           <form  class="form">
           <h1>Comment</h1>
           
           <fieldset>
             <label for="name"></label>
             <input type="text"  placeholder="name" id="username-${
  movie.id
}" name="username">
             
             <label for="comment"></label>
             <textarea name="comment" max="100" id="comment-${
  movie.id
}" placeholder="Type comment"  rows="5"></textarea>
           </fieldset> 
           <button id="commentFormBtn-${
  movie.id
}"  class="commentFormBtn"  btn" type="submit">Submit</button>
        
           </form>

         </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
  
  `;
    movieContainer.appendChild(movieCard);

    document.body.appendChild(modal);

    // Adding previous comments the first time
    const comments = await fetchCommentsFromApi(movie.id);
    if (comments.length > 0) {
      renderComments(modal, comments);
      const commentsCounter = modal.querySelector('.commentsCounter');
      const numComments = countComments(movie.id, comments);
      commentsCounter.textContent = `Comments: ${numComments}`;
    }

    const commentForm = modal.querySelector(`#commentFormBtn-${movie.id}`);
    commentForm.addEventListener('click', async (event) => {
      event.preventDefault();

      const username = modal.querySelector(`#username-${movie.id}`).value;
      const comment = modal.querySelector(`#comment-${movie.id}`).value;

      await postComment(commentApi, movie.id, username, comment);

      modal.querySelector(`#username-${movie.id}`).value = '';
      modal.querySelector(`#comment-${movie.id}`).value = '';

      const comments = await fetchCommentsFromApi(movie.id);
      renderComments(modal, comments);
      const commentsCounter = modal.querySelector('.commentsCounter');
      const numComments = countComments(movie.id, comments);
      commentsCounter.textContent = `Comments: ${numComments}`;
    });

    document.body.appendChild(modal);

    // modal for reservations
    const modalReservations = document.createElement('div');
    modalReservations.classList.add('modal', 'fade');
    modalReservations.id = `reservationsModal-${movie.id}`;
    modalReservations.setAttribute('aria-labelledby', `exampleModalCenterTitle-${movie.id}`);
    modalReservations.setAttribute('aria-hidden', 'true');

    modalReservations.innerHTML = `
    <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
         <div>
           <img src=${movie.image.medium} class=" image-fluid" alt="popup image">
         </div>
         <div><h3>${movie.name}</h3></div>
         <div  class="movieSummary">${movie.summary}</div>
         <div  class="afterSummary">
         <div><h4>Geners: <span>${movie.genres.join(', ')}</span></h4> </div>
         <div><h4>Ratings:<span> ${movie.rating.average}</span></h4></div>
         <div><h4>Premiered: <span>${movie.premiered}</span></h4></div>
         </div>
         <div class="reservationtArea">
         </div>
         <div><span class="reservationsCounter"></span></div>
         <div>
           <form  class="form">
           <h1>Reservations</h1>
           <fieldset>
            <div>
                <label for="username"></label>
              <input type="text"  placeholder="name" id="username-${movie.id}" name="username">
            </div>
            <div>
              <label for="date_start"></label>
              <input type="date" id="date_start-${movie.id}" name="date_start">
           </div>
           <div>
           <input type="date" id="date_end-${movie.id}" name="date_end">
           <label for="date_end"></label>
           </div>
           </fieldset> 
            <button id="reserveFormBtn-${movie.id}"  class=" reserveFormBtn-${movie.id}   btn" type="submit">Reserve</button>
           </form>
         </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
  
  `;

    // Add event listener to revervations form
    const reservationForm = modalReservations.querySelector(`#reserveFormBtn-${movie.id}`);
    reservationForm.addEventListener('click', async (event) => {
      event.preventDefault();

      const username = modalReservations.querySelector(`#username-${movie.id}`).value;
      const dateStart = modalReservations.querySelector(`#date_start-${movie.id}`).value;
      const dateEnd = modalReservations.querySelector(`#date_end-${movie.id}`).value;

      await postReservations(reservationApi, movie.id, username, dateStart, dateEnd);

      // Clear the form inputs
      modalReservations.querySelector(`#username-${movie.id}`).value = '';
      modalReservations.querySelector(`#date_start-${movie.id}`).value = '';
      modalReservations.querySelector(`#date_end-${movie.id}`).value = '';

      const reservations = await fetchReservations(movie.id);
      renderReservations(modalReservations, reservations);
      const reservationsCounter = modalReservations.querySelector('.reservationsCounter');
      const numReservations = countReservations(movie.id, reservations);
      reservationsCounter.textContent = `Reservation: ${numReservations}`;
    });
    document.body.appendChild(modalReservations);

    const likeBtn = movieCard.querySelector('.likeBtn');
    let isLiked = false;

    likeBtn.addEventListener('click', async () => {
      if (isLiked) {
        likeBtn.innerHTML = '&#9825';
        isLiked = false;
        await getLikesForUnclick(movie.id);
      } else {
        likeBtn.innerHTML = '❤️';
        isLiked = true;
        await postLikes(movie.id, likeApi);
        await getLikes(movie.id);
      }
    });
    await getLikes(movie.id);
  });
};

const myTypeItInstance = new TypeIt('.type-effect', {
  strings: 'Enjoy!',
});

document.addEventListener('DOMContentLoaded', () => {
  myTypeItInstance.go();
  renderMovies();
  navbarHamburgerToggler();
});
