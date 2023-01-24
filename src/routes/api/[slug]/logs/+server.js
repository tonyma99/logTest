import db from "$lib/db"

export async function GET({ params }) {
    let query = (params.slug === '*') ? null : { name: params.slug }

    const result = await db.collection('results').find(query).toArray()
    
    return new Response(JSON.stringify(result))
}
