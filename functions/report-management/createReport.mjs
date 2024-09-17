import { nanoid } from 'nanoid';
import DynamoDB from 'aws-sdk/clients/dynamodb.js';

const docClient = new DynamoDB.DocumentClient();

export const createReport = async (event) => {
    try {
        const { userId, nic, name,age, status, reportUrl } = JSON.parse(event.body);

        if (!userId || !nic || !name || !status || !age|| !reportUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing required fields',
                }),
            };
        }
        
        const user = await docClient.get({
            TableName: 'Users',
            Key: { id : userId },
        }).promise();

        if (!user.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User not found',
                }),
            };
        }

        const now = new Date().toISOString();  

        await docClient.put({
            TableName: 'Reports',
            Item: {
                id: nanoid(8),  
                userId,
                nic,
                name,
                status,
                age,
                reportUrl,
                createdAt: now,
            },
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Report created successfully' }),
        };
    } catch (error) {
        console.error('Error creating report:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error creating report. Please try again later.',
            }),
        };
    }
};
