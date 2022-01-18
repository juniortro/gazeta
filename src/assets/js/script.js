// Formatar data
const data = new Date()

let day = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
][data.getDay()]

let date = data.getDate()

let month = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
][data.getMonth()]

let year = data.getFullYear()

const dateToday = `${day}, ${date} de ${month} de ${year}`

const Header = {
  init: function () {
    this.cacheSelectors()
    headerDate.innerHTML = dateToday
  },

  cacheSelectors: function () {
    this.headerDate = document.getElementById("headerDate")
  },
}

const Main = {
  init: function () {
    this.fetchData()
    this.cacheSelectors()
    this.bindEvents()
    this.baseURL = "https://clube-static.clubegazetadopovo.com.br"
  },

  cacheSelectors: function () {
    this.cards = document.getElementById("cards")
    this.searchInput = document.getElementById("searchInput")
  },

  establishments: [],

  bindEvents: function () {
    this.searchInput.addEventListener("keyup", (e) => {
      this.showCards()
    })
  },

  order: function (a, b) {
    if (a.fantasyName > b.fantasyName) {
      return 1
    } else if (a.fantasyName < b.fantasyName) {
      return -1
    }
    return 0
  },

  fetchData: function () {
    fetch(
      "https://gdp-prd-clube.s3.amazonaws.com/api/repository/partners/all.json"
    )
      .then((response) => {
        return response.json()
      })
      .then((e) => {
        this.establishments = e
        this.showCards()
        this.paginate(e.length)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  htmlCard: function (e) {
    return `
            <div class="card">
                <img src="${this.baseURL}/${e.cover}" alt="${e.fantasyName}">
                <div class="card-text">
                    <h2>${e.fantasyName}</h2>
                    <span>${e.discountAmount}% OFF</span>
                </div>
            </div>
            `
  },

  showCards: function (start = 0, end = this.end, n = 1) {
    const search = this.searchInput.value

    if (search) {
      const result = this.establishments.filter((est) => {
        if (search === "") {
          return this.establishments
        }
        if (est.fantasyName.toLowerCase().includes(search.toLowerCase())) {
          return this.establishments
        }
      })

      this.paginate(result.length, n)

      cards.innerHTML = ""

      result.sort(this.order).forEach((e, idx) => {
        if (idx >= start && idx <= end) {
          cards.innerHTML += this.htmlCard(e)
        }
      })
    } else {
      this.paginate(this.establishments.length, n)
      cards.innerHTML = ""
      this.establishments.sort(this.order).forEach((e, idx) => {
        if (idx >= start && idx <= end) {
          cards.innerHTML += this.htmlCard(e)
        }
      })
    }
  },

  totalPerPage: 10,
  totalPages: 0,
  start: 0,
  end: 9,

  paginate: function (total, n = 1) {
    const totalPages = Math.ceil(total / this.totalPerPage)
    const pagination = document.getElementById("pagination")
    let x = 0
    let start = this.start
    let end = this.end
    console.log(n)

    pagination.innerHTML = `<a onclick="Main.showCards(${start}, ${end}, ${
      x + 1
    })"> << </a>`
    while (x < totalPages) {
      x++
      if (x + 2 > n && x - 2 < n) {
        pagination.innerHTML += `
            <a class="${
              n == x ? "checked" : ""
            }" onclick="Main.showCards(${start}, ${end}, ${x})"> ${x} </a>
            `
      }
      start = end + 1
      end = end + this.totalPerPage
    }
    pagination.innerHTML += `<a onclick="Main.showCards(${
      start - this.totalPerPage
    }, ${end - this.totalPerPage}, ${x})"> >> </a>`
  },
}

Header.init()
Main.init()
