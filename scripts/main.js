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

Hooks.once("ready", () => {
  registerCharacterSheet();
  registerAdversarySheet();
  registerCompanionSheet();
  registerPartySheet();
  registerEnvironmentSheet();
});
