import fs from "fs";
import { HfInference } from "@huggingface/inference";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";

export default (program) => {
  // --- Command: explain ---
  program
    .command("explain [fileOrCode]")
    .description("Explain code using Hugging Face AI")
    .option("-m, --model <model>", "Model to use", "meta-llama/Llama-3.2-3B-Instruct")
    .option("-s, --streaming", "Enable streaming response")
    .action(async (fileOrCode, opts) => {
      // Check for Hugging Face token in environment variables
      const key = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN;
      
      if (!key) {
        console.error(chalk.red("HUGGING_FACE_TOKEN missing in .env"));
        console.log(chalk.yellow("Get your free token at: https://huggingface.co/settings/tokens"));
        return;
      }

      const client = new HfInference(key);

      let code;
      if (!fileOrCode) {
        return console.log(chalk.yellow("Provide a filename or code string"));
      }

      // Check if the input is a file that exists
      if (fs.existsSync(fileOrCode)) {
        code = fs.readFileSync(fileOrCode, "utf8");
        console.log(chalk.cyan(`Reading file: ${fileOrCode}\n`));
      } else {
        // Otherwise, treat the input as a raw string of code
        code = fileOrCode;
      }

      const prompt = `Explain the following code in simple terms. Include what it does, inputs, outputs, possible bugs or edge cases, and suggestions:\n\n${code}`;

      try {
        const spinner = ora("Analyzing code...").start();

        // Handle streaming response if the -s flag is used
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

          // Write each chunk to the console as it arrives
          for await (const chunk of stream) {
            if (chunk.choices?.[0]?.delta?.content) {
              process.stdout.write(chalk.white(chunk.choices[0].delta.content));
            }
          }
          console.log("\n");
        } else {
          // Handle regular, non-streaming response
          const response = await client.chatCompletion({
            model: opts.model,
            messages: [
              { role: "user", content: prompt }
            ],
            max_tokens: 1000,
          });

          spinner.succeed("Analysis complete!\n");
          console.log(chalk.green("Explanation:\n"));
          console.log(chalk.white(response.choices[0].message.content));
        }
      } catch (err) {
        console.error(chalk.red("\nRequest failed:"));
        console.error(chalk.red(err.message || err));
        
        // Provide helpful feedback for common errors
        if (err.message?.includes("rate limit")) {
          console.log(chalk.yellow("Rate limit hit. Try again in a few moments."));
        } else if (err.message?.includes("not found")) {
          console.log(chalk.yellow(`Model "${opts.model}" not available. Try a different model.`));
        }
      }
    });

  // --- Command: chat ---
  program
    .command("chat")
    .description("Start an interactive AI chat session")
    .option("-m, --model <model>", "Model to use", "meta-llama/Llama-3.2-3B-Instruct")
    .action(async (opts) => {
      // Check for Hugging Face token in environment variables
      const key = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN;
      
      if (!key) {
        console.error(chalk.red("HUGGING_FACE_TOKEN missing in .env"));
        console.log(chalk.yellow("Get your free token at: https://huggingface.co/settings/tokens"));
        return;
      }

      const client = new HfInference(key);
      
      // Store conversation history in memory for this session
      const conversationHistory = [];

      console.log(chalk.cyanBright("\n" + "=".repeat(50)));
      console.log(chalk.cyanBright("     AI Chat Session Started          "));
      console.log(chalk.cyanBright("=".repeat(50)));
      console.log(chalk.gray(`\nModel: ${opts.model}`));
      console.log(chalk.yellow("Type 'exit', 'quit', or 'bye' to end the session\n"));

      // Define a recursive function to keep the chat loop running
      const askQuestion = async () => {
        const { userMessage } = await inquirer.prompt([
          {
            type: "input",
            name: "userMessage",
            message: chalk.green("You:"),
          },
        ]);

        // Check for exit commands
        if (["exit", "quit", "bye", "q"].includes(userMessage.toLowerCase().trim())) {
          console.log(chalk.cyan("\nGoodbye! Chat session ended.\n"));
          return; // Stop the loop
        }

        // Skip empty messages and re-prompt
        if (!userMessage.trim()) {
          return askQuestion();
        }

        // Add user's message to history
        conversationHistory.push({
          role: "user",
          content: userMessage,
        });

        try {
          const spinner = ora("Thinking...").start();

          // Send the entire conversation history with the new message
          const response = await client.chatCompletion({
            model: opts.model,
            messages: conversationHistory,
            max_tokens: 800,
            temperature: 0.7,
          });

          spinner.stop();

          const aiResponse = response.choices[0].message.content;

          // Add AI's response to history
          conversationHistory.push({
            role: "assistant",
            content: aiResponse,
          });

          console.log(chalk.blueBright("\nAI: ") + chalk.white(aiResponse) + "\n");

          // Continue the conversation
          await askQuestion();

        } catch (err) {
          console.error(chalk.red("\nRequest failed: ") + err.message);
          
          if (err.message?.includes("rate limit")) {
            console.log(chalk.yellow("Rate limit hit. Try again in a few moments.\n"));
          }
          
          // Continue conversation even after an error
          await askQuestion();
        }
      };

      // Start the chat loop
      await askQuestion();
    });

  // --- Command: ask ---
  program
    .command("ask <question>")
    .description("Ask AI any question (one-time answer)")
    .option("-m, --model <model>", "Model to use", "meta-llama/Llama-3.2-3B-Instruct")
    .action(async (question, opts) => {
      // Check for Hugging Face token in environment variables
      const key = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN;
      
      if (!key) {
        console.error(chalk.red("HUGGING_FACE_TOKEN missing in .env"));
        console.log(chalk.yellow("Get your free token at: https://huggingface.co/settings/tokens"));
        return;
      }

      const client = new HfInference(key);

      try {
        const spinner = ora("Thinking...").start();

        // This is a one-shot question, no history is needed
        const response = await client.chatCompletion({
          model: opts.model,
          messages: [
            { role: "user", content: question }
          ],
          max_tokens: 800,
        });

        spinner.succeed("Got your answer!\n");
        console.log(chalk.white(response.choices[0].message.content));
        console.log();

      } catch (err) {
        console.error(chalk.red("\nRequest failed:"));
        console.error(chalk.red(err.message || err));
      }
    });
};