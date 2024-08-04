import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { fetchImages, hideSpinner, hideMoreSpinner } from './js/pixabay-api';
import { renderImages } from './js/render-functions';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const searchForm = document.getElementById('searchForm');
  const gallery = document.getElementById('gallery');
  const loadMoreBtn = document.getElementById('loadMoreButton');

  let currentPage = 1;
  let currentQuery = '';
  let totalHits = 0;

  const originalPlaceholder = searchInput.getAttribute('placeholder');

  searchInput.addEventListener('focus', () => {
    searchInput.setAttribute('data-placeholder', originalPlaceholder);
    searchInput.setAttribute('placeholder', '');
  });

  searchInput.addEventListener('blur', () => {
    searchInput.setAttribute('placeholder', originalPlaceholder);
  });

  searchForm.addEventListener('submit', async event => {
    event.preventDefault();
    const searchValue = searchInput.value.trim();

    if (searchValue === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search term.',
        position: 'topRight',
      });
      return;
    }

    gallery.innerHTML = '';
    currentQuery = searchValue;
    currentPage = 1;
    loadMoreBtn.style.display = 'none';

    try {
      const data = await fetchImages(currentQuery, currentPage);
      totalHits = data.totalHits;

      if (data.hits.length === 0) {
        iziToast.info({
          title: 'No Results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      } else {
        iziToast.success({
          title: 'Success',
          message: `Found ${totalHits} images.`,
          position: 'topRight',
        });

        renderImages(data.hits);
        loadMoreBtn.style.display =
          gallery.children.length < totalHits ? 'block' : 'none';
      }
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: 'Failed to fetch images.',
        position: 'topRight',
      });
    }
    searchInput.value = '';
  });

  loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    try {
      const data = await fetchImages(currentQuery, currentPage);
      renderImages(data.hits);

      if (gallery.children.length >= totalHits) {
        loadMoreBtn.style.display = 'none';
        iziToast.info({
          title: 'End of Results',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }

      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: 'Failed to fetch images.',
        position: 'topRight',
      });
    }
  });
});
