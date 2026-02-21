import fs from "fs-extra";
import crypto from "crypto";
import { success, error, info, warn } from "../utils/colors.js";
import path from "path";
import os from "os";

const ALGORITHM = "aes-256-cbc"; // Standard strong encryption
const KEY_FILE = path.join(os.homedir(), ".mycli-encryption-key");

function getEncryptionKey() {
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length === 64) {
    return Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  }

  if (fs.existsSync(KEY_FILE)) {
    const keyHex = fs.readFileSync(KEY_FILE, "utf8").trim();
    return Buffer.from(keyHex, "hex");
  }

  const newKey = crypto.randomBytes(32); // 32 bytes = 256 bits
  fs.writeFileSync(KEY_FILE, newKey.toString("hex"));
  warn(`New encryption key generated and saved to: ${KEY_FILE}`);
  warn(`Keep this file safe! Without it, you cannot decrypt your files.`);
  return newKey;
}

function encrypt(text) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16); // Initialization Vector
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encryptedData) {
  const key = getEncryptionKey();
  const parts = encryptedData.split(":");
  
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted data format");
  }
  
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

export default function (program) {
  const secret = program.command("secret").description("Encrypt/Decrypt secrets");

  secret
    .command("encrypt <file>")
    .description("Encrypt a file")
    .action(async (file) => {
      try {
        if (!fs.existsSync(file)) return error(`File not found: ${file}`);
        const content = await fs.readFile(file, "utf8");
        const encrypted = encrypt(content);
        const outputFile = file + ".enc";
        await fs.writeFile(outputFile, encrypted);
        success(`File encrypted successfully: ${outputFile}`);
      } catch (err) {
        error(`Encryption failed: ${err.message}`);
      }
    });

  secret
    .command("decrypt <file>")
    .description("Decrypt a file")
    .action(async (file) => {
      try {
        if (!fs.existsSync(file)) return error(`File not found: ${file}`);
        const encryptedContent = await fs.readFile(file, "utf8");
        const decrypted = decrypt(encryptedContent);
        const outputFile = file.replace(".enc", ".dec");
        await fs.writeFile(outputFile, decrypted);
        success(`File decrypted successfully: ${outputFile}`);
      } catch (err) {
        if (err.message.includes("bad decrypt")) {
          error(`Decryption failed: Wrong encryption key or corrupted file`);
          info(`Make sure you're using the same key that was used for encryption`);
        } else {
          error(`Decryption failed: ${err.message}`);
        }
      }
    });

  secret
    .command("key-info")
    .description("Display encryption key information")
    .action(() => {
      if (fs.existsSync(KEY_FILE)) {
        info(`Encryption key file: ${KEY_FILE}`);
      } else {
        warn(`No encryption key found. One will be created on first use.`);
      }
    });
}