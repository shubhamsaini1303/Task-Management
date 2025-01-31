const { configDotenv } = require("dotenv");
const express = require("express");
const connectDatabse = require("./db/database");
const cookieparser = require("cookie-parser");
const cors = require("cors");  // Add this line

configDotenv();

const app = express();


app.use(
  cors({
    origin: [process.env.FRONTEND_URL], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use(express.json());
app.use(cookieparser());

const user = require("./routes/userroute");
const task = require("./routes/taskroute");

app.use("/api/v1", user);
app.use("/api/v1/task", task);

connectDatabse();

app.listen(5000, () => {
  console.log("server is working");
});
