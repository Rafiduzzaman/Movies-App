const getMoviesData = async (url) => {
  try {
    const fetchedData = await fetch(url);
    const data = await fetchedData.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
const postLikes = async (movieId, api) => {
  try {
    const data = {
      item_id: movieId,
    };

    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to post likes');
    }
  } catch (error) {
    throw new Error(error);
  }
};
const getLikes = async (movieId) => {
  const response = await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/1lQTFOEu5O5KmM8n2meG/likes');
  if (!response) {
    throw new Error('Failed to fetched');
  }
  const data = await response.json();
  const foundMovie = data.filter((movie) => movie.item_id === movieId);
  foundMovie.forEach((item) => {
    const likesCountContainer = document.querySelector(`.likesCount${movieId}`);
    const countNum = item ? item.likes : 0;
    likesCountContainer.textContent = countNum;
  });
};

const getLikesForUnclick = async (movieId) => {
  const response = await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/1lQTFOEu5O5KmM8n2meG/likes');
  if (!response) {
    throw new Error('Failed to fetched');
  }
  const data = await response.json();
  const foundMovie = data.filter((movie) => movie.item_id === movieId);
  foundMovie.forEach((item) => {
    const likesCountContainer = document.querySelector(`.likesCount${movieId}`);
    const countNum = item ? item.likes : 0;
    likesCountContainer.textContent = countNum - 1;
  });
};

const postComment = async (api, movieId, username, comment) => {
  try {
    const data = {
      item_id: movieId,
      username,
      comment,
    };

    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to post comments');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const fetchCommentsFromApi = async (movieId) => {
  try {
    const response = await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/1lQTFOEu5O5KmM8n2meG/comments?item_id=${movieId}`);
    const comments = await response.json();
    return comments;
  } catch (error) {
    throw new Error(error);
  }
};

const renderComments = (modal, comments) => {
  const commentArea = modal.querySelector('.commentArea');
  commentArea.innerHTML = '';

  comments.forEach((comment) => {
    const commentDiv = document.createElement('div');
    commentDiv.textContent = `${comment.creation_date}:${comment.username}: ${comment.comment}`;
    commentArea.appendChild(commentDiv);
  });
};

const renderReservations = (modalReservations, reservations) => {
  const reservationArea = modalReservations.querySelector('.reservationtArea');
  reservationArea.innerHTML = '';

  // Render the comments in the modal
  reservations.forEach((reservation) => {
    const reservationsDiv = document.createElement('div');
    reservationsDiv.textContent = `${reservation.username}:  ${reservation.date_start} - ${reservation.date_end}`;
    reservationArea.appendChild(reservationsDiv);
  });
};

// Function to create a reservation
const postReservations = async (api, movieId, username, dateStart, dateEnd) => {
  try {
    const data = {
      item_id: movieId,
      username,
      date_start: dateStart,
      date_end: dateEnd,
    };

    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to post reservation');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const fetchReservations = async (itemId) => {
  try {
    const response = await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/1lQTFOEu5O5KmM8n2meG/reservations?item_id=${itemId}`);
    const reservations = await response.json();
    return reservations;
  } catch (error) {
    throw new Error(error);
  }
};

export {
  getMoviesData,
  postLikes,
  getLikes,
  postComment,
  fetchReservations,
  renderReservations,
  postReservations,
  fetchCommentsFromApi,
  renderComments,
  getLikesForUnclick,
};