// Formatar data
const data = new Date();

let day = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][data.getDay()];
let date = data.getDate();
let month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()];
let year = data.getFullYear();

const dateToday = `${day}, ${date} de ${month} de ${year}`

const Header = {
    init: function () {
        this.cacheSelectors()
        this.bindEvents()

        headerDate.innerHTML = dateToday
    },

    cacheSelectors: function () {
        this.headerDate = document.getElementById('headerDate')
    },

    bindEvents: function () {

    },

}

const Main = {
    init: function () {
        this.fetchData()
        this.baseURL = 'https://clube-static.clubegazetadopovo.com.br'
    },

    cacheSelectors: function () {
        this.cards = document.getElementById('cards')
    },

    order: function (a, b) {
        if (a.fantasyName > b.fantasyName) {
            return 1
        }
        else if (a.fantasyName < b.fantasyName) {
            return -1
        }
        return 0
    },

    fetchData: function () {
        fetch('https://gdp-prd-clube.s3.amazonaws.com/api/repository/partners/all.json')
            .then(response => {
                return response.json();
            })
            .then(establishments => {
                establishments.sort(this.order).forEach((e) => {
                    cards.innerHTML += `
                    <div class="card">
                        <img src="${this.baseURL}/${e.cover}" alt="${e.fantasyName}">
                        <div class="card-text">
                            <h2>${e.fantasyName}</h2>
                            <span>${e.discountAmount}</span>
                        </div>
                    </div>
                    `
                })
            })
            .catch(error => { console.log(error) })
    }
}

Header.init();
Main.init();

