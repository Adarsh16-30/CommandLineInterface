import fs from "fs-extra";
import path from "path";
import os from "os";
import { z } from "zod";

export const userConfigurationFilePath = path.join(os.homedir(), ".mycli-config.json");
const credentialsFilePath = path.join(os.homedir(), ".mycli-credentials.json");

const ConfigurationSchema = z.object({
  theme: z.string().optional().default("dark"),
  telemetryEnabled: z.boolean().optional().default(false),
  defaultProfile: z.string().optional().default("default"),
}).catchall(z.any());

export const loadConfig = async () => {
  if (!fs.existsSync(userConfigurationFilePath)) return ConfigurationSchema.parse({});
  try {
    const rawData = fs.readJsonSync(userConfigurationFilePath);
    return ConfigurationSchema.parse(rawData);
  } catch (parseError) {
    return ConfigurationSchema.parse({});
  }
};

export const saveConfig = async (configurationData) => {
  const validatedData = ConfigurationSchema.parse(configurationData);
  await fs.writeJson(userConfigurationFilePath, validatedData, { spaces: 2 });
  if (process.platform !== "win32") {
    fs.chmodSync(userConfigurationFilePath, 0o600);
  }
};

export const storeSecureIdentity = async (identityProfile, tokenKey, secretValue) => {
  let credentials = {};
  if (fs.existsSync(credentialsFilePath)) {
    try {
      credentials = fs.readJsonSync(credentialsFilePath);
    } catch (e) { }
  }

  if (!credentials[identityProfile]) credentials[identityProfile] = {};
  credentials[identityProfile][tokenKey] = secretValue;

  await fs.writeJson(credentialsFilePath, credentials, { spaces: 2 });
  if (process.platform !== "win32") {
    fs.chmodSync(credentialsFilePath, 0o600);
  }
};

export const retrieveSecureIdentity = async (identityProfile, tokenKey) => {
  if (!fs.existsSync(credentialsFilePath)) return null;
  try {
    const credentials = fs.readJsonSync(credentialsFilePath);
    return credentials[identityProfile]?.[tokenKey] || null;
  } catch (e) {
    return null;
  }
};
