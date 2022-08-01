const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/html/index.html`);
});

app.get("/pythagorean", (req, res) => {
  res.sendFile(`${__dirname}/html/pythagorean.html`);
});

app.get("/*", (req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`);
});
