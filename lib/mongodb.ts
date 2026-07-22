import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI environment variable is not set')
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(uri as string, {
    serverSelectionTimeoutMS: 5000,
  })
  return client.connect()
}

async function getClient(): Promise<MongoClient> {
  // Lazily connect and never cache a rejected promise: if a previous
  // connection attempt failed (e.g. the database was temporarily down),
  // the next call starts a fresh connection instead of replaying the error.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise()
  }

  try {
    return await global._mongoClientPromise
  } catch (error) {
    global._mongoClientPromise = undefined
    throw error
  }
}

export async function getDb(): Promise<Db> {
  const connectedClient = await getClient()
  return connectedClient.db('colorwhite')
}

export default getClient
