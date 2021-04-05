const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const panel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')

const movies = []
// api request
axios.get(INDEX_URL)
  .then(res => {
    const movieList = res.data.results
    movies.push(...movieList)
    renderMovieCard(movies)
    // console.log(movies)
  })
  .catch(err => {
    console.log(err)
  })


panel.addEventListener('click', function onPanelClicked(event) {
    const target = event.target
    if (target.matches('.btn-show-movie')) {
      showMovieDescription(Number(target.dataset.id))
  } else if (target.matches('.btn-add-favorite')) {
    addToFavorite(Number(target.dataset.id))
  }

  function addToFavorite(id) {
    const favoriteList = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find((movie) => movie.id === id)

    if (favoriteList.some(movie => movie.id === id)) {
      alert('The movie is already in the list.')
    }
    favoriteList.push(movie)
    console.log(favoriteList)
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList))
  }

  function showMovieDescription(id) {
    axios.get(INDEX_URL + id)
      .then(res => {
        showMovieModal(res.data.results)
      })
      .catch(err => {
        console.error(err);
      })

    function showMovieModal(data) {
      const title = document.querySelector('#movie-modal-title')
      const poster = document.querySelector('#movie-modal-image > img')
      const date = document.querySelector('#movie-modal-date')
      const desc = document.querySelector('#movie-modal-description')

      title.textContent = data.title
      poster.src = POSTER_URL + data.image
      date.textContent = `release at ${data.release_date}`
      desc.textContent = data.description
    }
  }
})

searchForm.addEventListener('submit', function onSearchSubmitted(event) {
  event.preventDefault()

  const searchInput = document.querySelector('#search-input')
  const inputValue = searchInput.value.trim().toLowerCase()
  let searchResult = movies.filter(item => item.title.toLowerCase().includes(inputValue))

  if (searchResult.length === 0) {
    alert(`There is no movie about: ${inputValue}`)
    searchResult = movies
    searchInput.value = ''
  }
  renderMovieCard(searchResult)
})

// render movies in the panel
function renderMovieCard(data) {
  let rowContent = ''
  data.forEach((item) => {
    rowContent += `
  <div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img
          src="${POSTER_URL + item.image}"
          class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal"
            data-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>
  `
  })
  panel.innerHTML = rowContent
}