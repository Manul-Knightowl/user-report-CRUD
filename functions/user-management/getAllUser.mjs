
import DynamoDB from 'aws-sdk/clients/dynamodb.js';


const docClient = new DynamoDB.DocumentClient();

export const getALLUsers = async () => {
    try {
        const data = await docClient.scan({ TableName: 'Users' }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ users: data.Items }),
        };
    } catch (error) {
        console.error('Error fetching users:', error); 
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error fetching users.',
            }),
        };
    }
};
