const wikiAPI = "https://en.wikipedia.org/api/rest_v1/page/summary/"
const main = document.getElementById("main")
const input = document.querySelector("input")
const form = document.querySelector("form")
const datalist = document.getElementById("bookSearch")
let myLibrary = []

class Book {
  constructor(data) {
    this.title = data.title
    this.description = data.description || "No description available"
    this.extract = data.extract
    this.thumbnail = data.thumbnail.source
    myLibrary.push(this)
  }
}

function addBookToDOM(book) {
  let card = document.createElement("section")
  card.id = `${book.title}`
  card.className = "card"
  card.style.backgroundImage = `url(${book.thumbnail})`
  card.innerHTML = `
  <section class="content">
  <h2>${book.title}</h2>
  <p>${book.description}</p>
  <p>${book.extract}</p>
  <button class="readButton">Mark As Read</button>
  <button class="removeButton">Remove</button>
  </section>
 `
  main.appendChild(card)
}

function createAndPostCard(bookTitle) {
  fetch(wikiAPI + bookTitle)
    .then(checkStatus)
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      return new Book(data)
    })
    .then(addBookToDOM)
    .catch((error) =>
      console.log(
        "It looks like there was a problem!",
        console.error(error.message)
      )
    )
}

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(
      new Error("Must use exact name of title when searching")
    )
  }
}

createAndPostCard("The Lord of the Rings")
createAndPostCard("the count of monte cristo")
createAndPostCard("iliad")

form.addEventListener("submit", (event) => {
  let value = input.value
  if (value) {
    createAndPostCard(value)
  }
  input.value = ""
  event.preventDefault()
})

main.addEventListener("click", (event) => {
  if (event.target.className === "removeButton") {
    event.target.parentNode.parentNode.remove()
  } else if (event.target.className === "readButton") {
    event.target.parentNode.parentNode.classList.toggle("read")
  }
})

input.addEventListener("keyup", (e) => {
  if (input.value) {
    let controller = new AbortController()
    let search = input.value.replace(" ", "%20")
    const options = document.getElementsByTagName("option")
    // controller.signal.addEventListener("abort", () => controller.abort())
    input.addEventListener("keydown", () => controller.abort())
    fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&namespace=0&limit=5&search=${search}`,
      { signal: controller.signal }
    )
      .then((response) => response.json())
      .then((data) => {
        return data[1].forEach((title, i) => {
          options[i].value = title
        })
      })
      // .then((list) => (datalist.innerHTML = list))
      .catch((err) => {
        err.name === "AbortError"
          ? console.error("fetch aborted: " + err.message)
          : console.error(err.message)
      })
  }
})

// bookDisplay.addEventListener("click", event => {
//   if (event.target.className === "changeStatusBtn") {
//     let wasRead = event.target.parentNode.querySelector(".bookRead").textContent
//     if (wasRead === "read") {
//       wasRead = "not read"
//     } else {
//       wasRead = "read"
//     }
//   }
// })
