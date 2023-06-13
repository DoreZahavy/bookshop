'use strict'

var gCurrLang = 'en'

const gTrans = {
    welcome: {
        en: 'Welcome to my Bookshop',
        he: 'ספרים - ניהול מלאי'
    },
    filter: {
        en: 'Filter',
        he: 'פילטר'
    },
    search: {
        en: 'search',
        he: 'חיפוש'
    },
    minRate: {
        en: 'Min Rate',
        he: 'ציון מינימלי:'
    },
    maxPrice: {
        en: 'Max Price:',
        es: 'Mis Cosas Por Hacer',
        he: 'מחיר מקס:'
    },
    data: {
        en: 'Meta Data',
        he: 'סטטיסטיקה'
    },
    cheap: {
        en: 'cheap books',
        he: 'ספרים זולים'
    },
    normal: {
        en: 'normal priced books',
        he: 'ספרים במחיר נורמלי'
    },
    expensive: {
        en: 'expensive books',
        he: 'ספרים יקרים'
    },
    title: {
        en: 'Title',
        he: 'שם הספר'
    },
    price: {
        en: 'Price',
        he: 'מחיר'
    },
    rate: {
        en: 'Rating',
        he: 'ציון'
    },
    table: {
        en: 'Table',
        he: 'טבלה'
    },
    cards: {
        en: 'Cards',
        he: 'כרטיסים'
    },
    'add-new': {
        en: 'Add New Book',
        he: 'הוסף ספר חדש'
    },
    'update-rating': {
        en: 'Change Rating:',
        he: 'שנה ציון:'
    },
    cur: {
        en: '$',
        he: '₪'
    },
    add: {
        en: 'Add',
        he: 'הוספה'
    },
    cancel: {
        en: 'Cancel',
        he: 'ביטול'
    }
}

function setLang(lang) {

    gCurrLang = lang
    console.log('lang', gCurrLang)
}

function doTrans() {
    document.querySelector('[title="Max Price"]').innerText = convertCur(gFilterBy.maxPrice)

    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const transTxt = _getTrans(transKey)
        if (el.placeholder) el.placeholder = transTxt
        else el.innerText = transTxt
    })
}

function _getTrans(transKey) {
    var transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'
    var transTxt = transMap[gCurrLang]
    if (!transTxt) transTxt = transMap.en
    return transTxt
}

function convertCur(num) {
    console.log('gCurrLang:', gCurrLang)
    if (gCurrLang === 'he') return (num * 3.59).toFixed(0)
    else return num
}

// function doTrans() {

// }
