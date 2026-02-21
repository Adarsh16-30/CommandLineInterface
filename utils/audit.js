import fs from "fs-extra";
import path from "path";
import os from "os";

const auditLogsDirectoryPath = path.join(os.homedir(), ".mycli", "logs");
fs.ensureDirSync(auditLogsDirectoryPath);

const auditLogFilePath = path.join(auditLogsDirectoryPath, "audit.log");

export function recordAuditEntry(executedCommandContext, commandArgumentsArray, actingUser = process.env.USER || process.env.USERNAME || "unknown-user") {
    const securityAuditEntry = {
        timestamp: new Date().toISOString(),
        user: actingUser,
        command: executedCommandContext,
        arguments: commandArgumentsArray
    };
    fs.appendFileSync(auditLogFilePath, JSON.stringify(securityAuditEntry) + "\n");
}
