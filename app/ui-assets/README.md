These named images preserve the captured first-page artwork without depending on the original stylesheet or business bundles.

The loading textures and four audio icons come from `projects/ys.mihoyo.com/assets`. The ornaments, loading background, guide hand, wheel, navigation dots, login button, rule and share icons were decoded from the original CSS's embedded PNGs. The reconstructed `ui.css` references these standalone files with readable names.

The popup border, close button and title ornaments were decoded from that same captured stylesheet. `popup-background.png` was missing from the capture and was retrieved from the original official asset URL, `https://act.mihoyo.com/ys/event/e20250310nodkrai-skctj9/images/popup_bg.eef4a833..png`.

The login and share icons reproduce the visible first-page controls. Account authentication and external sharing services are outside this phase; the rule button opens the locally reconstructed introduction dialog.

The introduction enters over 250 ms with `cubic-bezier(0.15, 0.59, 0.45, 0.89)` and exits over 180 ms with `ease-out`, matching the captured backdrop and content transitions. `onRulesChange` pauses the scene when opening begins and resumes it when closing begins, including reopening during an exit. Background hotspots remain disabled until the exit finishes. Tab and Shift+Tab stay on the dialog's close control, Escape closes it, and closing restores the prior keyboard focus. The guide hand begins its CSS animation after two animation-frame callbacks, matching the original deferred DOM flush.

Run `node tests/ui.browser.cjs` for the real Chrome regression covering the click-to-start fade, dialog transitions, keyboard containment, hotspot activation guard, and focus restoration. It uses the existing Playwright runtime through `BROWSER_MODULES` when the package is not installed locally; `CHROME_PATH` can override the Chrome executable.

With the reconstruction server running, `node scripts/verify-introduction.cjs` compares complete screenshots at 1200×660@1 and 1920×1080@2 against the unchanged captured original. It checks the introduction before opening, during entry, after settling, during exit, and after closing with the same controlled browser clock. The report and image pairs are saved in `artifacts/introduction`; every differing pixel fails the check. `RECONSTRUCTION_URL` overrides the default `http://127.0.0.1:4174`. The report records the single official image supplied to the reference page because its HAR capture omitted that asset.

The popup uses the captured HSLA shadow color and a separate compositor group so translucent entry, exit, and settled frames keep the original pixel values at both device scales.
