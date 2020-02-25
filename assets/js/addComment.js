import axios from 'axios';

const addCommentForm = document.getElementById('jsAddComment');

const sendComment = async comment => {
  const videoId = window.location.pathname.split('/videos/')[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: 'POST',
    data: {
      comment
    }
  });
};

const handelSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector('input');
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = '';
};

const init = () => {
  addCommentForm.addEventListener('submit', handelSubmit);
};

if (addCommentForm) {
  init();
}
