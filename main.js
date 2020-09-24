const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/' //id 601-800

const friends = [] // inport from API; //name, surname, email, age, region, birthday
let filteredFriends = [] // filtered by user's search input
let favoriteFriends = [] // favorite friends added by user
let resultList = friends // displayed list, default is whole friend list

let numberOfShown = 12 // number of friend shown in one page
let numberOfPage = Math.ceil(resultList.length / numberOfShown) // total pages
let currentPage = 1 // shown page
let displayMode = 0 // 0 for displaying by cards (default); 1 for displaying by bars

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')
const display = document.querySelector('#display')
const navbar = document.querySelector('#nav-bar')
const friendTitle = document.querySelector('#friend-title')

const cardDisplay = document.querySelector('#list-cards')
const barDisplay = document.querySelector("#list-bars")

function resetList() {
  filteredFriends = []
  resultList = friends
  renderFriendList(showFriendByPage(1))
  renderPagination(resultList.length)
  friendTitle.innerText = `Friends (${resultList.length})`
}

function renderFriendList(data) {
  dataPanel.className = ''
  if (displayMode === 0) {
    renderByCards(data)
  } else if (displayMode === 1) {
    renderByBars(data)
  }
}

function renderByCards(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card" style="width: 18rem;">
            <div class="m-2">
              <a href="" data-toggle="modal" data-target="#friendModal"><img src="${item.avatar}" data-id="${item.id}" class="card-img-top img-modal" alt="Photo"></a>
            </div>
            <div class="card-body d-flex flex-column">
              <div><h4 class="card-title">${item.name} ${item.surname}</h4></div>
              <div class="d-flex flex-row-reverse bd-highlight">
                <a href="" data-toggle="tooltip" title="Remove Friend"><i class="far fa-trash-alt fa-2x remove-icon icon-black" data-id="${item.id}"></i></a>
                ${renderFavIcon(item)}
              </div>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.classList.add('row')
  dataPanel.innerHTML = rawHTML
}

