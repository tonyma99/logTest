const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const MONGODB_URI = process.env.MONGODB_URI;

let cachedDb = null;

const clientError = { statusCode: 400 };
const serverError = { statusCode: 500 };

const connectToDatabase = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(process.env.MONGODB_DB);
    cachedDb = db;
    return db;
}

const log = async (params) => {
    if (!params) {
        return clientError;
    }
    
    let response;
    
    try {
        const { name, key } = params;
        const db = await connectToDatabase();
        const logs = db.collection(process.env.MONGODB_COLLECTION);
        
        if (!name && key) {
            return clientError;
        }
        
        if (key) {
            const query = { _id: ObjectId(key), name: name };
            const update = { $set: { end: new Date() } };

            await logs.updateOne(query, update);

            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body:`_id: ${key} marked as passed`
            };
        } else {
            const log = {
                name: name,
                start: new Date()
            }

            const result = await logs.insertOne(log);

            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
                body: result.insertedId
            };
        }
    } catch (e) {
        console.log(e)
        return serverError;
    }

    return response;
};

const getLogs = async () => {
    try {
        const db = await connectToDatabase();
        const logs = await db.collection(process.env.MONGODB_COLLECTION).find({}).toArray();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify(logs)
        };
    } catch (e) {
        console.log(e)
        return clientError;
    }
};

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    switch (event.httpMethod) {
        case 'GET':
            return await getLogs();
        case 'POST':
            return await log(event.queryStringParameters);
        default:
            return clientError;
    }
    return serverError;
};
