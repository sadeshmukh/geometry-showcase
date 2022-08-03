const express = require("express");
const app = express();

const howPages = ["path_length", "pythagorean"];

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/html/index.html`);
});

app.get("/pythagorean", (req, res) => {
  res.sendFile(`${__dirname}/html/pythagorean.html`);
});

app.get("/path-length", (req, res) => {
  res.sendFile(`${__dirname}/html/path_length.html`);
});

// app.get("/how/:page", (req, res) => {
//   let pageReq = req.params.page;
//   if (howPages.includes(req.params.page)) {
//     res.send("Valid how page");
//   } else {
//     res.send("Invalid how page");
//   }
// });

app.get("/*", (req, res) => {
  res.status(404).send("<h1>404</h1>");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${process.env.PORT || 3000}`);
});
