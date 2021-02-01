const express = require('express');
const app = express();
const port = 3006;
const url = `http://127.0.0.1:${port}`;

app.get("/", (req, res) => {
 
  res.sendFile(__dirname +`/index.html`)
});

app.listen(port, () => {

});
