import express from "express";
import { readFileSync } from "fs";
import fs from "fs";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json())
let packageJSON = JSON.parse(readFileSync("././messages.json"));

var messages = packageJSON
packageJSON = JSON.parse(readFileSync("././recepteurs.json"));

var recepteurs = packageJSON
let reqe = null
app.use("/",express.static("./static"));

// API for messages


app.get("/messages", (req, res) => {
  res.json(messages);
})

app.post("/messages/create", (req, res) => {
  console.log(req.body)
  messages.push(req.body);
  save();
  res.json({
    status: "success",
    term: req.body
  })
} )

app.delete("/messages/", (req, res) => {
  let reqe = JSON.stringify(req.query)
  reqe = JSON.parse(reqe);
  messages = messages.filter(element => element.emetteur.localeCompare(reqe.emetteur) !== 0)
  save();
  res.json({
    status: "success"
  })
})


// API for recepteurs

app.get("/recepteurs", (req, res) => {
  res.json(recepteurs);
})

app.post("/recepteurs/create", (req, res) => {
  recepteurs.push(req.body);
  saveR();
  res.json({
    status: "success",
    term: req.query
  })
} )

app.delete("/recepteurs/", (req, res) => {
  let reqe = JSON.stringify(req.body)
  reqe = JSON.parse(reqe);
  recepteurs = recepteurs.filter(element => element.publicKey.localeCompare(reqe.publicKey) !== 0)
  saveR();
  res.json({
    status: "success"
  })
})

const save = () => {
  fs.writeFile("./messages.json", JSON.stringify(messages, null, 2), err => {
    if(err){
      throw err;
    }
  })
}

const saveR = () => {
  fs.writeFile("./recepteurs.json", JSON.stringify(recepteurs, null, 2), err => {
    if(err){
      throw err;
    }
  })
}
app.listen(8991, () =>
  console.log("Application is running: <http://localhost:8991/>")
);

