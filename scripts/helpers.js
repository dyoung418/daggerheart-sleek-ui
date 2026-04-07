export async function preloadHandlebarsTemplates() {
  const templatePaths = [
    // Character templates
    "modules/daggerheart-sleek-ui/templates/sheets/characters/sheet-main.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/characters/sheet-sidebar.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/characters/main/header.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/characters/main/tabs.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/characters/tabs/features.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/characters/tabs/loadout.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/characters/tabs/inventory.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/characters/tabs/effects.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/characters/tabs/biography.hbs",
    // Adversary templates
    "modules/daggerheart-sleek-ui/templates/sheets/adversaries/adversary-sheet-main.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/adversaries/adversary-sheet-sidebar.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/adversaries/main/adversary-header.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/adversaries/main/adversary-tabs.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/adversaries/tabs/adversary-features.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/adversaries/tabs/adversary-effects.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/adversaries/tabs/adversary-notes.hbs",
    // Companion templates
    "modules/daggerheart-sleek-ui/templates/sheets/companions/companion-sheet-main.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/companions/main/companion-header.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/companions/main/companion-tabs.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/companions/tabs/companion-details.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/companions/tabs/companion-effects.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-companion-partner.hbs",
    // Party templates
    "modules/daggerheart-sleek-ui/templates/sheets/party/party-sheet-main.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/party/main/party-header.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/party/main/party-tabs.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/party/tabs/party-members.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/party/tabs/party-inventory.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/party/tabs/party-notes.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-party-character.hbs",
    // Environment templates
    "modules/daggerheart-sleek-ui/templates/sheets/environments/environment-sheet-main.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/environments/main/environment-header.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/environments/main/environment-tabs.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/environments/tabs/environment-features.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/environments/tabs/environment-adversaries.hbs",
    "modules/daggerheart-sleek-ui/templates/sheets/environments/tabs/environment-notes.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-environment-adversaries.hbs",
    // Shared components
    "modules/daggerheart-sleek-ui/templates/components/tabs-floating.hbs",
    "modules/daggerheart-sleek-ui/templates/components/tabs-basic.hbs",
    "modules/daggerheart-sleek-ui/templates/components/currency.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-features.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-domains.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-weapon.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-armor.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-item.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-effects.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-companion-effects.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-actor-attack.hbs",
    "modules/daggerheart-sleek-ui/templates/components/card-npc-features.hbs",
    "modules/daggerheart-sleek-ui/templates/components/compact-card-weapon.hbs",
    "modules/daggerheart-sleek-ui/templates/components/compact-card-armor.hbs",
    "modules/daggerheart-sleek-ui/templates/components/compact-card-domains.hbs",
    "modules/daggerheart-sleek-ui/templates/components/compact-card-features.hbs",
    "modules/daggerheart-sleek-ui/templates/components/compact-card-item.hbs",
    "modules/daggerheart-sleek-ui/templates/components/divider.hbs",
    "modules/daggerheart-sleek-ui/templates/components/res-dice.hbs",
    "modules/daggerheart-sleek-ui/templates/components/res-die.hbs",
    "modules/daggerheart-sleek-ui/templates/components/res-hope.hbs",
    "modules/daggerheart-sleek-ui/templates/components/res-recall.hbs",
    "modules/daggerheart-sleek-ui/templates/components/res-simple.hbs",
    "modules/daggerheart-sleek-ui/templates/components/res-uses.hbs",
    "modules/daggerheart-sleek-ui/templates/components/res-quantity.hbs",
    "modules/daggerheart-sleek-ui/templates/components/res-fear.hbs",
  ];
  return loadTemplates(templatePaths);
}

export function registerHelpers() {
  Handlebars.registerHelper("contains", function (array, value) {
    return Array.isArray(array) && array.includes(value);
  });

  Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });

  Handlebars.registerHelper("add", function (a, b) {
    return Number(a) + Number(b);
  });

  Handlebars.registerHelper("subtract", function (a, b) {
    return Number(a) - Number(b);
  });
}
