const cors = require("cors");
const express = require("express");
const app = express();

const PORT = 8080;

app.use(cors());

app.use(express.static(__dirname + "/"));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

var server = app.listen(process.env.PORT || 8080, () =>
  console.log("App listening on port " + PORT)
);
