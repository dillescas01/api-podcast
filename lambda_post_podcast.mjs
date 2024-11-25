import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    // Verificación de token (pendiente de implementación)

    console.log(event);
    const creator_email = event["body"]["creator_email"];
    const genre_release_date = event["body"]["genre#release_date"];
    const podcast_uuid = uuidv4(); // GSI
    const genre = event["body"]["genre"];
    const name = event["body"]["name"];
    const description = event["body"]["description"];
    const data = event["body"]["data"];
    const tableName = process.env.TABLE_NAME;

    if (!(creator_email && genre_release_date && genre && name && description && data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Todos los campos son obligatorios."
            })
        };
    }

    const item = {
        "creator_email": creator_email,
        "genre#release_date": genre_release_date,
        "podcast_uuid": podcast_uuid,
        "genre": genre,
        "name": name,
        "description": description,
        "data": data
    };

    const putCommand = new PutCommand({
        TableName: tableName,
        Item: item
    });

    try {
        await docClient.send(putCommand);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Podcast agregado exitosamente.',
                podcast_uuid: podcast_uuid
            })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error al agregar el podcast.',
                error: err.message
            })
        };
    }
};
