// helpers.js
// Tiny helpers for reading and writing the CLI's JSON config file.
// The config lives in the user's home directory so it persists across sessions.

import fs from "fs-extra";
import path from "path";
import os from "os";

// Where we store the user's preferences (theme, saved settings, etc.)
export const configPath = path.join(os.homedir(), ".mycli-config.json");

// Returns the config object, or an empty object if no config exists yet.
export const loadConfig = async () => {
  if (!fs.existsSync(configPath)) return {};
  return fs.readJson(configPath);
};

// Writes the given data object back to disk, pretty-printed for readability.
export const saveConfig = async (data) => {
  await fs.writeJson(configPath, data, { spaces: 2 });
};

