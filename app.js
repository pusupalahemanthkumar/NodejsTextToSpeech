/* Text To Speech Project Using NodeJs  */

// Importing required files and packages here.
const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const gTTS = require("gtts");

// Iniializing express app here.
const app = express();

// Setting port here .
const PORT = 3000 || process.env.PORT;

// Setting up templating engine here .
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serving public folder as static
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  res.render("index");
});

app.post("/convert", (req, res, next) => {
  const text = req.body.text;
  const language = req.body.language;

  const outputFilePath = `${Date.now()}-output.mp3`;

  var gtts = new gTTS(text, language);

  gtts.save(outputFilePath, function (err, result) {
    if (err) {
      fs.unlinkSync(outputFilePath);
      res.send("Unable to convert!");
    }
    res.download(outputFilePath, function (err) {
      if (err) {
        fs.unlinkSync(outputFilePath);
        res.send("Unable to download the file");
      }
      fs.unlinkSync(outputFilePath);
      console.log("Text to speech converted!");
    });
  });
});

app.post("/preview", (req, res, next) => {
  console.log(req.body);
  const { text, language } = req.body;
  const outputFilePath = `${Date.now()}-output.mp3`;

  var gtts = new gTTS(text, language);

  gtts.save(outputFilePath, function (err, result) {
    if (err) {
      fs.unlinkSync(outputFilePath);
      res.send("Unable to convert!");
    }
    res.download(outputFilePath, function (err) {
      if (err) {
        fs.unlinkSync(outputFilePath);
        res.send("Unable to download the file");
      }
      res.sendFile(path.join(__dirname,outputFilePath));
      fs.unlinkSync(outputFilePath);
      console.log("Text to speech converted!");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server started at Port Number ${PORT}`);
});
