const express = require('express')
const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());

const AWS = require('aws-sdk');

//credentials & region
AWS.config.update({
    accessKeyId: 'AKIAUWLGSQYQW22LCZMC',
    secretAccessKey: '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',
    region: 'us-east-1'
});

app.post('/getImagedata/:image_data', (req, res) => {
    const image_data = req.params.image_data
    getPrediction(image_data).then((predictions) => {



        res.send(predictions);
    }).catch(error => {
        console.log(error)
        res.sendStatus(500);
    })
    console.log(image_data)

})

function getPrediction(imageFileName) {
    const params = {
        Image: {
            S3Object: {
                Bucket: "custom-labels-console-us-east-1-ba636f36a6",
                Name: `${imageFileName}`
            }
        },
        MaxLabels: 10,
        MinConfidence: 0
    };

    //Call AWS rekogniton Class
    const rekogniton = new AWS.Rekognition();

    return new Promise((resolve, reject) => {
        //Detect labels
        rekogniton.detectLabels(params, function (err, data) {
            if (err) {
                //error occurred
                console.log(err, err.stack);
                reject(err.message);
            }
            else {
                console.log(data);
                resolve(data);
            }
        })
    })


}

app.listen(4000)