import { preloadHandlebarsTemplates, registerHelpers } from "./helpers.js";
import { registerSettings } from "./settings.js";
import { registerCharacterSheet } from "./character-sheet.js";
import { registerAdversarySheet } from "./adversary-sheet.js";
import { registerCompanionSheet } from "./companion-sheet.js";

Hooks.once("init", () => {
  preloadHandlebarsTemplates();
  registerSettings();
  registerHelpers();
});

Hooks.once("ready", () => {
  registerCharacterSheet();
  registerAdversarySheet();
  registerCompanionSheet();
});
