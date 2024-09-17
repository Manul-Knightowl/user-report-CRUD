import DynamoDB from 'aws-sdk/clients/dynamodb.js';

const docClient = new DynamoDB.DocumentClient();

export const getAllReports = async (event) => {
    try {
        const result = await docClient.scan({
            TableName: 'Reports',
        }).promise();

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
