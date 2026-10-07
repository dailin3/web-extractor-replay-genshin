// Exact no-op contract used by the original account SDK when its logger cannot load.
// Analytics has no role in drawing the scene or advancing its animation.
window.miHoYoH5log = {
  create() {
    return {
      setCommonInfo() {},
      error() {},
      warn() {},
      info() {},
    };
  },
};
