import { hideMacrobar, showMacrobar } from "./utils-minisheet.js";

export function registerPartyMiniSheet() {
  if (game.system.id !== "daggerheart") return;
  if (!game.settings.get("daggerheart-sleek-ui", "enableMinisheet")) return;

  class PartyMiniSheet {
    static currentActor = null;
    static element = null;

    // ─── HOOKS ────────────────────────────────────────────────────────────────

    static _onControlToken(_token, controlled) {
      if (!controlled) {
        if (!canvas.tokens?.controlled.length) PartyMiniSheet._teardown();
        return;
      }

      const actor = PartyMiniSheet._resolveActor();

      if (!actor) {
        PartyMiniSheet._teardown();
        return;
      }

      if (actor === PartyMiniSheet.currentActor) return;
      if (actor.sheet?.rendered) return;

      PartyMiniSheet.currentActor = actor;
      PartyMiniSheet._render();
    }

    static _onUpdateActor(actor) {
      // Re-render if the party actor itself updated, or if any member updated
      if (actor === this.currentActor) {
        this._render();
        return;
      }
      const isPartyMember = this.currentActor?.system.partyMembers?.some((m) => m === actor);
      if (isPartyMember) this._render();
    }

    // ─── ACTOR RESOLUTION ────────────────────────────────────────────────────

    static _resolveActor() {
      const controlled = canvas.tokens?.controlled ?? [];
      if (controlled.length !== 1) return null;

      const token = controlled[0];
      const actor = token.actor;
      if (!actor || actor.type !== "party") return null;

      const ownerLevel = game.user.isGM ? CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER : actor.getUserLevel(game.user);
      if (ownerLevel < CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) return null;

      return actor;
    }

    // ─── RENDER ───────────────────────────────────────────────────────────────

    static async _render() {
      if (!this.currentActor) return;

      const context = await this._prepareContext(this.currentActor);
      if (!this.currentActor) return;

      const html = await foundry.applications.handlebars.renderTemplate("modules/daggerheart-sleek-ui/templates/sheets/party/party-minisheet.hbs", context);
      if (!this.currentActor) return;

      if (!this.element) {
        this._injectContainer();
        hideMacrobar();
      }

      this.element.innerHTML = html;
      this._attachListeners();
    }

    static _teardown() {
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
      const members = [...(actor.system.partyMembers ?? [])].sort((a, b) => {
        const ownershipA = game.user.isGM ? CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER : a.getUserLevel(game.user);
        const ownershipB = game.user.isGM ? CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER : b.getUserLevel(game.user);
        if (ownershipB !== ownershipA) return ownershipB - ownershipA;
        return a.name.localeCompare(b.name);
      });

      const partyMembersData = [];

      for (const member of members) {
        if (!member) continue;

        const sys = member.system;
        const ownershipLevel = game.user.isGM ? CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER : member.getUserLevel(game.user);

        partyMembersData.push({
          actor: member,
          actorUuid: member.uuid,
          ownershipLevel,
          hopeValue: sys.resources?.hope?.value ?? 0,
          hopeMax: sys.resources?.hope?.max ?? 0,
          hitPointsValue: sys.resources?.hitPoints?.value ?? 0,
          hitPointsMax: sys.resources?.hitPoints?.max ?? 0,
          stressValue: sys.resources?.stress?.value ?? 0,
          stressMax: sys.resources?.stress?.max ?? 0,
          armorValue: sys.armor?.system?.marks?.value ?? 0,
          armorMax: sys.armorScore ?? 0,
        });
      }

      return {
        document: actor,
        source: actor,
        actor,
        partyMembersData,
      };
    }

    // ─── LISTENERS ───────────────────────────────────────────────────────────

    static _attachListeners() {
      if (!this.element || !this.currentActor) return;

      const actor = this.currentActor;

      // Open party sheet
      this.element.querySelectorAll("[data-action='openSheet']").forEach((el) => {
        el.addEventListener("click", () => actor.sheet?.render(true));
      });

      // Portrait interaction (Navigate / Open Sheet)
      this.element.querySelectorAll("[data-action='openMemberSheet']").forEach((el) => {
        el.addEventListener("click", async () => {
          const uuid = el.closest("[data-actor-uuid]")?.dataset.actorUuid;
          if (!uuid) return;
          const member = await fromUuid(uuid);
          if (!member) return;
          const ownerLevel = game.user.isGM ? CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER : member.getUserLevel(game.user);
          if (ownerLevel < CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER) return;

          // Find a token for this actor on the current canvas
          const token = canvas.tokens?.placeables.find((t) => t.actor === member);

          if (token) {
            // Pan to and select the token
            token.control({ releaseOthers: true });
            canvas.animatePan({ x: token.x, y: token.y });
          } else {
            member.sheet?.render(true);
          }
        });
      });
    }
  }

  // ─── HOOKS ─────────────────────────────────────────────────────────────────

  Hooks.on("controlToken", PartyMiniSheet._onControlToken.bind(PartyMiniSheet));
  Hooks.on("updateActor", PartyMiniSheet._onUpdateActor.bind(PartyMiniSheet));

  Hooks.on("renderSleekPartySheet", (app) => {
    if (app.actor === PartyMiniSheet.currentActor) PartyMiniSheet._teardown();
  });

  Hooks.on("closeSleekPartySheet", (app) => {
    const actor = PartyMiniSheet._resolveActor();
    if (actor && app.actor === actor) {
      PartyMiniSheet.currentActor = actor;
      PartyMiniSheet._render();
    }
  });
}
