import {moduleName, FishingUi} from "./fishingUi.mjs";
import {FishingSpotsLayer} from "./fishingCanvasLayer.mjs";
import {injectFishing} from "./Injection.mjs";
import {injectControls} from "./toolbar.mjs";

Hooks.on('devModeReady', ({registerPackageDebugFlag}) => registerPackageDebugFlag(moduleName));

export function log(force, ...args) {
  try {
    const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(moduleName);

    if (force || isDebugging) {
      console.log(moduleName, '|', ...args);
    }
  } catch (e) { }
}

Hooks.once('init', async function() {
  CONFIG.Canvas.layers["myLayer"] = {
    layerClass: FishingSpotsLayer,
    group: "interface"
  };

  game.keybindings.register(moduleName, "reel.me", {
    name: "Reel in",
    hint: "Tap or hold",
    editable: [
      {key: "Space"}
    ],
    onDown: () => { window.obligatoryFishingMinigame.reeling = true; return true; },
    onUp: () => { window.obligatoryFishingMinigame.reeling = false; return true; },
    reservedModifiers: [],
    precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
    repeat: true
  });
});

Hooks.once('ready', async function() {
  window.obligatoryFishingMinigame = {
    reeling: false
  };
  window.obligatoryFishingMinigame.log = log;

  if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(moduleName)) {
    // FishingUi.run();
  }

});

Hooks.on('setup', async () => {
  console.log("injecting");
  injectFishing();
})

Hooks.on('getSceneControlButtons', (controls) => {
  if (!game.user.isGM) return
  injectControls(controls);
})
