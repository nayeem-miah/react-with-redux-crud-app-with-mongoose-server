const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const booksHandler = require("./handler/booksHandler");
const PORT = process.env.PORT || 5000;

// init express
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors())

// data base connect
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("data base connected"))
    .catch((err) => console.log(err));  


// Application routers
app.use("/book", booksHandler);

// default  error handler
const errorHandler = async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    };
    res.status(500).json({ error: err });
};
app.use(errorHandler);

app.get("/", async (req, res) => {
    res.send("server is running......")
})

app.listen(PORT, () => console.log(`server is running on port http://localhost:${PORT}`));
