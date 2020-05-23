const addButton = document.querySelector("#add");
const cancelButton = document.querySelector("#cancel");

const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");
const bookDisplay = document.querySelector("#books-display");

let myLibrary;

if (localStorage.getItem("localBooks") === null) {
  myLibrary = [
    {
      title: "Titulo 1",
      author: "Author 1",
      pages: 123,
      read: true
    },
    {
      title: "Titulo 2",
      author: "Author 2",
      pages: 234,
      read: true
    },
    {
      title: "Titulo 3",
      author: "Author 3",
      pages: 138,
      read: false
    }
  ];
} else {
  // parse the string to Object
  myLibrary = JSON.parse((localStorage.getItem("localBooks")));
}

updateLibrary();

function updateLibrary() {
  myLibrary.forEach( (book, i) => {
    render(book, i);  
  });
}

function render(book, index) {
  const card = createElement("div", "card")  
  const title = createElement("h3", "title")
  const author = createElement("p", "author")
  const pages = createElement("p", "pages")
  const read = createElement("p", "read")
  const status = createElement("span", "status-" + index)
  const readButton = createElement("i", "btnRead")
  const deleteButton = createElement("i", "btnDelete")

  // Give unique ID for delete Button
  card.setAttribute("id", "card-" + index)

  // Add event listener to Read and Delete Buttons
  readButton.setAttribute("id", index)
  deleteButton.setAttribute("id", index)

  readButton.addEventListener("click", changeReadStatus)
  deleteButton.addEventListener("click", deleteBook)

  title.innerText = book.title;
  author.innerText = book.author;
  pages.innerText = book.pages + " pages";

  readButton.classList.add("far");
  readButton.classList.add("fa-check-circle") 

  book.read ? readButton.classList.add("checked") :
     readButton.classList.add("unchecked")

  deleteButton.classList.add("far")
  deleteButton.classList.add("fa-trash-alt")

  status.innerText = getReadStatus(book.read);

  read.appendChild(status)
  read.appendChild(readButton)
  read.appendChild(deleteButton)

  card.appendChild(title)
  card.appendChild(author)
  card.appendChild(pages)
  card.appendChild(read)
    
  bookDisplay.appendChild(card)
}

function getReadStatus(status) {
  return status ? "I've read it!" : "Not read"
}

function createElement(element, id) {
  let newElement = document.createElement(element)
  //newElement.setAttribute("id", id);
  newElement.classList.add(id);
  return newElement 
}

function Book(title, author, pages, read ) {
  this.title = title,
  this.author = author,
  this.pages = pages,
  this.read = read,
  this.info = function(){
    return `${title} by ${author}, ${pages} pages, ${read}`
  }
}

var modal = document.getElementById("myModal");

const newBookButton = document.querySelector("#new-book");
newBookButton.addEventListener("click", function() {
  modal.style.display = "block";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}

function deleteBook(e) {
  let bookToDelete = "card-" + e.target.id;
  let index = e.target.id
  document.getElementById(bookToDelete).remove()
  // remove from Array
  myLibrary.splice(index, 1)
  saveToLocalStorage();
}

function changeReadStatus(e) {
  let index = e.target.id
  let query = ".status-" + index
  // change color 
  if (e.target.classList.contains("checked")) {
    e.target.classList.remove("checked")
    e.target.classList.add("unchecked")     
  } else {
    e.target.classList.remove("unchecked")
    e.target.classList.add("checked")  
  }
  // change read status
  const status = document.querySelector(query)
  myLibrary[e.target.id].read = !myLibrary[e.target.id].read
  status.innerText = getReadStatus(myLibrary[e.target.id].read);

  saveToLocalStorage();

}

addButton.addEventListener("click", addBookToLibrary); 
cancelButton.addEventListener("click", closeModal);

function addBookToLibrary() {
  const newBook = new Book(
      titleInput.value,
      authorInput.value,
      +pagesInput.value,
      false
  );
  myLibrary.push(newBook)
  // save Array as a String
  saveToLocalStorage();
  render(newBook);
}

function saveToLocalStorage() {  
  localStorage.setItem("localBooks", JSON.stringify(myLibrary))
}

function closeModal() {
  modal.style.display = "none";
}