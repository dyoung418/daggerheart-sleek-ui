export function registerSettings() {
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
      // Re-render all open sheets when changed
      Object.values(ui.windows).forEach((app) => {
        if (app.render) app.render();
      });
    },
  });

  game.settings.register("daggerheart-sleek-ui", "quickAccess", {
    name: "Enable Quick Access",
    hint: "Switch the default equipment and loadout sidebar sections with a universal Quick Access section",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("daggerheart-sleek-ui", "currencyLabel", {
    name: "Show Currency Labels",
    hint: "Shows the labels for each currency on top of their values",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });
}
