// helpers.js
// Config file read/write utilities.

import fs from "fs-extra";
import path from "path";
import os from "os";

export const configPath = path.join(os.homedir(), ".mycli-config.json");

export const loadConfig = async () => {
  if (!fs.existsSync(configPath)) return {};
  return fs.readJson(configPath);
};

export const saveConfig = async (data) => {
  await fs.writeJson(configPath, data, { spaces: 2 });
};
