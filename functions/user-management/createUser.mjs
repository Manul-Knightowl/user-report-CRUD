import { nanoid } from 'nanoid';
import DynamoDB from 'aws-sdk/clients/dynamodb.js';

const docClient = new DynamoDB.DocumentClient();

export const createUser = async (event) => {
    try {
        const { firstName, lastName, email, contactnumber, password } = JSON.parse(event.body);

       
        if (!firstName || !lastName || !email || !contactnumber || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields: firstName, lastName, email, contactnumber, and password are required',
                }),
            };
        }

        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid email format',
                }),
            };
        }

       
        const contactNumberRegex = /^\d{10}$/;
        if (!contactNumberRegex.test(contactnumber)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid contact number format. It should be a 10-digit number',
                }),
            };
        }

        const now = new Date().toISOString();

        await docClient.put({
            TableName: 'Users',
            Item: {
                id: nanoid(8), 
                firstName,
                lastName,
                email,
                contactnumber,
                password, 
                createdAt: now,
            },
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'User is created successfully' }),
        };
    } catch (error) {
        console.error('Error creating user:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error creating user. Please try again later.',
            }),
        };
    }
};
