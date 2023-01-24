import db from "$lib/db"

export async function POST({ params }) {
    let key

    try {
        const testName = params.slug
        const result = await db.collection('results').insertOne({
            name: testName,
            date: new Date(),
            result: 0,
        })
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        key = result.insertedId
        setTimeout(async () => {
            try {
                const logs = db.collection('results')
                const query = { _id: result.insertedId }
                const update = {
                    $set: {
                        result: 1
                    }
                }
        
                const log = await logs.findOne(query)
                if (log.result !== 2) {
                    await logs.updateOne(query, update)
                    console.log(`A document with _id: ${result.insertedId} marked as fail`);
                }
            } catch (e) {
                console.log(e)
            }
        }, 60000)
    } catch (e) {
        console.log(e)
        return new Response(JSON.stringify({ status: 500 }))
    }
    
    
    return new Response(JSON.stringify({
        status: 201,
        key: key,
    }))
}
