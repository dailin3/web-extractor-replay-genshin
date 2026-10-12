/** Look up authored IDs without coercion; duplicate IDs retain first-match behavior. */
export const __esModule = true;
export function getSceneData(layout, id) {
  return layout.sceneList.find((scene) => scene.id === id);
}
