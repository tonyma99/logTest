import db from "$lib/db"

export async function POST({ params }) {
    try {
        const testName = params.slug
        const result = await db.collection('results').insertOne({
            name: testName,
            date: new Date(),
            result: 0,
        })
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } catch (e) {
        console.log(e)
        return new Response({ status: 500 })
    }
    
    
    return new Response({ status: 201 })
}
