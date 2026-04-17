import { preloadHandlebarsTemplates, registerHelpers } from "./helpers.js";
import { registerSettings } from "./settings.js";

import { registerCharacterSheet } from "./sheets/character-sheet.js";
import { registerCompanionSheet } from "./sheets/companion-sheet.js";
import { registerPartySheet } from "./sheets/party-sheet.js";

import { registerAdversarySheet } from "./sheets/adversary-sheet.js";
import { registerEnvironmentSheet } from "./sheets/environment-sheet.js";

import { registerCharacterMiniSheet } from "./sheets/minisheets/minisheet-character.js";
import { registerCompanionMiniSheet } from "./sheets/minisheets/minisheet-companion.js";
import { registerPartyMiniSheet } from "./sheets/minisheets/minisheet-party.js";
import { registerAdversaryMiniSheet } from "./sheets/minisheets/minisheet-adversary.js";

Hooks.once("init", () => {
  preloadHandlebarsTemplates();
  registerHelpers();
  registerSettings();
});

Hooks.on("ready", () => {
  if (game.settings.get("daggerheart-sleek-ui", "theme")) {
    const addStyle = (href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = href;
      document.head.appendChild(link);
    };

    addStyle("modules/daggerheart-sleek-ui/styles/theme.css");
    addStyle("modules/daggerheart-sleek-ui/styles/theme-chat.css");
  }
});

Hooks.once("ready", () => {
  registerCharacterSheet();
  registerCompanionSheet();
  registerPartySheet();

  registerAdversarySheet();
  registerEnvironmentSheet();

  registerCharacterMiniSheet();
  registerCompanionMiniSheet();
  registerPartyMiniSheet();
  registerAdversaryMiniSheet();
});
