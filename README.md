# @markox/logger

A lightweight, powerful, and highly customizable colorized logger for Node.js with TypeScript support.

## ✨ Features

- 🎨 **Fully Customizable**: Define your own log types and colors.
- 📂 **File Logging**: Automatically save logs to daily rotating files.
- 🔍 **Callsite Detection**: Automatically identifies the file and line number where the log was called.
- 🛡️ **TypeScript First**: Full type safety for your custom log types.
- 🌑 **No Boilerplate**: No environment variables required, works out of the box.
- 🏗️ **Instance & Singleton**: Use it as a class instance or via a shared singleton.

## 🚀 Installation

```bash
npm install @markox/logger
# or
pnpm add @markox/logger
# or
yarn add @markox/logger
```

## 🛠️ Usage

```ts
import { createLogger } from "@markox/logger";

const logger = createLogger({
  name: "MyProject",      // Optional: adds a name tag to all logs
  nameColor: "#00ffff",   // Optional: color for the name tag
  debug: true,            // Enable .debug() logs
  logToFile: true,        // Save logs to a file
  logDir: "./logs",       // Directory for log files
  
  // Custom log types and their colors
  types: {
    API:  "#42a5f5",
    DB:   "#4caf50",
    AUTH: "#ab47bc",
  },

  // Customize standard level colors
  levels: {
    info: "#ffffff",
    warn: "#ffcc00",
  }
});

logger.info("API", "Server started on port 3000");
logger.debug("DB", "Connection established", { host: "localhost" });
logger.warn("AUTH", "Login attempt failed", { user: "admin" });
logger.error("API", "Internal server error", new Error("Unexpected token"));
```

### Using the Singleton

If you don't need a specific configuration everywhere, you can use the default logger:

```ts
import { getLogger } from "@markox/logger";

const logger = getLogger();
logger.info("APP", "This is the default logger instance");
```

### Worker Identification

A common use case for the `name` property is identifying logs from different workers or instances:

```ts
// worker.ts
import { createLogger } from "@markox/logger";

const workerId = process.env.WORKER_ID || "Main";
const logger = createLogger({
  name: `Worker-${workerId}`,
  nameColor: workerId === "Main" ? "#00ffff" : "#ff8800",
});

logger.info("JOB", "Processing task #123");
// Output: [Date] | INFO | worker.ts:10 | Worker-1 | [JOB] Processing task #123
```

## ⚙️ Configuration Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | `undefined` | A name tag displayed at the start of every log. |
| `nameColor` | `string` | `"#00ffff"` | Hex color for the name tag. |
| `debug` | `boolean` | `false` | Whether to display debug level logs. |
| `logToFile` | `boolean` | `false` | If true, logs will be written to a file in `logDir`. |
| `logDir` | `string` | `"./logs"` | Path where log files will be stored. |
| `types` | `Record<string, string>` | `{}` | Custom log categories (keys) and their hex colors (values). |
| `levels` | `Partial<Record<LogLevel, string>>` | (Varies) | Override colors for standard levels (`debug`, `info`, `warn`, `error`). |

## 🧩 TypeScript Support

The logger smartly infers your custom types, providing autocomplete and type checking:

```ts
const logger = createLogger({
  types: {
    NETWORK: "#00ff00",
  }
});

// TypeScript will suggest "NETWORK" and warn if you use something else
logger.info("NETWORK", "Request sent"); 
```

---

> Made with ❤️ by Markox
