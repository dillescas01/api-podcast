import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const podcast_uuid = event["body"]["podcast_uuid"];
    const tableName = process.env.TABLE_NAME;

    const queryCommand = new QueryCommand({
        TableName: tableName,
        IndexName: "podcast_uuid-index",
        KeyConditionExpression: "podcast_uuid = :podcast_uuid",
        ExpressionAttributeValues: {
            ":podcast_uuid": podcast_uuid
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
