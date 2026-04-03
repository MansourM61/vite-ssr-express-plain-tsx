import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import * as _ from 'lodash-es'
import TurboConsole from 'unplugin-turbo-console/vite'
import { defineConfig, loadEnv, type UserConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import defConfigs from './vite.default.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig(({ mode, command }): UserConfig => {
    const projFolder = process.cwd()
    const rootDir = join(projFolder, '.')
    const publicDir = join(projFolder, defConfigs.publicDir)
    const envDir = join(projFolder, '.')

    // load all environment variables from `.env` files because `import.meta.env` is not available here
    const env = loadEnv(mode, envDir, defConfigs.envPrefix)
    const WEB_HOST = env['VITE_WEB_HOST'] ?? defConfigs.webHost
    const WEB_PORT = parseInt(env['VITE_WEB_PORT'] ?? defConfigs.webPort, 10)
    const API_HOST = env['VITE_API_HOST'] ?? defConfigs.apiHost
    const API_PORT = parseInt(env['VITE_API_PORT'] ?? defConfigs.apiPort, 10)

    // common configuration shared all environment
    const sharedConfig = {
        base: '/',
        root: join(projFolder, '.'),
        publicDir: join(projFolder, 'public'),
        envDir: join(projFolder, '.'),
        // devtools: true,
        plugins: [
            Inspect(),
            TurboConsole({
                highlight: {
                    themeDetect: true,
                },
                inspector: {
                    printUrl: false,
                },
            }),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@assets': fileURLToPath(
                    new URL('./src/assets', import.meta.url)
                ),
            },
        },
        appType: 'spa', // all requests to all routes will be directed to "index.html".
        build: {
            outDir: 'dist',
        },
        preview: {
            allowedHosts: true, // to allow all incoming request from all addresses
        },
        server: {
            host: WEB_HOST,
            port: WEB_PORT,
            proxy: {
                '/api': `http://${API_HOST}:${API_PORT}`,
            },
        },
    } satisfies UserConfig

    // environment-specific configuration
    let envConfig: UserConfig
    if (command === 'serve') {
        // dev specific config
        envConfig = {
            server: {
                cors: true, // enable CORS for all incoming IP addresses
            },
        } satisfies UserConfig
    } else {
        // command === 'build'
        envConfig = {
            server: {
                cors: {
                    origin: /^https?:\/\/(?:10\.10\.100\.\d{1,3}|localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/, // To be replaced with patterns of all IP addresses/domains that need CORS
                },
            },
        } satisfies UserConfig
    }

    return _.merge(sharedConfig, envConfig)
})
