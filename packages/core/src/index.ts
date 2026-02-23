/**
 * Minions Skills SDK
 *
 * Reusable skill definitions that agents can load, compose, and version
 *
 * @module @minions-skills/sdk
 */

export const VERSION = '0.1.0';

/**
 * Example: Create a client instance for Minions Skills.
 * Replace this with your actual SDK entry point.
 */
export function createClient(options = {}) {
    return {
        version: VERSION,
        ...options,
    };
}

export * from './schemas/index.js';
