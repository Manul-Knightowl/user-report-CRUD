import DynamoDB from 'aws-sdk/clients/dynamodb.js';

const docClient = new DynamoDB.DocumentClient();

export const getAllReports = async (event) => {
    let reports = [];
    let lastEvaluatedKey = null;

    try {
        do {
            const params = {
                TableName: 'Reports',
                ExclusiveStartKey: lastEvaluatedKey 
            };

            const result = await docClient.scan(params).promise();
            reports = reports.concat(result.Items); 
            lastEvaluatedKey = result.LastEvaluatedKey; 

        } while (lastEvaluatedKey); 

        return {
            statusCode: 200,
            body: JSON.stringify(reports),
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
