
import fs from "fs";
import { HfInference } from "@huggingface/inference";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { executeWithRetry, executeWithTimeout } from "../utils/resilience.js";
import { loadConfig, retrieveSecureIdentity } from "../utils/helpers.js";

export default (program) => {
  program
    .command("explain [fileOrCode]")
    .description("Explain code using Hugging Face AI")
    .option("-m, --model <model>", "Model to use", "meta-llama/Llama-3.2-3B-Instruct")
    .option("-s, --streaming", "Enable streaming response")
    .action(async (fileOrCode, opts) => {
      const config = await loadConfig();
      const activePlatformProfile = config.defaultProfile || "default";
      const key = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN || await retrieveSecureIdentity(activePlatformProfile, "huggingface");

      if (!key) {
        console.error(chalk.red("HUGGING_FACE_TOKEN missing."));
        console.log(chalk.yellow("Run `mycli auth login` to authenticate to HuggingFace securely."));
        process.exit(1);
      }

      const client = new HfInference(key);

      let code;
      if (!fileOrCode) {
        return console.log(chalk.yellow("Provide a filename or code string"));
      }

      if (fs.existsSync(fileOrCode)) {
        code = fs.readFileSync(fileOrCode, "utf8");
        console.log(chalk.cyan(`Reading file: ${fileOrCode}\n`));
      } else {
        code = fileOrCode;
      }

      const prompt = `Explain the following code in simple terms. Include what it does, inputs, outputs, possible bugs or edge cases, and suggestions:\n\n${code}`;

      try {
        const spinner = ora("Analyzing code...").start();

        if (opts.streaming) {
          spinner.stop();
          console.log(chalk.green("Explanation:\n"));

          const stream = client.chatCompletionStream({
            model: opts.model,
            messages: [
              { role: "user", content: prompt }
            ],
            max_tokens: 1000,
          });

          for await (const chunk of stream) {
            if (chunk.choices?.[0]?.delta?.content) {
              process.stdout.write(chalk.white(chunk.choices[0].delta.content));
            }
          }
          console.log("\n");
        } else {
          const response = await executeWithRetry(() => executeWithTimeout(client.chatCompletion({
            model: opts.model,
            messages: [
              { role: "user", content: prompt }
            ],
            max_tokens: 1000,
          }), 15000));

          spinner.succeed("Analysis complete!\n");
          console.log(chalk.green("Explanation:\n"));
          console.log(chalk.white(response.choices[0].message.content));
        }
      } catch (err) {
        console.error(chalk.red("\nRequest failed:"));
        console.error(chalk.red(err.message || err));

        if (err.message?.includes("rate limit")) {
          console.log(chalk.yellow("Rate limit hit. Try again in a few moments."));
        } else if (err.message?.includes("not found")) {
          console.log(chalk.yellow(`Model "${opts.model}" not available. Try a different model.`));
        }
      }
    });

  program
    .command("chat")
    .description("Start an interactive AI chat session")
    .option("-m, --model <model>", "Model to use", "meta-llama/Llama-3.2-3B-Instruct")
    .action(async (opts) => {
      const config = await loadConfig();
      const activePlatformProfile = config.defaultProfile || "default";
      const key = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN || await retrieveSecureIdentity(activePlatformProfile, "huggingface");

      if (!key) {
        console.error(chalk.red("HUGGING_FACE_TOKEN missing."));
        console.log(chalk.yellow("Run `mycli auth login` to authenticate securely."));
        process.exit(1);
      }

      const client = new HfInference(key);

      const conversationHistory = [];

      console.log(chalk.cyanBright("\n" + "=".repeat(50)));
      console.log(chalk.cyanBright("     AI Chat Session Started          "));
      console.log(chalk.cyanBright("=".repeat(50)));
      console.log(chalk.gray(`\nModel: ${opts.model}`));
      console.log(chalk.yellow("Type 'exit', 'quit', or 'bye' to end the session\n"));

      const askQuestion = async () => {
        const { userMessage } = await inquirer.prompt([
          {
            type: "input",
            name: "userMessage",
            message: chalk.green("You:"),
          },
        ]);

        if (["exit", "quit", "bye", "q"].includes(userMessage.toLowerCase().trim())) {
          console.log(chalk.cyan("\nGoodbye! Chat session ended.\n"));
          return; // Stop the loop
        }

        if (!userMessage.trim()) {
          return askQuestion();
        }

        conversationHistory.push({
          role: "user",
          content: userMessage,
        });

        try {
          const spinner = ora("Thinking...").start();

          const response = await executeWithRetry(() => executeWithTimeout(client.chatCompletion({
            model: opts.model,
            messages: conversationHistory,
            max_tokens: 800,
            temperature: 0.7,
          }), 15000));

          spinner.stop();

          const aiResponse = response.choices[0].message.content;

          conversationHistory.push({
            role: "assistant",
            content: aiResponse,
          });

          console.log(chalk.blueBright("\nAI: ") + chalk.white(aiResponse) + "\n");

          await askQuestion();

        } catch (err) {
          console.error(chalk.red("\nRequest failed: ") + err.message);

          if (err.message?.includes("rate limit")) {
            console.log(chalk.yellow("Rate limit hit. Try again in a few moments.\n"));
          }

          await askQuestion();
        }
      };

      await askQuestion();
    });

  program
    .command("ask <question>")
    .description("Ask AI any question (one-time answer)")
    .option("-m, --model <model>", "Model to use", "meta-llama/Llama-3.2-3B-Instruct")
    .action(async (question, opts) => {
      const config = await loadConfig();
      const activePlatformProfile = config.defaultProfile || "default";
      const key = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN || await retrieveSecureIdentity(activePlatformProfile, "huggingface");

      if (!key) {
        console.error(chalk.red("HUGGING_FACE_TOKEN missing."));
        console.log(chalk.yellow("Run `mycli auth login` to authenticate."));
        process.exit(1);
      }

      const client = new HfInference(key);

      try {
        const spinner = ora("Thinking...").start();

        const response = await executeWithRetry(() => executeWithTimeout(client.chatCompletion({
          model: opts.model,
          messages: [
            { role: "user", content: question }
          ],
          max_tokens: 800,
        }), 15000));

        spinner.succeed("Got your answer!\n");
        console.log(chalk.white(response.choices[0].message.content));
        console.log();

      } catch (err) {
        console.error(chalk.red("\nRequest failed:"));
        console.error(chalk.red(err.message || err));
      }
    });
};