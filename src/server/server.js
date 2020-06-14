let projectData = {};

var path = require('path')
const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('dist'))

console.log(__dirname)

app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    //res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})


// app.get('/test', async (req, res) => {
//     res.json({ message: 'pass!' })
// })


const dotenv = require('dotenv');
dotenv.config();

app.get("/all", function (req, res) {
    res.send(JSON.stringify(projectData));
});

app.post('/addData', function (req, res) {
    projectData['pixa'] = req.body.pixa;
    projectData['country'] = req.body.country;
    projectData['latitude'] = req.body.latitude;
    projectData['longitude'] = req.body.longitude;
    projectData['high'] = req.body.high;
    projectData['low'] = req.body.low;
    res.send(JSON.stringify(projectData));
});

module.exports = app
