const getMoviesData = async (url) => {
  try {
    const fetchedData = await fetch(url);
    const data = await fetchedData.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// comments
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

  // Render the comments in the modal
  comments.forEach((comment) => {
    const commentDiv = document.createElement('div');
    commentDiv.textContent = `${comment.creation_date}:${comment.username}: ${comment.comment}`;
    commentArea.appendChild(commentDiv);
  });
};

export {
  getMoviesData, postComment, fetchCommentsFromApi, renderComments,
};