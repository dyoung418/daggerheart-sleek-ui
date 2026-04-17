import { hideMacrobar, showMacrobar, attachResourceListeners, attachToggleResourceListeners } from "./utils-minisheet.js";

export function registerCompanionMiniSheet() {
  if (game.system.id !== "daggerheart") return;
  if (!game.settings.get("daggerheart-sleek-ui", "enableMinisheet")) return;

  class CompanionMiniSheet {
    static currentActor = null;
    static element = null;
    static _tooltipPatched = false;
    static _effectsObserver = null;
    static _effectsOriginalParent = null;

    // ─── TOOLTIP PATCH ────────────────────────────────────────────────────────

    static _patchTooltipManager() {
      if (this._tooltipPatched) return;
      const mgr = game.tooltip;
      if (!mgr) return;

      const originalSetAnchor = mgr._setAnchor.bind(mgr);
      mgr._setAnchor = function (direction) {
        if (this.element?.closest("#sleek-ui-sheet .minisheet") && !this.element?.closest(".favorites-window")) {
          const pad = this.constructor.TOOLTIP_MARGIN_PX;
          const pos = this.element.getBoundingClientRect();
          return this._setStyle({
            textAlign: "center",
            left: pos.left - this.tooltip.offsetWidth / 2 + pos.width / 2,
            bottom: window.innerHeight - pos.top + pad,
          });
        }
        return originalSetAnchor(direction);
      };

      this._tooltipPatched = true;
    }

    // ─── EFFECTS DISPLAY ─────────────────────────────────────────────────────

    static _mountEffectsDisplay() {
      const effectsEl = document.getElementById("effects-display");
      if (!effectsEl) return;

      const minisheet = this.element?.querySelector(".minisheet.companion");
      if (!minisheet) return;

      this._effectsOriginalParent = effectsEl.parentElement;
      minisheet.appendChild(effectsEl);
      effectsEl.removeAttribute("hidden");

      this._effectsObserver = new MutationObserver(() => effectsEl.removeAttribute("hidden"));
      this._effectsObserver.observe(effectsEl, { attributes: true, attributeFilter: ["hidden"] });
    }

    static _unmountEffectsDisplay() {
      const effectsEl = document.getElementById("effects-display");

      if (this._effectsObserver) {
        this._effectsObserver.disconnect();
        this._effectsObserver = null;
      }

      if (effectsEl && this._effectsOriginalParent) {
        this._effectsOriginalParent.appendChild(effectsEl);
      }

      this._effectsOriginalParent = null;
    }

    // ─── HOOKS ────────────────────────────────────────────────────────────────

    static _onControlToken(_token, controlled) {
      if (!controlled) {
        if (!canvas.tokens?.controlled.length) CompanionMiniSheet._teardown();
        return;
      }

      const actor = CompanionMiniSheet._resolveActor();

      if (!actor) {
        CompanionMiniSheet._teardown();
        return;
      }

      if (actor === CompanionMiniSheet.currentActor) return;
      if (actor.sheet?.rendered) return;

      CompanionMiniSheet.currentActor = actor;
      CompanionMiniSheet._render();
    }

    static _onUpdateActor(actor) {
      if (actor === this.currentActor) this._render();
    }

    static _onUpdateItem(item) {
      if (item.parent !== this.currentActor) return;
      this._render();
    }

    // ─── ACTOR RESOLUTION ────────────────────────────────────────────────────

    static _resolveActor() {
      const controlled = canvas.tokens?.controlled ?? [];
      if (controlled.length !== 1) return null;

      const token = controlled[0];
      const actor = token.actor;
      if (!actor || actor.type !== "companion") return null;

      const ownerLevel = game.user.isGM ? CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER : actor.getUserLevel(game.user);
      if (ownerLevel < CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) return null;

      return actor;
    }

    // ─── RENDER ───────────────────────────────────────────────────────────────

    static async _render() {
      if (!this.currentActor) return;

      const effectsEl = document.getElementById("effects-display");
      const wasInMinisheet = effectsEl && this.element?.contains(effectsEl);
      if (wasInMinisheet) document.body.appendChild(effectsEl);

      const context = await this._prepareContext(this.currentActor);
      if (!this.currentActor) return;

      const html = await foundry.applications.handlebars.renderTemplate("modules/daggerheart-sleek-ui/templates/sheets/companions/companion-minisheet.hbs", context);
      if (!this.currentActor) return;

      if (!this.element) {
        this._injectContainer();
        hideMacrobar();
      }

      this.element.innerHTML = html;
      this._attachListeners();
      this._patchTooltipManager();

      if (wasInMinisheet) {
        const minisheet = this.element.querySelector(".minisheet.companion");
        if (minisheet) {
          minisheet.appendChild(effectsEl);
          effectsEl.removeAttribute("hidden");
        }
      } else {
        this._mountEffectsDisplay();
      }
    }

    static _teardown() {
      this._unmountEffectsDisplay();

      this.currentActor = null;

      if (this.element) {
        this.element.remove();
        this.element = null;
      }

      showMacrobar();
    }

    static _injectContainer() {
      const container = document.createElement("div");
      container.id = "sleek-ui-sheet";
      container.style.cssText = "position:fixed;bottom:0;left:50%;transform:translateX(-50%);z-index:70;";
      document.body.appendChild(container);
      this.element = container;
    }

    // ─── CONTEXT ─────────────────────────────────────────────────────────────

    static async _prepareContext(actor) {
      const part = actor.system.attack.damage.parts[0];
      const proficiency = actor.system.proficiency ?? 1;
      const dice = part?.value.dice ?? "";
      const bonus = part?.value.bonus ?? 0;
      const attackDamage = `${proficiency}${dice}${bonus > 0 ? " + " + bonus : bonus < 0 ? bonus : ""}`;
      const attackDamageType = part ? [...part.type] : [];

      const partnerRef = actor.system.partner;
      const partner = partnerRef ? (typeof partnerRef === "string" ? await fromUuid(partnerRef) : partnerRef) : null;

      return {
        document: actor,
        source: actor,
        actor,
        showTooltip: true,
        partner,
        attack: actor.system.attack,
        attackDamage,
        attackDamageType,
      };
    }

    // ─── LISTENERS ───────────────────────────────────────────────────────────

    static _attachListeners() {
      if (!this.element || !this.currentActor) return;

      const actor = this.currentActor;

      attachResourceListeners(this.element, actor);
      attachToggleResourceListeners(this.element, actor);

      // Open full sheet on portrait click
      this.element.querySelectorAll("[data-action='openSheet']").forEach((el) => {
        el.addEventListener("click", () => actor.sheet?.render(true));
      });

      // Action roll — needs the partner to call diceRoll, mirrors system's #actionRoll
      this.element.querySelectorAll("[data-action='actionRoll']").forEach((el) => {
        el.addEventListener("click", async (event) => {
          event.stopPropagation();
          const partnerRef = actor.system.partner;
          const partner = partnerRef ? (typeof partnerRef === "string" ? await fromUuid(partnerRef) : partnerRef) : null;
          if (!partner) return;

          const config = {
            event,
            title: `${game.i18n.localize("DAGGERHEART.GENERAL.Roll.action")}: ${actor.name}`,
            headerTitle: `Companion ${game.i18n.localize("DAGGERHEART.GENERAL.Roll.action")}`,
            roll: {
              trait: partner.system.spellcastModifierTrait?.key,
              companionRoll: true,
            },
            hasRoll: true,
          };

          const result = await partner.diceRoll(config);

          // Consume resources from the partner, mirroring system's consumeResource
          if (result?.costs?.length) {
            const usefulResources = {
              ...foundry.utils.deepClone(partner.system.resources),
              fear: {
                value: game.settings.get(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Resources.Fear),
                max: game.settings.get(CONFIG.DH.id, CONFIG.DH.SETTINGS.gameSettings.Homebrew).maxFear,
                reversed: false,
              },
            };
            const resources = game.system.api.fields.ActionFields.CostField.getRealCosts(result.costs).map((c) => {
              const resource = usefulResources[c.key];
              return {
                key: c.key,
                value: (c.total ?? c.value) * (resource.isReversed ? 1 : -1),
                target: resource.target,
              };
            });
            await partner.modifyResource(resources);
          }
        });
      });

      // Attack damage roll
      this.element.querySelectorAll(".actor-attack-roll").forEach((el) => {
        el.addEventListener("click", async (event) => {
          event.preventDefault();
          event.stopPropagation();
          const action = actor.system.attack;
          const config = action.prepareConfig(event);
          config.effects = await game.system.api.data.actions.actionsTypes.base.getEffects(actor, null);
          config.hasRoll = false;
          action.workflow.get("damage").execute(config, null, true);
        });
      });

      // Attack action card
      this.element.querySelectorAll("[data-action='useActorAttack']").forEach((el) => {
        el.addEventListener("click", async (event) => {
          event.stopPropagation();
          const action = actor.system.attack;
          await action.use(event);
        });
      });

      // Partner sheet
      this.element.querySelectorAll("[data-action='openPartnerSheet']").forEach((el) => {
        el.addEventListener("click", async () => {
          const partnerRef = actor.system.partner;
          const partner = partnerRef ? (typeof partnerRef === "string" ? await fromUuid(partnerRef) : partnerRef) : null;
          if (!partner) return;
          partner.sheet?.render(true);
        });
      });
    }
  }

  // ─── HOOKS ─────────────────────────────────────────────────────────────────

  Hooks.on("controlToken", CompanionMiniSheet._onControlToken.bind(CompanionMiniSheet));
  Hooks.on("updateActor", CompanionMiniSheet._onUpdateActor.bind(CompanionMiniSheet));
  Hooks.on("updateItem", CompanionMiniSheet._onUpdateItem.bind(CompanionMiniSheet));

  Hooks.on("renderSleekCompanionSheet", (app) => {
    if (app.actor === CompanionMiniSheet.currentActor) {
      CompanionMiniSheet._teardown();
    }
  });

  Hooks.on("closeSleekCompanionSheet", (app) => {
    const actor = CompanionMiniSheet._resolveActor();
    if (actor && app.actor === actor) {
      CompanionMiniSheet.currentActor = actor;
      CompanionMiniSheet._render();
    }
  });
}
