# Rendering dependency provenance

The application is reconstructed from readable scene controllers, UI code, and
plain scene data. It does not load the captured index/styles chunks, Vue, account
SDKs, or a captured page entry point.

`tools/extract-engine.cjs` recovers the rendering package from captured vendor
module 93823. The 59 recovered rendering modules in `renderer/` are static ES modules
with descriptive file names and imports. The extractor removes the factory/chunk
runtime, preserves live exports and dependency cycles, and formats the source.
Compiled local variable names inside this recovered dependency are retained to
avoid changing the rendering algorithms. This dependency is separate from the
newly authored application and scene controllers.

The `vendor/` distributions retain the exact captured versions of Three.js r130,
GSAP 3.12.7, CustomEase 3.12.7, the browser detector, Howler, and Babel's regenerator runtime. The captured Spine runtime
is retained in `renderer/spine-runtime.js`. Updating these libraries may change
shader compilation, blending, easing, or animation timing; version changes need
the same visual regression checks as changes to scene data.

The captured Three.js distribution includes the renderer's `tick` and
`afterRender` event extensions. It is not interchangeable with a vanilla r130
distribution: CSS3D projection, Spine updates, and procedural motion subscribe
to these events. The exact captured dependency is retained at this boundary.

`extraction.json` records original module IDs and the source bundle SHA-256.
The extraction is a build-time operation; no original application chunk is
required by the running application. `plugins.js` is a readable reconstruction of
the particle/text plugins and uses explicit translation/device dependencies.
`../render/modifiers.mjs` and `../render/css3d.mjs` reconstruct the six modifiers
needed by the first screen. They receive layout and player state explicitly;
they do not depend on Vue or the original global application stores.

The CSS3D frame width/height are viewport CSS dimensions. The WebGL render size
includes DPR, while the font/rem input is the root font size. Passing the wider
artwork frame as the CSS3D width would apply the cropping offset twice.

Run `node tools/extract-engine.cjs` to regenerate dependency artifacts, followed
by `node --test app/engine/extraction.test.cjs app/engine/modifiers.test.cjs`.
`node app/engine/verify.browser.cjs` opens installed Chrome and compares isolated
original factories with the rewritten adapters: exact particle buffers, text
texture RGBA, 123 wiggle ticks, CSS3D camera/object styles, two five-pass blur
frames, and offscreen mask transforms/state. The isolated original factories are
test references only; they are never served or evaluated by the application.
Whole-page screenshot/timeline checks remain necessary to verify integration.
The browser verifier resolves Playwright from the project first, then from
`BROWSER_MODULES` or the bundled Codex runtime. `CHROME_PATH` overrides the
default macOS Chrome executable path for another installed browser location.

`node scripts/reconstruction-smoke.cjs` checks the application on the running
local server with a real animation clock. It starts the opening through the
visible button, wheels through both text stages, clicks all four projected hit
areas, dismisses each story through the canvas, toggles the actual audio mute
state, and opens/closes the introduction. Console errors, runtime exceptions,
missing requests, external requests, and original business bundle requests fail
the check. While the introduction is open, the test requires the WebGL uniform
time to stay fixed while the native clock and GSAP ticker remain running. WebGL
time must resume as closing begins, during the visible 180ms exit transition.
This interaction test complements the frozen-clock pixel comparison; it does
not replace it.
