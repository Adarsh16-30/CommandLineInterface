import fs from "fs-extra";
import path from "path";
import yaml from "yaml";
import chalk from "chalk";
import { exec } from "child_process";
import util from "util";
import { logger } from "../utils/logger.js";

const executeProcessAsync = util.promisify(exec);

export default function registerWorkflowCommand(program) {
    program
        .command("workflow <file> [jobName]")
        .description("Execute an automated workflow from a YAML file")
        .action(async (workflowFilePath, requestedJobName) => {
            const jsonOut = process.argv.includes("--output") && process.argv.includes("json");
            const targetFilePath = path.resolve(process.cwd(), workflowFilePath);

            try {
                if (!fs.existsSync(targetFilePath)) {
                    throw new Error(`Workflow file not found: ${targetFilePath}`);
                }

                const rawYamlContent = await fs.readFile(targetFilePath, "utf8");
                const parsedWorkflowDocument = yaml.parse(rawYamlContent);

                if (!parsedWorkflowDocument || !parsedWorkflowDocument.steps) {
                    throw new Error("Invalid workflow file format. 'steps' array is required.");
                }

                if (!jsonOut) {
                    console.log(chalk.cyan(`\n🚀 Starting Workflow Execution: ${parsedWorkflowDocument.name || 'Unnamed'}`));
                }

                const executionResults = [];
                for (const [stepIndex, pipelineStep] of parsedWorkflowDocument.steps.entries()) {
                    const stepIdentifier = `Step ${stepIndex + 1}`;
                    if (!jsonOut) console.log(chalk.gray(`\n▶ Executing ${stepIdentifier}: ${pipelineStep.run}`));

                    try {
                        const { stdout, stderr } = await executeProcessAsync(`node index.js ${pipelineStep.run}`);
                        executionResults.push({ step: stepIdentifier, status: "success", output: stdout.trim() });
                        if (!jsonOut) console.log(chalk.green(`✔ ${stepIdentifier} succeeded:\n`), stdout.trim());
                    } catch (stepExecutionError) {
                        executionResults.push({ step: stepIdentifier, status: "failed", error: stepExecutionError.message });
                        logger.error(`Workflow ${stepIdentifier} failed`, { command: pipelineStep.run, error: stepExecutionError.message });
                        if (!jsonOut) console.error(chalk.red(`✖ ${stepIdentifier} failed:\n`), stepExecutionError.message);
                        process.exit(1);
                    }
                }

                if (jsonOut) {
                    console.log(JSON.stringify({ status: "completed", results: executionResults }));
                } else {
                    console.log(chalk.green.bold("\n✨ Workflow execution completed successfully."));
                }
                process.exit(0);

            } catch (workflowProcessingError) {
                logger.error("Workflow initialization failed", { error: workflowProcessingError.message });
                if (jsonOut) {
                    console.error(JSON.stringify({ status: "failed", error: workflowProcessingError.message }));
                } else {
                    console.error(chalk.red(`✖ Workflow Error: ${workflowProcessingError.message}`));
                }
                process.exit(1);
            }
        });
}
