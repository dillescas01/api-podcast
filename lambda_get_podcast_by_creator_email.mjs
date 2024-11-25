import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const creator_email = event["body"]["creator_email"];
    const tableName = process.env.TABLE_NAME;

    const queryCommand = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "creator_email = :creator_email",
        ExpressionAttributeValues: {
            ":creator_email": creator_email
        }
    });

    try {
        const response = await docClient.send(queryCommand);
        return {
            statusCode: 200,
            body: JSON.stringify({
                count: response.Count,
                items: response.Items
            })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
