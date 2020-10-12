const wikiAPI = "https://en.wikipedia.org/api/rest_v1/page/summary/"
const main = document.getElementById("main")
const input = document.querySelector("input")
const form = document.querySelector("form")
let myLibrary = []

class Book {
  constructor(data) {
    this.title = data.title
    this.description = data.description
    this.extract = data.extract
    this.thumbnail = data.thumbnail.source
    myLibrary.push(this)
  }
}

function addBookToDOM(book) {
  let post = `
    <section>
        <h3>${book.title}</h3>
    </section>
    `
}

function fetchBookData(bookTitle) {
  fetch(wikiAPI + bookTitle)
    .then(response => response.json())
    .then(data => new Book(data))
    .then(book => console.log(book))
}

fetchBookData("The Lord of the Rings")
fetchBookData("the count of monte cristo")
fetchBookData("iliad")

form.addEventListener("submit", event => {
  let value = input.value
  if (value) {
    fetchBookData(value)
  }
  event.preventDefault()
})
