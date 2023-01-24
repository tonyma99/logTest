import db from "$lib/db"
import { ObjectId } from 'mongodb'

export async function POST({ params }) {
    try {
        const key = params.slug
        const logs = db.collection('results')
        const query = { _id: ObjectId(key) }
        const update = {
            $set: {
                result: 2
            }
        }

        await logs.updateOne(query, update)
        console.log(`A document with _id: ${key} marked as pass`);
    } catch (e) {
        console.log(e)
        return new Response(JSON.stringify({ status: 500 }))
    }
    
    
    return new Response(JSON.stringify({ status: 201 }))
}