import DynamoDB from 'aws-sdk/clients/dynamodb.js';

const docClient = new DynamoDB.DocumentClient();

export const getReport = async (event) => {
    try {
        // Parse the input from the request body
        const { refNum, nic, name, age } = JSON.parse(event.body);

        // Ensure all fields are provided
        if (!refNum || !nic || !name || !age) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'All fields are required',
                }),
            };
        }

        // Initialize scan parameters
        const params = {
            TableName: 'Reports',
            FilterExpression: '#name = :name AND nic = :nic AND id = :id',
            ExpressionAttributeNames: {
                '#name': 'name', // Use an alias for the reserved keyword
            },
            ExpressionAttributeValues: {
                ':name': name,
                ':nic': nic,
                ':id': refNum,
            },
        };

        // Execute scan operation
        const result = await docClient.scan(params).promise();

        if (result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No reports found matching the criteria',
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        console.error('Error retrieving reports:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error retrieving reports. Please try again later.',
            }),
        };
    }
};
