const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies'
const POSTER_URL = BASE_URL + '/posters/'

const panel = document.querySelector('#data-panel')

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

// render 80 movies in the list
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
            data-target="#movie-modal">More</button>
          <button class="btn btn-info btn-add-favorite">+</button>
        </div>
      </div>
    </div>
  </div>
  `
  })
  panel.innerHTML = rowContent
}

panel.addEventListener('click', (event) => {
  const target = event.target
  console.log(target)
})