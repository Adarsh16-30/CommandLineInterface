import fs from "fs-extra";
import path from "path";
import os from "os";
import chalk from "chalk";

const logsDirectoryPath = path.join(os.homedir(), ".mycli", "logs");
fs.ensureDirSync(logsDirectoryPath); // Ensure logs directory exists

const logFilePath = path.join(logsDirectoryPath, "cli.log");

export const logger = {
    info: (logMessage, additionalMetadata = {}) => writeStructuredLog("INFO", logMessage, additionalMetadata),
    error: (logMessage, additionalMetadata = {}) => writeStructuredLog("ERROR", logMessage, additionalMetadata),
    debug: (logMessage, additionalMetadata = {}) => {
        if (process.env.DEBUG || process.env.MYCLI_DEBUG) writeStructuredLog("DEBUG", logMessage, additionalMetadata);
    }
};

function writeStructuredLog(severityLevel, logMessage, additionalMetadata) {
    const logEntry = {
        level: severityLevel,
        message: logMessage,
        meta: additionalMetadata,
        timestamp: new Date().toISOString()
    };
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + "\n");
}
