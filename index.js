const express = require("express");
const cors = require("cors");
const app = express();

const openaiRoute = require("./routes/openai");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/openai", openaiRoute);

app.listen(3000, async () => {
});
