/**
 * Utility functions
 *
 * @module launcher/lib/utils
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

/**
 * Resolves the file/folder path using the given base path and returns the resolved path as a string
 *
 * @param {string} inBase base path
 * @param {string} inPath file/folder path which is relative to the base path
 * @returns {string} resolved path
 */
export const resolve = (inBase: string, inPath: string) =>
    path.resolve(inBase, inPath)

/**
 * Resolves the file/folder path using the given base path and returns the resolved path as an URL object
 *
 * @param {string} inBase base path
 * @param {string} inPath file/folder path which is relative to the base path
 * @returns {URL} resolved path
 */
export const resolveToURL = (inBase: string, inPath: string): URL =>
    pathToFileURL(resolve(inBase, inPath))

/**
 * Extracts the folder name from the given input url
 *
 * @param {string} url the input url
 * @returns {string} extracted directory
 */
export const extractDir = (url: string): string =>
    path.dirname(fileURLToPath(url))

/**
 * Loads the configuration file containing all the default parameters and settings of the server
 *
 * @param {URL} confFilePath path of the configuration file
 * @returns {Promise<{[x: string]: string;}>} loaded configuration parameters
 */
export async function loadDefConf(
    confFilePath: URL
): Promise<{ [x: string]: string }> {
    const defConfigs_raw = await fs.readFile(confFilePath, 'utf-8')
    const defConfigs = JSON.parse(defConfigs_raw) as { [x: string]: string }
    return defConfigs
}
