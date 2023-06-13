'use strict'



function onInit() {
    
    onModalSwipe()
    renderFilterByQueryParams()
    renderBooks()
    doTrans()
}

function onModalSwipe(){
    var elModal = document.querySelector('.read-modal')
    var hammertime = new Hammer(elModal);
    hammertime.on('swiperight swipeleft', function(ev) {
        console.log(ev)
        if(ev.type==='swiperight') onRead(getSwipedBook(1))
        else  onRead(getSwipedBook(-1))
    })   
}

function renderBooks() {

    var books = getBooksForDisplay()

    renderButtons(books)
    updateGrouping(books)
    books = getBooksByPage(books)
    toggleMode()
    if (getMode()) renderCards(books)
    else renderTable(books)

}

function renderTable(books) {
    const elTbody = document.querySelector('.books-table')
    var strHTMLs = books.map(book => `
    <tr>
    <td>${book.name}</td>
    <td> <button onclick="onUpdateBook('${book.id}')"><img src="img/edit.png"></button>${convertCur(book.price)}</td>
    <td>${book.rate}</td>
    <td><button onclick="onRemoveBook('${book.id}')"><img src="img/delete.png"></button></td>
    <td><button onclick="onRead('${book.id}')"><img src="img/info.png"></button></td>
    </tr>`
    )
    elTbody.innerHTML = strHTMLs.join('')
}
{/* <span data-trans="price">Price</span> <span data-trans="cur">$</span> */ }
function renderCards(books) {
    const elCardArea = document.querySelector('.flex-cards')
    var strHTMLs = books.map(book => `
    <div class="card">
    <h5>${book.name}</h5>
    <h6><span data-trans="price">Price</span>: ${convertCur(book.price)}<span data-trans="cur">$</span></h6>
    <h6><span data-trans="rate">Rating</span>: ${book.rate}</h6>
    <div>
    <button onclick="onRead('${book.id}')"><img src="img/info.png"></button>
    <button onclick="onUpdateBook('${book.id}')"><img src="img/edit.png"></button>
    <button onclick="onRemoveBook('${book.id}')"><img src="img/delete.png"></button></td>
    </div></div>`
    )
    elCardArea.innerHTML = strHTMLs.join('')
}

function renderButtons(books) {
    const btnsAmount = Math.ceil(books.length / PAGE_SIZE)
    var currPage = getPage()
    var strHTML = ''
    for (var i = 0; i < btnsAmount; i++) {
        strHTML += `<button ${currPage === i ? `class="page-mark"` : ''} onclick="onPage(${i})">${i + 1}</button>`
    }
    document.querySelector('.pagination').innerHTML = strHTML
}

function onPage(page) {
    changePage(page)
    renderBooks()
}

function onAddBook() {
    // const name = prompt('Book Name')
    // if (!name) return
    // const price = +prompt('Book Price')
    // if (!price) return
    // addBook(name, price)
    const name = document.querySelector('[name="add-title"]').value
    const price = +document.querySelector('[name="add-price"]').value
    onCloseCreationModal()
    addBook(name, price)

    renderBooks()
}

function onOpenCreationModal() {
    const elModal = document.querySelector('.creation-modal')
    elModal.classList.add('open')
    // document.querySelector('.creation-modal p').innerText = makeLorem()
    document.querySelector('[name="add-title"]').value = ''
    document.querySelector('[name="add-price"]').value = ''
}

function onRead(bookId) {

    const book = getBookById(bookId)
    if(!book) return
    const elModal = document.querySelector('.read-modal')

    setCurrModal(bookId)

    document.querySelector('[name="rate"]').value = book.rate
    elModal.querySelector('h2').innerText = book.name
    elModal.querySelector('h4 span[data="pr"]').innerText = convertCur(book.price)
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')
}

function onRate(value) {
    var bookName = document.querySelector('.read-modal h2').innerText
    rateBook(bookName, value)
}

function onUpdateBook(bookId) {
    updateBook(bookId, +prompt('New Price'))
    sortBooks()
    renderBooks()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onCloseModal() {
    document.querySelector('.read-modal').classList.remove('open')
    sortBooks()
    setCurrModal('')
    renderBooks()
}

function onCloseCreationModal() {
    document.querySelector('.creation-modal').classList.remove('open')
}

function onSetSortBy(sort) {
    // var sortBy = {}
    // const sort = document.querySelector('.sort-by').value
    // const direction = document.querySelector('[name="radio-sort"]:checked').value
    if (!sort) return
    // sortBy = { sortBy: direc }
    setSort(sort)
    sortBooks()
    renderBooks()

}

function onSetFilterBy(filterBy) {

    filterBy = setBookFilter(filterBy)
    updateFilterTxt(filterBy)

    changePage(0)
    renderBooks()
    setQueryParams()
}

function renderFilterByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const filterBy = {
        minRate: +queryParams.get('minrate') || 0,
        maxPrice: +queryParams.get('maxprice') || 50,
        txt: queryParams.get('txt') || ''
    }

    // if (!filterBy.minRate && !filterBy.maxPrice && !filterBy.txt) return
    const lang = queryParams.get('lang')
    setLang(lang)
    document.querySelector('[name="langSelect"]').value = lang
    toggleRTL(lang)

    updateFilterTxt(filterBy)
    document.querySelector('[name="minRate"]').value = filterBy.minRate
    document.querySelector('[name="maxPrice"]').value = filterBy.maxPrice
    document.querySelector('[name="filter-by-search"]').value = filterBy.txt
    setBookFilter(filterBy)
    const bookId = queryParams.get('modal')
    if (bookId) onRead(bookId)
}

function updateFilterTxt(filterBy) {
    document.querySelector('[title="Min Rate"]').innerText = filterBy.minRate
    document.querySelector('[title="Max Price"]').innerText = convertCur(filterBy.maxPrice)
}

function updateGrouping(books) {
    const grouping = calcGrouping(books)

    document.querySelector('.grouping h5:nth-child(1) span').innerText = grouping.cheap
    document.querySelector('.grouping h5:nth-child(2) span').innerText = grouping.normal
    document.querySelector('.grouping h5:nth-child(3) span').innerText = grouping.expensive
}

function onSetMode(isCardMode) {
    console.log('gCardMode:', gCardMode)
    setMode(isCardMode)
    console.log('gCardMode:', gCardMode)

    if (isCardMode) {
        document.querySelector('.books-container').classList.add('open')
        document.querySelector('.cards-area').classList.remove('open')
    } else {
        document.querySelector('.books-container').classList.remove('open')
        document.querySelector('.cards-area').classList.add('open')
    }

    renderBooks()
}

function toggleMode(isCardMode) {
    if (getMode()) {
        document.querySelector('.books-container').classList.add('hide')
        document.querySelector('.cards-area').classList.remove('hide')
    } else {
        document.querySelector('.books-container').classList.remove('hide')
        document.querySelector('.cards-area').classList.add('hide')
    }
}

function onSetLang(lang) {
    setLang(lang)
    setQueryParams()
    toggleRTL(lang)
    renderBooks()
    // console.log('hi' )
    doTrans()
}
function toggleRTL(lang){
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
}