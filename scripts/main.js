import { preloadHandlebarsTemplates, registerHelpers } from "./helpers.js";
import { registerSettings } from "./settings.js";
import { registerCharacterSheet } from "./sheets/character-sheet.js";
import { registerAdversarySheet } from "./sheets/adversary-sheet.js";
import { registerCompanionSheet } from "./sheets/companion-sheet.js";
import { registerPartySheet } from "./sheets/party-sheet.js";
import { registerEnvironmentSheet } from "./sheets/environment-sheet.js";

Hooks.once("init", () => {
  preloadHandlebarsTemplates();
  registerSettings();
  registerHelpers();
});

Hooks.on("ready", () => {
  if (game.settings.get("daggerheart-sleek-ui", "theme")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "modules/daggerheart-sleek-ui/styles/general.css";
    document.head.appendChild(link);
  }
});

Hooks.once("ready", () => {
  registerCharacterSheet();
  registerAdversarySheet();
  registerCompanionSheet();
  registerPartySheet();
  registerEnvironmentSheet();
});
