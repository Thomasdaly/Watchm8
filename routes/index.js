var express = require('express');
var router = express.Router();
var session = require('express-session');

const AWS = require("aws-sdk");
require("dotenv").config();

/* GET home page. */
router.get('/', function(req, res, next) {
  jsonData.views++;
  uploadJsonToS3();
  res.render('index', { title: 'WatchM8', pageCounter: jsonData.views });
});



// Configure AWS SDK (replace with your own credentials from the AWS console)
// These credentials expire after approx 6 hours, so you will need to refresh them
// It is recommended to put these credentials in an env file and use process.env to retrieve them
// On EC2, you can assign the ec2SSMCab432 IAM role to the instance and the SDK will automatically retrieve the credentials. This will also work from inside a Docker container.
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: "ap-southeast-2",
});

// Create an S3 client
const s3 = new AWS.S3();

// Specify the S3 bucket and object key
const bucketName = "n11134551";
const objectKey = "text.json";

// JSON data to be written to S3
const jsonData = {
  views: 0,
};
router.use((req, res, next) => {
  // Assuming jsonData.views is your view counter data
  res.locals.pageCounter = jsonData.views;
  next();
});

async function createS3bucket() {
  try {
    await s3.createBucket( { Bucket: bucketName }).promise();
    console.log(`Created bucket: ${bucketName}`);
  } catch(err) {
    if (err.statusCode === 409) {
      console.log(`Bucket already exists: ${bucketName}`);
    } else {
      console.log(`Error creating bucket: ${err}`);
    }
  }
}

// Upload the JSON data to S3
async function uploadJsonToS3() {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: JSON.stringify(jsonData), // Convert JSON to string
    ContentType: "application/json", // Set content type
  };

  try {
    await s3.putObject(params).promise();
    console.log("JSON file uploaded successfully.");
  } catch (err) {
    console.error("Error uploading JSON file:", err);
  }
}

// Retrieve the object from S3
async function getObjectFromS3() {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const data = await s3.getObject(params).promise();
    // Parse JSON content
    const parsedData = JSON.parse(data.Body.toString("utf-8"));
    console.log("Parsed JSON data:", parsedData);
    
  } catch (err) {
    console.error("Error:", err);
  }
}

// Call the upload and get functions
(async () => {
  await createS3bucket();
  await uploadJsonToS3();
  await getObjectFromS3();
})();

module.exports = router;
