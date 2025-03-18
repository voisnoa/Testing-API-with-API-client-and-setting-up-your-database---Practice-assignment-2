const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let bookData = require("./data.json")

app.post("/books", (req, res) => {
  try {
    const newBook = req.body;

    const requiredFields = ["book_id", "title", "author", "genre", "year", "copies"];
    const missingFields = requiredFields.filter((field) => !(field in newBook));

    if (missingFields.length > 0) {
      return res.status(400).send({ message: `Missing fields: ${missingFields.join(", ")}` });
    }


    const existingBook = bookData.find((book) => book.book_id === newBook.book_id);
    if (existingBook) {
      return res.status(400).send({ message: "Book with this book_id already exists" });
    }

    bookData.push(newBook);

    res.status(201).send(newBook);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


app.get("/",(req,res)=>{
  res.send("Welcome to the Book Store API")
})


app.get("/books",(req,res)=>{
  try {
    res.send(bookData)
  } catch (error) {
    res.status(500).send({message:error.message})
  }
})


app.get("/books/:id",(req,res)=>{
  let id=req.params.id;

  let book=bookData.filter((e)=>e.book_id==id)
  res.send(book)
})



app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const updates = req.body;

  const book = bookData.find((b) => b.book_id == bookId);
  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }

  Object.keys(updates).forEach((key) => {
    if (key in book) {
      book[key] = updates[key];
    }
  });

  res.send(book);
});


app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;

  const bookIndex = bookData.findIndex((b) => b.book_id == bookId);
  if (bookIndex === -1) {
    return res.status(404).send({ message: "Book not found" });
  }

  bookData.splice(bookIndex, 1);
  res.send({ message: "Book deleted successfully" });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});