/**
 * Connection Test Script
 * Run: node test-connections.mjs
 * Tests Firebase Firestore and ImageKit connectivity
 */

import { readFileSync } from 'fs'
import crypto from 'crypto'

// ─── Load .env.local manually ───────────────────────────────────────────────
let env = {}
try {
  const envFile = readFileSync('.env.local', 'utf8')
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '')
  }
} catch (e) {
  console.error('Error reading .env.local file. Please make sure it exists.')
  process.exit(1)
}

const FIREBASE_PROJECT_ID   = env['VITE_FIREBASE_PROJECT_ID']
const FIREBASE_API_KEY      = env['VITE_FIREBASE_API_KEY']
const URL_ENDPOINT          = env['VITE_IMAGEKIT_URL_ENDPOINT']
const PUBLIC_KEY            = env['VITE_IMAGEKIT_PUBLIC_KEY']
const PRIVATE_KEY           = env['VITE_IMAGEKIT_PRIVATE_KEY']

console.log('\n╔══════════════════════════════════════════╗')
console.log('║   Islampur Civil — Connection Tests       ║')
console.log('╚══════════════════════════════════════════╝\n')

// ─── 1. Firebase Firestore Check ────────────────────────────────────────────
console.log('🔥 [1/2] Testing Firebase Firestore ...')
console.log(`   Project ID : ${FIREBASE_PROJECT_ID}`)
console.log(`   API Key    : ${FIREBASE_API_KEY?.slice(0, 10)}...`)

const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/listings?pageSize=1&key=${FIREBASE_API_KEY}`

try {
  const res = await fetch(firestoreUrl)
  if (res.ok || res.status === 200) {
    const data = await res.json()
    const count = data.documents?.length ?? 0
    console.log(`   ✅ CONNECTED — Found ${count} listing document(s) in Firestore\n`)
  } else if (res.status === 403) {
    console.log(`   ✅ CONNECTED — Firebase responded (Firestore rules active, status 403)\n`)
  } else {
    const body = await res.text()
    console.log(`   ❌ FAILED — HTTP ${res.status}: ${body.slice(0, 200)}\n`)
  }
} catch (e) {
  console.log(`   ❌ FAILED — ${e.message}\n`)
}

// ─── 2. ImageKit Ping Check ──────────────────────────────────────────────────
console.log('☁️  [2/2] Testing ImageKit ...')
console.log(`   URL Endpoint  : ${URL_ENDPOINT}`)
console.log(`   Public Key    : ${PUBLIC_KEY?.slice(0, 10)}...`)
console.log(`   Private Key   : ${PRIVATE_KEY ? 'Present' : 'Missing'}`)

const token = crypto.randomUUID()
const expire = Math.floor(Date.now() / 1000) + 1800
const signature = crypto
  .createHmac('sha1', PRIVATE_KEY || '')
  .update(token + expire)
  .digest('hex')

const imagekitUrl = 'https://upload.imagekit.io/api/v1/files/upload'

try {
  const form = new FormData()
  form.append('publicKey', PUBLIC_KEY || '')
  form.append('signature', signature)
  form.append('token', token)
  form.append('expire', expire.toString())
  form.append('fileName', 'test.txt')
  // We send the form without file to test credentials

  const res = await fetch(imagekitUrl, { method: 'POST', body: form })
  const data = await res.json()

  if (res.status === 400 && data.message?.toLowerCase().includes('file')) {
    // 400 "file is a required field" means keys + signature are valid!
    console.log(`   ✅ CONNECTED — ImageKit keys and endpoint are valid and reachable!\n`)
  } else if (res.status === 401 || res.status === 403 || data.message?.toLowerCase().includes('auth') || data.message?.toLowerCase().includes('signature')) {
    console.log(`   ❌ FAILED — ImageKit rejected credentials (HTTP ${res.status}): ${data.message}\n`)
    console.log(`   → Please check VITE_IMAGEKIT_PUBLIC_KEY and VITE_IMAGEKIT_PRIVATE_KEY in .env.local\n`)
  } else {
    console.log(`   ℹ️  ImageKit responded (HTTP ${res.status}): ${JSON.stringify(data).slice(0, 200)}\n`)
  }
} catch (e) {
  console.log(`   ❌ FAILED — ${e.message}\n`)
}

console.log('══════════════════════════════════════════\n')
