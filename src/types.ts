export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Infer LogType from the keys of `types`
 */
export type InferLogType<T> =
  T extends Record<infer K, any> ? (K extends string ? K : never) : string;

export interface MarkoxLoggerConfig<TTypes extends Record<string, string> | undefined = undefined> {
  name?: string;
  nameColor?: string;
  debug?: boolean;
  logToFile?: boolean;
  logDir?: string;

  levels?: Partial<Record<LogLevel, string>>;
  types?: TTypes;
}

export type InternalConfig<TTypes extends Record<string, string> | undefined> = {
  name?: string;
  nameColor: string;
  debug: boolean;
  logToFile: boolean;
  logDir: string;
  levels: Record<LogLevel, string>;
  types?: TTypes;
  typeColors: Record<string, string>;
};
