
const express = require("express");
const mongoose  = require("mongoose");
const bookSchema = require("../Schema/bookSchema");
const router = express.Router();

const Book =new mongoose.model("book", bookSchema)

router.get("/all-books", async (req, res) => {
    try {
        const result = await Book.find();
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ message: error })
    };
});

router.post("/add-book", async (req, res) => {
    try {
        console.log(req.body);
        const newBooks = new Book(req.body);
        const result = await newBooks.save();
        res.status(200).json({ message: "book added successfully", result })
    } catch (error) {
        res.status(500).json({ message: "something is wrong!" })
    }
});

router.get("/book/:id", async (req, res) => {
    
})

router.delete("/delete-book/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const filter = { _id: id };
        const result = await Book.deleteOne(filter);
        res.status(200).json({ message: "delete success", result: result });
    } catch (error) {
        res.status(500).json({ message: "something is error ", error })
    }
});

router.patch("/update-book/:id", async (req, res) => {
    
})

module.exports = router;