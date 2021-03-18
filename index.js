const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const panel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const paginator = document.querySelector('.pagination')
const viewMode = document.querySelector('#view-modes')

const movies = []
let searchResult = []
let currentPage = 1
let mode = 'card'

// api request
axios.get(INDEX_URL)
  .then(res => {
    const movieList = res.data.results
    movies.push(...movieList)

    renderMovies(getMoviesByPage(currentPage))
    renderPaginator(movies.length)
  })
  .catch(err => {
    console.log(err)
  })

// Event listeners

panel.addEventListener('click', onPanelClicked)

searchForm.addEventListener('submit', onSearchSubmitted)

paginator.addEventListener('click', onPaginatorClicked)

viewMode.addEventListener('click', onModeChanges)

// Functions
function renderMovies(data) {
  return mode === 'card' ? renderMovieCard(data) : renderMovieList(data)

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

  // render movies by list (reference from TonyLiao)
  function renderMovieList(data) {
    let rawContent = '<table class="table"><tbody>'
    data.forEach((item) => {
      rawContent += `
    <tr>
      <td>${item.title}</td>
      <td>
        <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
      </td>
    </tr>
    `
    })

    rawContent += '</tbody></table>'
    panel.innerHTML = rawContent
  }
}

function renderPaginator(amount) {
  let rowContent = ''
  const pageNum = Math.ceil(amount / MOVIES_PER_PAGE)
  for (let i = 1; i <= pageNum; i++) {
    rowContent += `<li class="page-item"><a class="page-link" href="#" data-id="${i}">${i}</a></li>`
  }

  paginator.innerHTML = rowContent
}

function getMoviesByPage(page) {
  const data = searchResult.length ? searchResult : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  currentPage = Number(event.target.dataset.id)
  renderMovies(getMoviesByPage(currentPage))
}

function onModeChanges(event) {
  const target = event.target

  if (target.matches('#card-mode')) {
    mode = 'card'
  }
  if (target.matches('#list-mode')) {
    mode = 'list'
  }
  renderMovies(getMoviesByPage(currentPage))
}

function onSearchSubmitted(event) {
  event.preventDefault()

  const searchInput = document.querySelector('#search-input')
  const inputValue = searchInput.value.trim().toLowerCase()
  searchResult = movies.filter(item => item.title.toLowerCase().includes(inputValue))

  if (searchResult.length === 0) {
    alert(`There is no movie about: ${inputValue}`)
    searchResult = movies
    searchInput.value = ''
  }

  renderPaginator(searchResult.length)
  renderMovies(getMoviesByPage(currentPage))
}

function onPanelClicked(event) {
  const target = event.target
  if (target.matches('.btn-show-movie')) {
    showMovieDescription(Number(target.dataset.id))
  } else if (target.matches('.btn-add-favorite')) {
    addToFavorite(Number(target.dataset.id))
  }
}

function addToFavorite(id) {
  const favoriteList = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (favoriteList.some(movie => movie.id === id)) {
    alert('The movie is already in the list.')
  }
  favoriteList.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteList))
}

function showMovieDescription(id) {
  axios.get(INDEX_URL + id)
    .then(res => {
      showMovieModal(res.data.results)
    })
    .catch(err => {
      console.error(err)
    })
}

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