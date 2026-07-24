/**
 * Seeds / upserts the `products` collection with the full product catalog,
 * including the product-detail content (descriptions, benefits, features,
 * how-to-use steps, gallery, FAQs).
 *
 * Usage:
 *   MONGODB_URI="mongodb+srv://..." node scripts/seed-products.mjs
 *
 * Flags:
 *   --reset   Delete every existing product before inserting.
 *   --dry     Print what would change without writing to the database.
 *
 * Safe to run repeatedly: products are matched on `productId` and upserted,
 * so re-running refreshes content instead of creating duplicates.
 */

import { MongoClient } from 'mongodb'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'skincare'

const args = new Set(process.argv.slice(2))
const shouldReset = args.has('--reset')
const isDryRun = args.has('--dry')

if (!uri) {
  console.error('\n  Missing MONGODB_URI.\n')
  console.error('  Example:')
  console.error('    MONGODB_URI="mongodb+srv://user:pass@cluster/" node scripts/seed-products.mjs\n')
  process.exit(1)
}

async function loadProducts() {
  // The JSON export is the single source of truth for this script so it can run
  // under plain Node without a TypeScript loader.
  const file = join(__dirname, 'products.json')
  const raw = await readFile(file, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(`Expected a non-empty array of products in ${file}`)
  }

  return parsed
}

async function main() {
  const products = await loadProducts()
  console.log(`\n  Loaded ${products.length} products from scripts/products.json`)

  if (isDryRun) {
    for (const product of products) {
      console.log(`    · [${product.productId}] ${product.name} → /product/${product.slug}`)
    }
    console.log('\n  Dry run: nothing was written.\n')
    return
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    const collection = client.db(dbName).collection('products')

    if (shouldReset) {
      const { deletedCount } = await collection.deleteMany({})
      console.log(`  Reset: removed ${deletedCount} existing products`)
    }

    // Unique indexes keep productId/slug collisions out of the catalog and make
    // the detail-page slug lookup fast.
    await collection.createIndex({ productId: 1 }, { unique: true })
    await collection.createIndex({ slug: 1 }, { unique: true })

    const operations = products.map((product) => ({
      updateOne: {
        filter: { productId: product.productId },
        update: {
          $set: { ...product, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() },
        },
        upsert: true,
      },
    }))

    const result = await collection.bulkWrite(operations, { ordered: false })

    console.log(`  Inserted: ${result.upsertedCount}`)
    console.log(`  Updated:  ${result.modifiedCount}`)
    console.log(`  Total in collection: ${await collection.countDocuments()}`)
    console.log('\n  Done.\n')
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('\n  Seed failed:', error.message, '\n')
  process.exit(1)
})
