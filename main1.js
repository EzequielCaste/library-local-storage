let myLibrary = {
  books: JSON.parse(localStorage.getItem("books")) || [
    {
      title: "The Last Wish",
      author: "Andrzej Sapkowski",
      pages: 288,
      read: false
    },
    {
      title: "Sword of Destiny",
      author: "Andrzej Sapkowski",
      pages: 384,
      read: false
    }
  ],  
  addBook: function(book) {
    this.books.push(book);
    // UPDATE SAVED DATA
    this.updateData();
  },
  editBook: function(index, editedBook) {
    this.books[index] = editedBook;
    // UPDATE SAVED DATA
    this.updateData();
  },
  deleteBook: function(index) {
    this.books.splice(index, 1);
    this.updateData();
  },
  displayBooks: function() {

  },
  updateData: function() {
    localStorage.setItem("books", JSON.stringify(this.books))
  }
}

const handlers = {
  titleInput: document.querySelector("#title"),
  authorInput: document.querySelector("#author"),
  pagesInput: document.querySelector("#pages"),
  readInput: document.querySelector("#read"),
  notReadInput: document.querySelector("#not-read"),
  modal: document.getElementById("myModal"),
  showModal: function(action) {  
    this.titleInput.value = "";
    this.authorInput.value = "";
    this.pagesInput.value = "";
    
    this.modal.style.display = "block";
        
    let modalButton = document.getElementById("modalBtn");

    if( action === "add" ) {
      modalButton.setAttribute("onclick", "handlers.addBook()");
      modalButton.innerText = "Add";
    } else {
      modalButton.setAttribute("onclick", `handlers.editBook(${event.target.id})`);

      modalButton.innerText = "Edit";
      
      let book = myLibrary.books[event.target.id];
      this.titleInput.value = book.title;
      this.authorInput.value = book.author;
      this.pagesInput.value = book.pages;

      book.read ? (this.readInput.checked = true) :
      ( 
        this.readInput.checked = false,
        this.notReadInput.checked = true
      )
    }
  },
  closeModal: function() {
    this.modal.style.display = "none";
  },
  addBook: function() {    
    //add button from modal has id of 
    const newBook = {
      title: this.titleInput.value,
      author: this.authorInput.value,
      pages: +this.pagesInput.value,
      read: this.readInput.checked
    }
        
    myLibrary.addBook(newBook);
    this.closeModal();
    views.showBooks();
    //clear inputs
    this.titleInput.value = "";
    this.authorInput.value = "";
    this.pagesInput.value = "";
  },
  getStatusText: function(index) {
    if(myLibrary.books[index].read) {
      return "I've read it!"
     } else {
       return "Not read"
     } 
  },
  editBook: function(index) {
    const editedBook = {
      title: this.titleInput.value,
      author: this.authorInput.value,
      pages: +this.pagesInput.value,
      read: this.readInput.checked
    }
        
    myLibrary.editBook(index, editedBook);    
    
    this.closeModal();
    views.showBooks();
    //clear inputs
    this.titleInput.value = "";
    this.authorInput.value = "";
    this.pagesInput.value = "";
  },
  deleteBook: function(index) {
    myLibrary.deleteBook(index);
    views.showBooks();
  }
}

const views = {
  showBooks: function() {    
  const bookSection = document.querySelector("#books-display")
  bookSection.innerHTML = "";
  
  myLibrary.books.forEach( (book, i) => {
    let div = this.createDiv(book, i);
    bookSection.appendChild(div);
  })  

  },
  createDiv: function(book, index) {
    const div = document.createElement("div")
    div.setAttribute("id", "card-" + index)
    div.classList.add("card");
      
    let header = document.createElement("h3")
    header.classList.add("title")
    header.textContent = book.title;

    let author = document.createElement("p")
    author.classList.add("author")
    author.textContent = book.author;
    let pages = document.createElement("p")
    pages.classList.add("pages")
    pages.textContent = book.pages + " pages";

    let read = this.createReadBlock(book, index)

    div.appendChild(header);
    div.appendChild(author);
    div.appendChild(pages);
    div.appendChild(read);

    return div;

  },
  createReadBlock: function(book , index) {
    let p = document.createElement("p");
    p.classList.add("pages");

    let span = document.createElement("span");
    span.className = "status-" + index;
    span.innerText = handlers.getStatusText(index)
    p.appendChild(span);

    let editBtn = this.createEditButton(book, index);
    p.appendChild(editBtn);

    let deleteBtn = this.createDeleteButton(index);
    p.appendChild(deleteBtn);

    return p;    
  },
  createEditButton: function(book, index) {
    let editIcon = document.createElement("i");
    editIcon.setAttribute("id", index);
    // on Click > open the EDIT MODAL
    editIcon.addEventListener("click", function() {
      handlers.showModal("edit")
    });
    editIcon.classList.add("btnEdit");
    editIcon.classList.add("far");
    editIcon.classList.add("fa-edit");
  
    book.read ? editIcon.classList.add("checked") :
    editIcon.classList.add("unchecked");

    return editIcon;
  },
  createDeleteButton: function(index) {
    let deleteIcon = document.createElement("i");
    deleteIcon.setAttribute("id", index);
    deleteIcon.addEventListener("click", function() {
      handlers.deleteBook(index);
    })
    deleteIcon.classList.add("btnDelete");
    deleteIcon.classList.add("far");
    deleteIcon.classList.add("fa-trash-alt");   
    return deleteIcon;
  }  
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == handlers.modal) {
    handlers.closeModal();
  }
}

views.showBooks();