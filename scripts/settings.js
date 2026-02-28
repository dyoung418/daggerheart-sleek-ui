export function registerSettings() {
  // Tabs Position
  game.settings.register("daggerheart-sleek-ui", "tabsPosition", {
    name: "Tabs Position",
    scope: "client",
    config: true,
    type: String,
    choices: {
      floating: "Floating",
      basic: "Basic",
    },
    default: "floating",
    onChange: () => {
      Object.values(ui.windows).forEach((app) => {
        if (app.render) app.render();
      });
    },
  });

  // Quick Access
  game.settings.register("daggerheart-sleek-ui", "quickAccess", {
    name: "Enable Quick Access",
    hint: "Switch the default equipment and loadout sidebar sections with a universal Quick Access section",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });

  // Beastform Portrait
  game.settings.register("daggerheart-sleek-ui", "beastformPortrait", {
    name: "Use Beastform Portrait",
    hint: "When in beastform, change the character's portrait to the form's Subject Texture",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  // Currency Labels
  game.settings.register("daggerheart-sleek-ui", "currencyLabel", {
    name: "Show Currency Labels",
    hint: "Shows the labels for each currency on top of their values",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
}
