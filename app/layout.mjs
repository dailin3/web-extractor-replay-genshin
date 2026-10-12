const DESIGN_WIDTH = 2500;
const DESIGN_HEIGHT = 1080;
const REM_HEIGHT = 10.8;

/** The original artwork scales to viewport height, then clips its wide composition. */
export function measureViewport({ width, height, pixelRatio = 1 }) {
  const frameWidth = (height * DESIGN_WIDTH) / DESIGN_HEIGHT;
  return {
    width,
    height,
    fontSize: height / REM_HEIGHT,
    frameWidth,
    frameLeft: (width - frameWidth) / 2,
    renderSize: { width: width * pixelRatio, height: height * pixelRatio },
  };
}

export function applyViewport(player) {
  const viewport = measureViewport({
    width: innerWidth,
    height: innerHeight,
    pixelRatio: devicePixelRatio,
  });
  document.documentElement.style.fontSize = `${viewport.fontSize}px`;
  document.documentElement.style.setProperty(
    "--frame-width",
    `${viewport.frameWidth}px`,
  );
  document.documentElement.style.setProperty(
    "--frame-left",
    `${viewport.frameLeft}px`,
  );
  player.resizeUI(viewport.renderSize.width, viewport.renderSize.height, {
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    type: "height",
    scale: 1.3,
    isFixedSize: false,
    isFixedAspect: true,
  });
  return viewport;
}
