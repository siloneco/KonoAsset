import fs from 'fs'
import path from 'path'

function readLocaleFiles() {
  const localesDir = path.join('./src', 'locales')
  const files = fs
    .readdirSync(localesDir)
    .filter((file) => file.endsWith('.json'))

  const locales = {}

  files.forEach((file) => {
    const filePath = path.join(localesDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const locale = JSON.parse(content)
    locales[file] = locale
  })

  return locales
}

export default function checkLocaleKeys() {
  const locales = readLocaleFiles()

  // Check if en-US locale exists
  if (!locales['en-US.json']) {
    console.log(
      '❌ en-US.json not found! This file is required as the fallback locale.',
    )
    throw new Error('en-US.json not found!')
  }

  const enUsLocale = locales['en-US.json']

  if (!enUsLocale.data) {
    console.log('❌ en-US.json has no data property!')
    throw new Error('Invalid en-US.json format!')
  }

  const enUsKeys = new Set(Object.keys(enUsLocale.data))
  console.log(`ℹ️ en-US.json contains ${enUsKeys.size} keys`)

  // Collect all unique keys from all locale files
  const allKeys = new Set()
  const keysByFile = {}

  Object.entries(locales).forEach(([filename, locale]) => {
    if (!locale.data) {
      return
    }

    const keys = Object.keys(locale.data)
    keysByFile[filename] = new Set(keys)

    keys.forEach((key) => allKeys.add(key))
  })

  console.log(`ℹ️ Found ${allKeys.size} unique keys across all locale files`)

  // Check if all keys exist in en-US locale
  const missingInEnUs = []

  allKeys.forEach((key) => {
    if (!enUsKeys.has(key)) {
      missingInEnUs.push(key)
    }
  })

  if (missingInEnUs.length === 0) {
    console.log('✅ All keys from all locale files exist in en-US.json!')

    // Optional: Check for keys in en-US that don't exist in other locales
    const filesWithMissingKeys = []

    Object.entries(keysByFile).forEach(([filename, keys]) => {
      if (filename === 'en-US.json') return

      const missingKeys = []
      enUsKeys.forEach((key) => {
        if (!keys.has(key)) {
          missingKeys.push(key)
        }
      })

      if (missingKeys.length > 0) {
        filesWithMissingKeys.push({
          filename,
          missingCount: missingKeys.length,
          missingKeys,
        })
      }
    })

    if (filesWithMissingKeys.length > 0) {
      console.log(
        '\nℹ️ The following locale files are missing some keys (this is informational only):',
      )
      filesWithMissingKeys.forEach((item) => {
        console.log(`- ${item.filename}: missing ${item.missingCount} keys`)
      })
    }
  } else {
    console.log('❌ Some keys are missing in en-US.json!')
    console.log(`Missing keys (${missingInEnUs.length}):`)
    missingInEnUs.forEach((key) => {
      // Find which files contain this key
      const filesWithKey = Object.entries(keysByFile)
        .filter(([_, keys]) => keys.has(key))
        .map(([filename, _]) => filename)

      console.log(`- "${key}" (found in: ${filesWithKey.join(', ')})`)
    })

    throw new Error('Keys missing in en-US.json fallback locale!')
  }
}
