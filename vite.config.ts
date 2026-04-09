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
    const API_ADDRESS = env['VITE_API_ADDRESS'] ?? defConfigs.apiAddress

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
            tsconfigPaths: true, // resolve imports using TypeScript's path definition (replaces resolve.alias). If you want to directly run `vite build` in the commandline, you must manually resolve the path aliases here:
            // alias: {
            //     '@': fileURLToPath(new URL('./src', import.meta.url)),
            //     '@assets': fileURLToPath(
            //         new URL('./src/assets', import.meta.url)
            //     ),
            // }
        },
        appType: 'custom', // don't include Vite's default HTML handling middlewares
        build: {
            outDir: 'dist',
        },
        preview: {
            allowedHosts: true, // to allow all incoming request from all addresses
        },
        server: {
            middlewareMode: true,
            proxy: {
                // '/api': `${API_ADDRESS}`,
                '/api': {
                    target: 'https://fakeapi.net/products',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
        oxc: {
            jsx: {
                // use Vite to transform any JSX syntax
                runtime: 'automatic', // automatically add import JSX package for JSX/TSX files
                development: true, // enable development specific transforms ??
                throwIfNamespace: true, // throw error if the XML namespaced tag names (e.g. <foo:bar baz:qux="foobar" />) are used.
                pure: false, // enable pure annotation (annotation comments that can be safely removed) for JSX elements
                importSource: 'jsx-dom', // the package to be automatically imported for JSX/TSX file
                pragma: 'React.createElement', // h factory function
                pragmaFrag: 'React.Fragment', // fragment element
            },
            // When transforming TSX files:
            typescript: {
                jsxPragma: 'React.createElement', // same value with `jsx.pragma`
                jsxPragmaFrag: 'React.Fragment', // same value with `jsx.pragmaFrag`
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
