const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const app = express();
const port = 8000;

dotenv.config();
connectDb();

app.use(cors());
app.use(express.json());

app.use("/", require("./routes/user.routes"));
app.use("/task", require("./routes/task.routes"));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});