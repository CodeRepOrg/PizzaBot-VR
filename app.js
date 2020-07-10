const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const ws = require('./model/ws');
const VR = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

require('dotenv').config()

const app = express();
const upload = multer();

app.set('port', process.env.PORT || 4000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const assistant = new ws(process.env.APIKEY, process.env.ASSISTANTID, process.env.URL);
const vr = new VR({
    version: '2019-02-11',
    authenticator: new IamAuthenticator({
        apikey: process.env.VR_APIKEY
    }),
    url: process.env.VR_URL
});

app.post('/api/watson', upload.single('img'), (req, res) => {
    console.log(req.headers);
    console.log(req.file)

    if (req.headers['content-type'] == 'application/json') {
        assistant.chat(req.body)
            .then(data => res.send(data))
            .catch(err => res.send(err));
    }
    else if (req.file != undefined) {
        vr.classify({
            classifierIds: [process.env.VR_CLASSIFIER],
            imagesFile: Buffer.from(req.file.buffer)
        })
        .then(data => res.send(data))
        .catch(err => res.send(err));
    }
    else res.send({ 'message_type': 'err', 'text': 'mime type não suportado' })
});

app.get('/', (req, res) => {
  res.send('<h3>Proxy</h3>')
});

app.get('/*', (req, res) => {
    res.redirect('/');
});

app.listen(app.get('port'), '0.0.0.0', () => {
  console.log(`Server starting on => ${app.get('port')} `);
})