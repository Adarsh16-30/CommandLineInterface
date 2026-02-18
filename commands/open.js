// open.js
// Opens a URL in the user's default browser. Automatically prepends https://
// if the user forgets to include a protocol (e.g. just types "google.com").

import open from "open";
import { info, error } from "../utils/colors.js";

export default function (program) {
  program
    .command("open <url>")
    .description("Open a website from CLI")
    .action(async (url) => {
      try {
        // Be forgiving — let users type "google.com" without the protocol
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = "https://" + url;
        }

        info(`Opening ${url}...`);
        // The 'open' package picks the right command for Windows, macOS, and Linux
        await open(url);
      } catch (err) {
        error(`Failed to open URL: ${err.message}`);
      }
    });
}
