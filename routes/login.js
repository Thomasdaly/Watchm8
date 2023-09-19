const express = require('express');
const router = express.Router();
const Joi = require('joi');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
router.get('/', function (req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post('/', async function (req, res, next) {
    const userSchema = Joi.object().keys({
        'email': Joi.string().alphanum().min(5).max(30).required(),
        'password': Joi.string().alphanum().min(8).max(50).required(),
    });
    const loginDetails = {
        'email': req.body.email,
        'password': req.body.password,
    };
    const result = userSchema.validate(loginDetails);

    if (result.error) {
        // Handle validation error
        return res.render('login', {
            'login': loginDetails,
            'message': 'Validation error: Please check your inputs',
            'active': 'profile'
        });
    }

    try {
        // Check if the user exists in DynamoDB
        const params = {
            TableName: tableName,
            Key: {
                'email': loginDetails.email,
            },
        };
        const user = await dynamodb.get(params).promise();

        if (!user.Item || user.Item.password !== loginDetails.password) {
            // User not found or password doesn't match
            return res.render('login', {
                'login': loginDetails,
                'message': 'Invalid email or password',
                'active': 'profile'
            });
        }

        // User authenticated successfully
        req.session.profile = user.Item;
        res.redirect('/');
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;