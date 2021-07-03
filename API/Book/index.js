// Initializing Express Router
const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");

/*
Route           /
Description     get all books
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route           /is
Description     get specific book based on ISBN
Access          PUBLIC
Parameters      isbn
Method          GET
*/
Router.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route           /c
Description     get specific books based on a category
Access          PUBLIC
Parameters      category
Method          GET
*/
Router.get("/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.findOne({
    category: req.params.category,
  });

  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ books: getSpecificBooks });
});

/*
Route           /book/new
Description     add new books
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;

    await BookModel.create(newBook);

    return res.json({ message: "book was added!" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /book/update
Description     update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/update/:isbn", async (req, res) => {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.bookTitle,
    },
    {
      new: true, // to get updated data
    }
  );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     book.title = req.body.bookTitle;
  //     return;
  //   }
  // });

  return res.json({ books: updatedBook });
});

/*
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/author/update/:isbn", async (req, res) => {
  // update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authors: req.body.newAuthor,
      },
    },
    {
      new: true,
    }
  );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn)
  //     return book.authors.push(req.body.newAuthor);
  // });

  // update the author database

  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );

  // database.authors.forEach((author) => {
  //   if (author.id === req.body.newAuthor)
  //     return author.books.push(req.params.isbn);
  // });

  return res.json({
    books: updatedBook,
    authors: updatedAuthor,
    message: "New author was added 🚀",
  });
});

/*
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameters      isbn
Method          DELETE
*/
Router.delete("/delete/:isbn", async (req, res) => {
  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  // const updatedBookDatabase = database.books.filter(
  //   (book) => book.ISBN !== req.params.isbn
  // );

  // database.books = updatedBookDatabase;
  return res.json({ books: updatedBookDatabase });
});

/*
  Route           /book/delete/author
  Description     delete a author from a book
  Access          PUBLIC
  Parameters      isbn, author id
  Method          DELETE
  */
Router.delete("/delete/author/:isbn/:authorId", async (req, res) => {
  // update the book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        authors: parseInt(req.params.authorId),
      },
    },
    { new: true }
  );

  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     const newAuthorList = book.authors.filter(
  //       (author) => author !== parseInt(req.params.authorId)
  //     );
  //     book.authors = newAuthorList;
  //     return;
  //   }
  // });

  // update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorId),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    { new: true }
  );
  // database.authors.forEach((author) => {
  //   if (author.id === parseInt(req.params.authorId)) {
  //     const newBooksList = author.books.filter(
  //       (book) => book !== req.params.isbn
  //     );

  //     author.books = newBooksList;
  //     return;
  //   }
  // });

  return res.json({
    message: "author was deleted!!!!!!😪",
    book: updatedBook,
    author: updatedAuthor,
  });
});

module.exports = Router;
