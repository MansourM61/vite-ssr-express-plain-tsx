import tailwindcss from '@tailwindcss/vite'
import TurboConsole from 'unplugin-turbo-console/vite'
import { defineConfig, type UserConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig(({ mode, command }): UserConfig => {
    return {
        plugins: [
            Inspect(), // for inspecting what happens inside Vite
            TurboConsole({
                // a fancy console at client/server
                highlight: {
                    themeDetect: true,
                },
                inspector: {
                    printUrl: false,
                },
            }),
            tailwindcss(),
        ],
    } satisfies UserConfig
})
