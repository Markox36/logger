import { MarkoxLogger } from "./logger.js";
import type { MarkoxLoggerConfig } from "./types.js";

let defaultLogger: MarkoxLogger | null = null;

/**
 * Creates a new logger instance with optional configuration.
 *
 * @template TTypes - A record type defining custom log types, or undefined for default types
 * @param {MarkoxLoggerConfig<TTypes>} [config] - Optional configuration object for the logger
 * @returns {MarkoxLogger<TTypes>} A new MarkoxLogger instance
 *
 * @example
 * ```typescript
 * import { createLogger } from "@markox36/logger";
 *
 * enum LogType {
 *	API = "API",
 *	DB = "DB",
 *	AUTH = "AUTH",
 * }
 *
 * // Add if you want both ways, strings and enums (add string type if any string wanted)
 * type MyTypes = LogType | "PAYMENTS" | "CACHE"; //
 * // Any string input
 * // type MyTypes = LogType | string; or string;
 *
 * const logger = createLogger<MyTypes>({
 *   types: {
 *     API: "#42a5f5",
 *     DB: "#4caf50",
 *     AUTH: "#ab47bc",
 *   },
 * });
 * logger.info(LogType.API, "Servidor iniciado");
 * logger.info(LogType.DB, "Conectado");
 * logger.info("DATABASE", "hola");
 * ```
 */
export function createLogger<TTypes extends Record<string, string> | undefined = undefined>(
  config?: MarkoxLoggerConfig<TTypes>,
): MarkoxLogger<TTypes> {
  return new MarkoxLogger(config);
}

/**
 * Gets the default logger instance, creating it if it doesn't exist.
 *
 * This function implements a lazy singleton pattern, initializing the default logger
 * only when first accessed.
 *
 * @returns {MarkoxLogger} The default MarkoxLogger instance
 *
 * @example
 * ```typescript
 * const logger = getLogger();
 * logger.info('Application started');
 * ```
 */
export function getLogger(): MarkoxLogger {
  defaultLogger ??= new MarkoxLogger();
  return defaultLogger;
}

export * from "./types.js";
export { MarkoxLogger } from "./logger.js";
