import db from "$lib/db"

export async function GET({ params }) {
    const result = await db.collection('results').find({
        name: params.slug,
    }).toArray()
    
    return new Response(JSON.stringify(result))
}
