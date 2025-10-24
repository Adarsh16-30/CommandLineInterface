import open from "open";
import { info, error } from "../utils/colors.js";

export default function (program) {
  program
    .command("open <url>")
    .description("Open a website from CLI")
    .action(async (url) => {
      try {
        // Simple validation to allow users to just type "google.com"
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }
        
        info(`Opening ${url}...`);
        // The 'open' package figures out the correct command for the OS
        await open(url);
      } catch (err) {
        error(`Failed to open URL: ${err.message}`);
      }
    });
}