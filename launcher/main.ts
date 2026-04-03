/**
 * Express.js Server with support of TS
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import dotenv from 'dotenv'
import express from 'express'
import type { ViteDevServer } from 'vite'

// path utilities
const __dirname: string = path.dirname(fileURLToPath(import.meta.url))
const root: string = process.cwd()
const resolve = (_path: string) => path.resolve(__dirname, _path)
const resolveToPath = (_path: string) => pathToFileURL(resolve(_path))

const defConfigs_raw = await fs.readFile(
    resolveToPath('../vite.default.json'),
    'utf-8'
)
const defConfigs = JSON.parse(defConfigs_raw)

// Constants
dotenv.config()
const isProduction = process.env['NODE_ENV'] === 'production'
const port = parseInt(process.env['VITE_WEB_PORT'] || defConfigs.webPort, 10)
const base = process.env['BASE'] || '/'

// Cached production assets
const templateHtml = isProduction
    ? await fs.readFile(resolveToPath('./client/index.html'), 'utf-8')
    : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
let vite: ViteDevServer
if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base,
    })
    app.use(vite.middlewares)
} else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.use('*all', async (req, res) => {
    try {
        const url = req.originalUrl.replace(base, '')

        let template: string
        let render: (x: string) => { head: string; html: string }
        if (!isProduction) {
            // Always read fresh template in development
            template = await fs.readFile('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.ts'))[
                'render'
            ]
        } else {
            template = templateHtml

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            render = (await import(resolveToPath('./server/entry-server.js')))
                .render
        }

        const rendered = await render(url)

        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
        if (e instanceof Error) {
            if (!isProduction) {
                vite?.ssrFixStacktrace(e)
                console.log(e.stack)
                res.status(500).end(e.stack)
            } else {
                res.status(500).end(e.message)
            }
        } else {
            console.log(e)
            res.status(500).end('Unknown error')
        }
    }
})

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})
