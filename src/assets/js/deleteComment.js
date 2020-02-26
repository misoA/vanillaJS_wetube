import axios from 'axios';

const deleteBtns = document.querySelectorAll('.comments-list__delete');

const sendDeleteComment = async commentId => {
  const videoId = window.location.pathname.split('/videos/')[1];
  const response = await axios({
    url: `/api/${videoId}/${commentId}/delete`,
    method: 'POST'
  });
  console.log(response)

};

const handelClick = event => {
  event.preventDefault();
  sendDeleteComment(event.target.id);
};

const init = () => {
  deleteBtns.forEach(deleteBtn => {
    deleteBtn.addEventListener('click', handelClick);
  });
};

if (deleteBtns) {
  init();
}
