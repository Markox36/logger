import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";

import type { InferLogType, InternalConfig, LogLevel, MarkoxLoggerConfig } from "./types.js";

/* ------------------ defaults ------------------ */

const DEFAULT_LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "#8a8888",
  info: "#4287f5",
  warn: "#ffd042",
  error: "#ff4242",
};

const DEFAULT_TYPE_COLORS = {
  DEFAULT: "#ffffff",
};

const DEFAULT_NAME_COLOR = "#00ffff";

const INTERNAL_FILE_BASENAMES = new Set(["logger.ts", "logger.js", "logger.cjs", "logger.mjs"]);

/* ------------------ inferred log type ------------------ */

type LogType<TTypes extends Record<string, string> | undefined> = InferLogType<TTypes>;

/* ------------------ logger class ------------------ */
export class MarkoxLogger<TTypes extends Record<string, string> | undefined = undefined> {
  private readonly config: InternalConfig<TTypes>;
  private readonly logFilePath: string;

  constructor(config: MarkoxLoggerConfig<TTypes> = {}) {
    const typeColors = {
      ...DEFAULT_TYPE_COLORS,
      ...config.types,
    };

    this.config = {
      name: config.name,
      nameColor: config.nameColor ?? DEFAULT_NAME_COLOR,
      debug: config.debug ?? false,
      logToFile: config.logToFile ?? false,
      logDir: config.logDir ?? path.resolve(process.cwd(), "logs"),
      levels: { ...DEFAULT_LEVEL_COLORS, ...config.levels },
      types: config.types,
      typeColors,
    };

    this.logFilePath = path.join(
      this.config.logDir,
      `${new Date().toISOString().split("T")[0]}.log`,
    );

    if (this.config.logToFile && !fs.existsSync(this.config.logDir)) {
      fs.mkdirSync(this.config.logDir, { recursive: true });
    }
  }

  /* ------------------ internals ------------------ */

  private formatDate(): string {
    return new Date().toISOString().replace("T", " ").replace("Z", "");
  }

  private getCaller(): string {
    const prev = Error.prepareStackTrace;
    try {
      Error.prepareStackTrace = (_, stack) => stack;
      const err = new Error("Stack trace");
      const stack = err.stack as unknown as NodeJS.CallSite[];
      Error.captureStackTrace(err, this.getCaller);

      for (const cs of stack ?? []) {
        const file = cs.getFileName?.();
        const line = cs.getLineNumber?.();
        if (!file || !line) continue;

        const normalized = path.normalize(file);
        const base = path.basename(normalized).toLowerCase();
        if (!normalized.includes("node_modules") && !INTERNAL_FILE_BASENAMES.has(base)) {
          return `${path.basename(file)}:${line}`;
        }
      }
      return "unknown:0";
    } finally {
      Error.prepareStackTrace = prev;
    }
  }

  private writeToFile(line: string) {
    fs.appendFileSync(this.logFilePath, `${line}\n`, "utf8");
  }

  private output(level: LogLevel, type: LogType<TTypes>, args: unknown[]) {
    if (level === "debug" && !this.config.debug) return;

    const date = this.formatDate();
    const caller = this.getCaller();

    const levelColor = chalk.hex(this.config.levels[level]);
    const typeColor = chalk.hex(this.config.typeColors[type] ?? "#8a8888");

    const typeLabel = `[${type}]`.padEnd(12);
    const nameLabel = this.config.name ? `${this.config.name}`.padEnd(20) : "";
    const nameColor = this.config.name
      ? chalk.hex(this.config.nameColor)(`${this.config.name}`.padEnd(15)) + " | "
      : "";

    const header =
      `${chalk.gray(date)} | ` +
      `${levelColor(level.toUpperCase().padEnd(5))} | ` +
      `${chalk.gray(caller.padEnd(30))} | ` +
      `${nameColor}` +
      `${typeColor(typeLabel)}`;

    const plain =
      `${date} | ${level.toUpperCase()} | ${caller} | ${nameLabel} | [${type}] ` +
      args
        .map((a) => (typeof a === "object" && a !== null ? JSON.stringify(a) : String(a)))
        .join(" ");

    const debugColor = chalk.hex(this.config.levels.debug ? this.config.levels.debug : "#ffffff");

    console.log(debugColor(header), ...args);
    if (this.config.logToFile) this.writeToFile(plain);
  }

  /* ------------------ public api ------------------ */

  /**
   * Logs a debug message with the specified type and arguments.
   *
   * @param type - The type of log message to output.
   * @param args - Additional arguments to include in the log message.
   *
   * @remarks
   * Debug messages are typically used for detailed diagnostic information
   * that is useful during development and troubleshooting.
   */
  debug(type: LogType<TTypes>, ...args: unknown[]) {
    this.output("debug", type, args);
  }

  /**
   * Logs an informational message with the specified type and arguments.
   *
   * @param type - The type of log entry to create
   * @param args - Additional arguments to include in the log output
   * @returns void
   *
   * @example
   * ```typescript
   * logger.info('USER_ACTION', 'User logged in', { userId: 123 });
   * ```
   */
  info(type: LogType<TTypes>, ...args: unknown[]) {
    this.output("info", type, args);
  }

  /**
   * Logs a warning message with the specified type and arguments.
   *
   * @param type - The type of log message to be recorded
   * @param args - Additional arguments to be logged with the warning message
   *
   * @example
   * ```typescript
   * logger.warn('ValidationError', 'Invalid input detected', { field: 'email' });
   * ```
   */
  warn(type: LogType<TTypes>, ...args: unknown[]) {
    this.output("warn", type, args);
  }

  /**
   * Logs an error message with the specified type and arguments.
   *
   * @param type - The type of log entry to create
   * @param args - Additional arguments to be logged with the error message
   * @returns void
   */
  error(type: LogType<TTypes>, ...args: unknown[]) {
    this.output("error", type, args);
  }
}
