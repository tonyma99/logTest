import db from "$lib/db"

export async function POST({ params, request }) {
    try {
        const data = await request.json()
        const testName = params.slug
        const result = await db.collection('results').insertOne({
            name: testName,
            date: new Date(),
            result: 0,
            message: data.message,
        })
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (e) {
        console.log(e)
        return new Response(JSON.stringify({ status: 500 }))
    }
    
    
    return new Response(JSON.stringify({ status: 201 }))
}
