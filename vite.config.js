import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import fs from 'fs'
import path from 'path'

// Custom dev middleware plugin to save JSON responses directly to date-response.json
function jsonStoragePlugin() {
  return {
    name: 'json-storage-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const filePath = path.resolve(process.cwd(), 'date-response.json')
              
              let existing = []
              if (fs.existsSync(filePath)) {
                try {
                  const content = fs.readFileSync(filePath, 'utf-8')
                  const parsed = JSON.parse(content)
                  existing = Array.isArray(parsed) ? parsed : [parsed]
                } catch (e) {
                  existing = []
                }
              }

              const newEntry = {
                id: Date.now(),
                receivedAt: new Date().toISOString(),
                ...data
              }
              existing.push(newEntry)

              fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8')
              console.log('💖 Saved date response to date-response.json successfully!')

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'Saved successfully!', data: newEntry }))
            } catch (err) {
              console.error('Error saving date response:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
        } else {
          res.statusCode = 405
          res.end('Method Not Allowed')
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsonStoragePlugin()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
