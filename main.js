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
  let post = document.createElement("div")
  post.id = `${book.title}`
  post.className = "card"
  post.innerHTML = `
    <img src=${book.thumbnail} alt=${book.title}>
    <section>
    <h3>${book.title}</h3>
    <p>${book.description}</p>
    <p>${book.extract}</p>
    <button class="readButton">Mark As Read</button>
    <button class="removeButton">Remove</button>
    </section>
  `
  main.appendChild(post)
}

function fetchBookData(bookTitle) {
  fetch(wikiAPI + bookTitle)
    .then(response => response.json())
    .then(data => new Book(data))
    .then(book => addBookToDOM(book))
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

main.addEventListener("click", event => {
  if (event.target.className === "removeButton") {
    event.target.parentNode.parentNode.remove()
  } else if (event.target.className === "readButton") {
    event.target.parentNode.classList.toggle("read")
  }
})
