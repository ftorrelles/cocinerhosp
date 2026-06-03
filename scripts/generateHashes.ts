/**
 * Genera hashes bcryptjs para actualizar en Supabase.
 * bcryptjs usa $2a$ (compatible con $2b$).
 * Ejecutar: npx tsx scripts/generateHashes.ts
 */
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

const users = [
  { username: 'francisco', pin: '1234' },
  { username: 'rina', pin: '0116' },
]

async function main() {
  console.log('═'.repeat(50))
  console.log('  Generando hashes bcryptjs para CocinerHosp')
  console.log('═'.repeat(50))
  console.log()

  for (const user of users) {
    const hash = bcrypt.hashSync(user.pin, SALT_ROUNDS)
    const verify = bcrypt.compareSync(user.pin, hash)

    console.log(`Usuario:    ${user.username}`)
    console.log(`PIN:        ${user.pin}`)
    console.log(`Hash:       ${hash}`)
    console.log(`Verify:     ${verify ? '✅ OK' : '❌ FAIL'}`)
    console.log()

    // SQL directo para copiar/pegar
    console.log(`-- SQL para ${user.username}:`)
    console.log(`UPDATE public.usuarios SET pin_hash = '${hash}' WHERE username = '${user.username}';`)
    console.log()
  }

  console.log('═'.repeat(50))
  console.log('  Copiá los UPDATE SQL de arriba al SQL Editor de Supabase')
  console.log('═'.repeat(50))
}

main().catch(console.error)
