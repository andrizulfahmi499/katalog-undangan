const fs = require('fs').promises
const path = require('path')

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

async function main() {
  const root = process.cwd()
  const srcStatic = path.join(root, '.next', 'static')
  const destStandalone = path.join(root, '.next', 'standalone', '.next')
  const srcPublic = path.join(root, 'public')
  const destPublic = path.join(root, '.next', 'standalone', 'public')

  try {
    await copyDirectory(srcStatic, destStandalone)
    await copyDirectory(srcPublic, destPublic)
    console.log('Copied standalone assets successfully.')
  } catch (error) {
    console.error('Failed to copy standalone assets:', error)
    process.exit(1)
  }
}

main()
