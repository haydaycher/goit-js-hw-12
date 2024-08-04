import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const API_KEY = '45161707-c900d4c58d729c828a58b7932';
const BASE_URL = 'https://pixabay.com/api/';

const spinner = document.querySelector('.js-loader');
const moreSpinner = document.querySelector('.js-loader-more');

function showSpinner() {
  spinner.style.display = 'flex';
}

export function hideSpinner() {
  spinner.style.display = 'none';
}

function showMoreSpinner() {
  moreSpinner.style.display = 'flex';
}

export function hideMoreSpinner() {
  moreSpinner.style.display = 'none';
}

export async function fetchImages(query, page = 1) {
  const url = new URL(BASE_URL);
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('q', query);
  url.searchParams.set('image_type', 'photo');
  url.searchParams.set('orientation', 'horizontal');
  url.searchParams.set('safesearch', 'true');
  url.searchParams.set('page', page);
  url.searchParams.set('per_page', 15);

  showMoreSpinner();

  try {
    const response = await axios.get(url.toString());
    if (response.status !== 200) {
      throw new Error('Network response was not ok');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images.',
      position: 'topRight',
    });
    throw error;
  } finally {
    hideMoreSpinner();
  }
}
