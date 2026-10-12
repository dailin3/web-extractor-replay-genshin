// Extracted rendering module: scene-data. See ../PROVENANCE.md.

export const __esModule = true;
let getSceneData;
('use strict');
(void 0,
  (getSceneData = function (e, t) {
    return e.sceneList.find(function (e) {
      return e.id === t;
    });
  }));
export { getSceneData };
