'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 6
const FAV_LAYOUT = 'FavLayoutDB'

var gSortBy = { title: 1 }
var gBooks
var gFilterBy = { minRate: 0, maxPrice: 50, txt: '' }
var gSortBy = { sort: 'title', direction: 1 }
var gPageIdx = 0
var gCurrModal = ''
var gCardMode
_createBooks()
_loadMode()

function getBooksForDisplay() {
    return gBooks.filter(book =>
    (book.rate >= gFilterBy.minRate &&
        book.price <= gFilterBy.maxPrice &&
        book.name.toLowerCase().includes(gFilterBy.txt.toLowerCase())))
}

function getBooksByPage(books) {
    const startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function addBook(name, price) {
    if (gCurrLang==='he') price = (price/3.59).toFixed(2)
    const book = _createBook(name, price)
    gBooks.unshift(book)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const bookIdx = getBookIdxById(bookId)
    gBooks[bookIdx].price = (gCurrLang==='he')?(newPrice/3.59).toFixed(2):newPrice.toFixed(2)
    _saveBooksToStorage()

}

function removeBook(bookId) {
    const bookIdx = getBookIdxById(bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function rateBook(name, rate) {
    const book = getBookByName(name)
    book.rate = rate
    _saveBooksToStorage()
}

function changePage(page) {
    gPageIdx = page
}

function setBookFilter(filterBy = {}) {
    if (filterBy.minRate !== undefined) gFilterBy.minRate = +filterBy.minRate
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = +filterBy.maxPrice
    if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt
    return gFilterBy
}

function sortBooks() {


    if (gSortBy.sort === 'price') {
        gBooks.sort((b1, b2) => (b1.price - b2.price) * gSortBy.direction)
    } else if (gSortBy.sort === 'title') {
        gBooks.sort((b1, b2) => b1.name.localeCompare(b2.name) * gSortBy.direction)
    } else if (gSortBy.sort === 'rate') {
        gBooks.sort((b1, b2) => (b1.rate - b2.rate) * -gSortBy.direction)
    }
}

function setSort(sort) {
    gSortBy.direction = (gSortBy.sort === sort) ? gSortBy.direction * -1 : 1
    gSortBy.sort = sort
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = [
            _createBook('Harry Potter', 19.90),
            _createBook('1984', 7.50),
            _createBook('1Q84', 35),
            _createBook('Animal Farm', 3.89),
            _createBook('Brave New World', 16),
            _createBook('Orientalism', 40),
            _createBook('Sherlock Holmes', 38),
            _createBook('Siddhartha', 8.99),
            _createBook('Tempest', 4.40),
            _createBook('The Bible', 26),
            _createBook('The Hobbit', 24.90),
            _createBook('The Road', 49.9),
            _createBook('Treasure Island', 12.30),
            _createBook('War and Peace', 39.90)
        ]
    }
    gBooks = books
    _saveBooksToStorage()
}

function _createBook(name, price) {
    return {
        id: makeId(),
        name,
        price: price.toFixed(2),
        rate: 0,
        desc: makeLorem()
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function getBookByName(bookName) {
    const book = gBooks.find(book => bookName === book.name)
    return book
}

function getBookIdxById(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    return bookIdx
}

function calcGrouping(books) {
    return books.reduce((acc, book) => {
        if (book.price <= 15) acc.cheap++
        else if (book.price <= 30) acc.normal++
        else acc.expensive++
        return acc
    }, { cheap: 0, normal: 0, expensive: 0 })

}

function setCurrModal(bookId) {
    gCurrModal = bookId
    setQueryParams()
}

function getSwipedBook(val){
    console.log('gCurrModal:', gCurrModal)
    var newIdx = getBookIdxById(gCurrModal)+val
    if (newIdx>=gBooks.length) newIdx = 0
    if (newIdx<0) newIdx = gBooks.length-1
    return gBooks[newIdx].id
}

function setQueryParams() {

    const queryParams = `?minrate=${gFilterBy.minRate}&maxprice=${gFilterBy.maxPrice}&txt=${gFilterBy.txt}&modal=${gCurrModal}&lang=${gCurrLang}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function setMode(isCardMode) {
    gCardMode = isCardMode ? true : false
    saveToStorage(FAV_LAYOUT, gCardMode)
}

function getMode(){
    return gCardMode
}

function _loadMode(){
    var cardMode = loadFromStorage(FAV_LAYOUT)
    if(!cardMode) cardMode = false
    gCardMode = cardMode
    saveToStorage(FAV_LAYOUT, gCardMode)
}

function getPage(){
    return gPageIdx
}