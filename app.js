const prompt = require("prompt-sync")({ sigint: true });
const clear = require("clear-screen");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const clc = require("cli-color");
//mock database -- object in array
let books = [];

//save to JSON
function loadData() {
  try {
    const jsonData = fs.readFileSync("books.json", "utf8");
    books = JSON.parse(jsonData);
  } catch (err) {
    books = [];
  }
}

//update JSON function
function saveData() {
  const updatedJsonData = JSON.stringify(books, null, 2);
  fs.writeFileSync("books.json", updatedJsonData, "utf8");
}

const saveBookToJSON = (newBook) => {
  loadData();

  books.push(newBook);

  saveData();
};

loadData();

//view all books function
const viewBooks = () => {
  console.log(clc.bold(`
      Book list`));
  for (let book of books) {
    console.log(
      clc.yellow(`
        id: ${book.id}`) +
      `
        book: ${book.title}
        author: ${book.author}
        publication_year: ${book.year}
        price: ${book.price}
      `);
  }
};

//add new book function
const addBook = () => {
  const newBook = {};

  // input detail book with prompt
  newBook.id = uuidv4();
  newBook.title = prompt(clc.yellow("Enter book title: "));
  newBook.author = prompt(clc.yellow("Enter author: "));
  newBook.year = parseInt(prompt(clc.yellow("Enter publication year: ")));
  newBook.price = parseFloat(prompt(clc.yellow("Enter price: ")));

  if (
    !newBook.id ||
    !newBook.title ||
    !newBook.author ||
    !newBook.year ||
    !newBook.price
  ) {
    console.log(
      clc.red(`
      Add new book error!
    `)
    );
  } else {
    // add book in books with .push() method
    saveBookToJSON(newBook);

    console.log(
      clc.bold(`
        Added new book: 
      `) + 
        clc.yellow(`
          id: ${newBook.id}`) +
      `
          title: ${newBook.title}
          author: ${newBook.author}
          publication_year: ${newBook.year}
          price: ${newBook.price}
      `);
  }
};

//edit book function
const editBookByID = () => {
  const bookID = prompt(clc.yellow(`Enter book ID: `).trim());

  const indexToEdit = books.findIndex((book) => book.id === bookID);

  if (indexToEdit === -1) {
    console.log(
      clc.red(`
      Book with ID ${bookID} not found!
    `)
    );
    return;
  }

  const bookToEdit = books[indexToEdit];

  console.log(
        clc.bold(`Current details of the book to edit:
        `) +
        clc.yellow(`
          id: ${bookToEdit.id}`) + 
        `
          title: ${bookToEdit.title}
          author: ${bookToEdit.author}
          publication_year: ${bookToEdit.year}
          price: ${bookToEdit.price}
      `);

  const changeTitle = prompt(clc.yellow("Change book title: "));
  const changeAuthor = prompt(clc.yellow("Change author: "));
  const changeYear = parseInt(prompt(clc.yellow("Change publication year: ")));
  const changePrice = parseFloat(prompt(clc.yellow("Change price: ")));

  if (changeTitle !== "") {
    bookToEdit.title = changeTitle;
  }

  if (changeAuthor !== "") {
    bookToEdit.author = changeAuthor;
  }

  if (!isNaN(changeYear)) {
    bookToEdit.year = changeYear;
  } else {
    console.log(clc.red("year: invalid year"));
  }

  if (!isNaN(changePrice)) {
    bookToEdit.price = changePrice;
  } else {
    console.log(clc.red("price: invalid price"));
  }

  console.log(
    clc.bold(`
      Updated details of the book:
      `) +
      clc.yellow(`
        id: ${bookToEdit.id}`) +
      `
          id: ${bookToEdit.id}
          title: ${bookToEdit.title}
          author: ${bookToEdit.author}
          publication_year: ${bookToEdit.year}
          price: ${bookToEdit.price}
    `);

  //save to JSON
  saveData();
};

//delete book function
const deleteBook = () => {
  const bookID = prompt(clc.yellow(`Enter book ID: `).trim());

  const indexToDelete = books.findIndex((book) => book.id === bookID);

  if (indexToDelete === -1) {
    console.log(clc.red(`
      Book with ID ${bookID} not found!
    `));
    return;
  }

  const bookToDelete = books[indexToDelete];

  console.log(
    clc.bold(`
        Book to delete:
      `)+
      clc.yellow(`
          id: ${bookToDelete.id}`) + 
    `
          title: ${bookToDelete.title}
          author: ${bookToDelete.author}
          publication_year: ${bookToDelete.year}
          price: ${bookToDelete.price}
      `);

  const deleteConfirmation = prompt(clc.yellow(`Type "delete" to confirm: `));

  if (deleteConfirmation === "delete") {
    books.splice(indexToDelete, 1);
    console.log(clc.green(`
        Book with ID ${bookID} has been deleted successfully!
    `));
  } else {
    console.log(
      clc.red(`
      Delete canceled.
    `)
    );
  }

  //save to JSON
  saveData();
};

const findBooksByTitle = () => {
  const bookTitle = prompt(clc.yellow(`Enter book title: `));
  const foundBooks = [];

  for (let book of books) {
    if (book.title === bookTitle) {
      foundBooks.push(book);
    }
  }

  if (foundBooks.length > 0) {
    console.log(`
        Books with the title: ` + clc.italic(`"${bookTitle}" `));
    for (let foundBook of foundBooks) {
      console.log(
        clc.yellow(`
          id: ${foundBook.id}`) +
        `
          title: ${foundBook.title}
          author: ${foundBook.author}
          publication_year: ${foundBook.year}
          price: ${foundBook.price}
      `);
    }
  } else {
    console.log(
      clc.red(`
      No books with the title "${bookTitle}" found!
    `)
    );
  }
};

clear();

//display
const optionMenu = () => {
  console.log( clc.blue.bold(`
Book Management System`)
+
`
-----------------------------
option:
    v = view books
    a = add book
    e = edit book by ID
    d = delete book by ID
    f = find books by title
    clear = clear screen
    option = option list
-----------------------------
`);
  return;
};

optionMenu();

//prompt function
while (true) {
  const option = prompt(clc.yellow("choose option >>> "));

  if (option === "v") {
    viewBooks();
  } else if (option === "a") {
    addBook();
  } else if (option === "e") {
    editBookByID();
  } else if (option === "d") {
    deleteBook();
  } else if (option === "f") {
    findBooksByTitle();
  } else if (option === "clear") {
    clear();
  } else if (option === "option") {
    optionMenu();
  } else {
    console.error(clc.red(` option error, please choose.`));
  }
}
