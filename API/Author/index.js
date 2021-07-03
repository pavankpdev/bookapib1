const Router = require("express").Router();

const AuthorModel = require("../../database/author");

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json({ authors: getAllAuthors });
});

/*
  Route           /author
  Description     get a list of authors based on a book's ISBN
  Access          PUBLIC
  Parameters      isbn
  Method          GET
  */
Router.get("/:isbn", async (req, res) => {
  try {
    const getSpecificAuthors = database.authors.filter((author) =>
      author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthors.length === 0) {
      return res.json({
        error: `No author found for the book ${req.params.isbn}`,
      });
    }

    return res.json({ authors: getSpecificAuthors });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /author/new
Description     add new author
Access          PUBLIC
Parameters      NONE
Method          POST
*/
Router.post("/new", (req, res) => {
  const { newAuthor } = req.body;

  AuthorModel.create(newAuthor);

  return res.json({ message: "author was added!" });
});

module.exports = Router;

// syntax was correct
// logica error -> we were not handling errors -> crashed
// try catch