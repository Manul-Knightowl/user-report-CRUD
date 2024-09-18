import DynamoDB from 'aws-sdk/clients/dynamodb.js';

const docClient = new DynamoDB.DocumentClient();

export const getALLUsers = async () => {
    let users = [];
    let lastEvaluatedKey = null;

    try {
        do {
            const params = {
                TableName: 'Users',
                ExclusiveStartKey: lastEvaluatedKey // Pagination
            };

            const data = await docClient.scan(params).promise();
            users = users.concat(data.Items);
            lastEvaluatedKey = data.LastEvaluatedKey;

        } while (lastEvaluatedKey);

        return {
            statusCode: 200,
            body: JSON.stringify({ users }),
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