function renderByBars(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
        <li class="list-group-item d-flex row" data-id="${item.id}>
          <div class="img img-thumbnail"><a href="" data-toggle="modal" data-target="#friendModal"><img class="rounded-circle img-modal" src="${item.avatar}" data-id="${item.id}" alt=""></a></div>
          <div class="text mt-3 ml-3">
            <p class="h2">${item.name} ${item.surname}</p>
            <p class="bar-description">E-mail: ${item.email} // Birthday: ${item.birthday} (Age: ${item.age}}</p>
            ${renderFavIcon(item)}
            <a href="" data-toggle="tooltip" title="Remove friend"><i class="far fa-trash-alt fa-2x remove-icon icon-black" data-id="${item.id}"></i></a>
            </div>
          </div>
        </li>`
  })
  dataPanel.innerHTML = `<ul>${rawHTML}</ul>`
}

function renderFavIcon(data) {
  const favoriteStatus = data.favoriteStatus
  if (favoriteStatus === 'unfavorited') {
    return `<a href="" data-toggle="tooltip" title="Add to favorite"><i class="far fa-heart fa-2x favorite-icon mr-2" data-id="${data.id}"></i></a>`
  } else if (favoriteStatus === 'favorited') {
    return `<a href="" data-toggle="tooltip" title="Remove from favorite"><i class="fas fa-heart fa-2x favorite-icon mr-2" data-id="${data.id}"></i></a>`
  }
}

function renderRegionFilter(data) {
  let regionResult = []
  let regionUnique = []

  data.forEach((item) => regionResult.push(item.region))
  regionResult.forEach((item) => {
    if (regionUnique.indexOf(item) === -1) {
      regionUnique.push(item)
    }
  })

  let rawHTML = '<a href="#" class="region-item" data-region="Region">Region</a>'
  regionUnique.forEach((region) => rawHTML += `<a href="#" class="region-item" data-region="${region}">${region}</a>`)
}

function renderPagination(amount) {
  numberOfPage = Math.ceil(amount / numberOfShown)
  let rawHTML = ''

  const firstPageHTML = '<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>'
  const lastPageHTML = `<li class="page-item"><a class="page-link" href="#" data-page="${numberOfPage}">${numberOfPage}</a></li>`
  const previousPageHTML = '<li class="page-item"><a class="page-link" href="#" data-page="previous-page"><</a></li>'
  const nextPageHTML = '<li class="page-item"><a class="page-link" href="#" data-page="next-page">></a></li>'
  const searchPageHTML = '<li class="page-item"><a class="page-link" href="#" data-page="search-page">...</a></li>'

  function renderMidPagination(startPage, amount) {
    let tempHTML = ''
    for (let i = startPage; i < startPage + amount; i++) {
      tempHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
    }
    return tempHTML
  }

  if (numberOfPage === 1) {
    rawHTML = firstPageHTML
  }
  else if (numberOfPage > 1 && numberOfPage < 10) {
    let midPaginator = ''
    midPaginator = renderMidPagination(1, numberOfPage)

    if (currentPage === 1) {
      rawHTML = `
        ${midPaginator}
        ${nextPageHTML}`
    }
    else if ((currentPage > 1) && (currentPage < numberOfPage)) {
      rawHTML = `
        ${previousPageHTML}
        ${midPaginator}
        ${nextPageHTML}`
    }
    else if (currentPage === numberOfPage) {
      rawHTML = `
        ${previousPageHTML}
        ${midPaginator}`
    }
  }
  else if (numberOfPage >= 10) {
    if (currentPage === 1) {
      rawHTML = `
        ${renderMidPagination(1, 5)}
        ${searchPageHTML}
        ${lastPageHTML}
        ${nextPageHTML}`
    }
    else if ((currentPage <= 3) && (currentPage > 1)) {
      rawHTML = `
        ${previousPageHTML}
        ${renderMidPagination(1, 5)}
        ${searchPageHTML}
        ${lastPageHTML}
        ${nextPageHTML}`
    }
    else if ((currentPage > 3) && (currentPage < (numberOfPage - 2))) {
      rawHTML = `
        ${previousPageHTML}
        ${firstPageHTML}
        ${searchPageHTML}
        ${renderMidPagination(currentPage - 1, 3)}
        ${searchPageHTML}
        ${lastPageHTML}
        ${nextPageHTML}`
    }
    else if ((currentPage >= (numberOfPage - 2)) && (currentPage < numberOfPage)) {
      rawHTML = `
        ${previousPageHTML}
        ${firstPageHTML}
        ${searchPageHTML}
        ${renderMidPagination(numberOfPage - 4, 5)}
        ${nextPageHTML}`
    }
    else if ((currentPage === numberOfPage)) {
      rawHTML = `
        ${previousPageHTML}
        ${firstPageHTML}
        ${searchPageHTML}
        ${renderMidPagination(numberOfPage - 4, 5)}`
    }
  }
  paginator.innerHTML = rawHTML
}

function showFriendModal(id) {
  const modalName = document.querySelector('#modal-name')
  const modalPhoto = document.querySelector('#modal-photo')
  const modalContent = document.querySelector('#modal-content')
  axios.get(INDEX_URL + id).
    then((response) => {
      const data = response.data
      modalName.innerHTML = `${data.name} ${data.surname}`
      modalPhoto.innerHTML = `<img class="mb-2" src="${data.avatar}" alt="photo">`
      modalContent.innerHTML = `
        <li class="list-group-item"><strong>Age</strong>: ${data.age}</li>
        <li class="list-group-item"><strong>Gender</strong>: ${data.gender}</li>
        <li class="list-group-item"><strong>Region</strong>: ${data.region}</li>
        <li class="list-group-item"><strong>Birthday</strong>: ${data.birthday}</li>
        <li class="list-group-item"><strong>Email</strong>: <br>${data.email}</li>`
    }).catch((err) => console.log(error))
}

function showFriendByPage(page) {
  const startIndex = numberOfShown * (page - 1)
  return resultList.slice(startIndex, startIndex + numberOfShown)
}

function searchPageByPaginator() {
  let targetPage = prompt('請輸入要前往的頁數', currentPage)
  if (targetPage !== null && targetPage >= 1 && targetPage <= numberOfPage) {
    currentPage = Number(targetPage)
    renderFriendList(showFriendByPage(currentPage))
  } else {
    return alert('請輸入有效的頁數')
  }
}

function editFavorite(target) {
  const id = Number(target.dataset.id)
  const targetIndexFromFavorite = favoriteFriends.findIndex((friend) => friend.id === id)
  const targetIndexFromFriends = friends.findIndex((friend) => friend.id === id)
  const targetFriend = friends.find((friend) => friend.id === id)

  if (targetIndexFromFavorite === -1) {
    friends[targetIndexFromFriends].favoriteStatus = 'favorited'
    favoriteFriends.push(targetFriend)
    target.classList.remove('far')
    target.classList.add('fas')
  } else if (targetIndexFromFavorite >= 0) {
    const answer = confirm(`您確定要將${targetFriend.name} ${targetFriend.surname}於最愛清單中移除嗎？`)
    if (answer) {
      friends[targetIndexFromFriends].favoriteStatus = 'unfavorited'
      favoriteFriends.splice(targetIndexFromFavorite, 1)
      target.classList.remove('fas')
      target.classList.add('far')
    } else if (!answer) {
      return
    }
  }
  renderFriendList(showFriendByPage(currentPage))
  renderPagination(resultList.length)
}

function removeFriend(id) {
  const targetIndexFromFavorite = favoriteFriends.findIndex((friend) => friend.id === id)
  const targetIndexFromFriends = friends.findIndex((friend) => friend.id === id)
  const targetIndexFromFiltered = filteredFriends.findIndex((friend) => friend.id === id)

  friends.splice(targetIndexFromFriends, 1)
  favoriteFriends.splice(targetIndexFromFavorite, 1)
  filteredFriends.splice(targetIndexFromFiltered, 1)

  renderFriendList(showFriendByPage(currentPage))
  renderPagination(resultList.length)
}

navbar.addEventListener('click', function onNavbarClicked(event) {
  if (event.target.tagName !== 'A') return
  if (event.target.id === 'nav-home') {
    resetList()
  } else if (event.target.id === 'nav-favorite') {
    currentPage = 1
    resultList = favoriteFriends
    renderFriendList(showFriendByPage(1))
    renderPagination(resultList.length)
    friendTitle.innerText = `Favorite Friends (${resultList.length})`
    renderRegionFilter(resultList)
  }
})

display.addEventListener('click', function onDisplayClicked(event) {
  event.preventDefault()
  const displayTarget = event.target
  if (displayTarget.id === 'list-cards') {
    displayMode = 0
    cardDisplay.classList.add('icon-clicked')
    barDisplay.classList.remove('icon-clicked')
  } else if (displayTarget.id === 'list-bars') {
    displayMode = 1
    barDisplay.classList.add('icon-clicked')
    cardDisplay.classList.remove('icon-clicked')
  }
  renderFriendList(showFriendByPage(currentPage))
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  event.preventDefault()
  const target = event.target
  const targetId = Number(target.dataset.id)

  function showTitle() {
    const keyword = searchInput.value.trim().toLowerCase()
    if (filteredFriends.length !== 0) {
      friendTitle.innerText = `Result: "${keyword}"  (${filteredFriends.length})`
    } else if (resultList === favoriteFriends) {
      friendTitle.innerText = `Favorite Friends (${resultList.length})`
    } else {
      friendTitle.innerText = `Friends (${resultList.length})`
    }

  }
  if (target.classList.contains('img-modal')) {
    showFriendModal(targetId)
  } else if (target.classList.contains('favorite-icon')) {
    editFavorite(target)
    showTitle()
  } else if (target.classList.contains('remove-icon')) {
    const answer = confirm('確定是否將此人從好友列表中移除？')
    if (answer) {
      removeFriend(targetId)
      showTitle()
    } else {
      return
    }
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  if (keyword === '') {
    resetList()
  } else {
    filteredFriends = resultList.filter(friend => friend.name.toLowerCase().includes(keyword) || friend.surname.toLowerCase().includes(keyword))
    resultList = filteredFriends.length ? filteredFriends : friends

    renderFriendList(showFriendByPage(1))
    renderPagination(resultList.length)
    friendTitle.innerText = `Result: "${keyword}"  (${resultList.length})`
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const targetPage = event.target.dataset.page

  if (targetPage === 'previous-page') {
    currentPage = currentPage - 1
  } else if (targetPage === 'next-page') {
    currentPage = currentPage + 1
  } else if (targetPage === 'search-page') {
    searchPageByPaginator()
  } else {
    currentPage = Number(targetPage)
  }
  renderFriendList(showFriendByPage(currentPage))
  renderPagination(resultList.length)
})

axios.get(INDEX_URL).
  then((response) => {
    friends.push(...response.data.results)
    friends.forEach((friend) => friend.favoriteStatus = 'unfavorited') //everyone is unfavorited by default
    resetList()
  }).catch((err) => console.log(error))