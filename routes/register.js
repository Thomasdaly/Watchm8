const express = require('express');
const router = express.Router();
const Joi = require('joi');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Users'; // Replace with your DynamoDB table name


router.get('/', function (req, res, next) {
    res.render('register', { title: 'Register' });
});
// Register a new user
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists in DynamoDB
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Create a new user item in DynamoDB
    const newUser = {
      TableName: Users,
      Item: {
        email,
        password, // Note: You should hash and salt the password before storing it
      },
    };

    await dynamodb.put(newUser).promise();

    // Optionally, you can log the user in automatically after registration

    res.redirect('/login'); // Redirect to the login page after successful registration
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to get a user by email from DynamoDB
async function getUserByEmail(email) {
  const params = {
    TableName: tableName,
    Key: { email },
  };
  const result = await dynamodb.get(params).promise();
  return result.Item;
}

module.exports = router;