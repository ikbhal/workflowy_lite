// create  node js express server runing on port 3006 which allow access files at static folder 

const express = require('express');
const app = express();
const path = require('path');
const port = 3006;

//static attach to express
app.use(express.static(path.join(__dirname, 'static')));

// run server
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
