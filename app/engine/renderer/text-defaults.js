// Extracted rendering module: text-defaults. See ../PROVENANCE.md.

export const __esModule = true;
let defaultExport;
('use strict');
(void 0,
  (defaultExport = function () {
    return {
      color: 'black',
      fontSize: 14,
      fontStyle: 'normal',
      fontVariant: 'normal',
      fontWeight: 'normal',
      fontStretch: 'normal',
      fontFamily: getComputedStyle
        ? getComputedStyle(document.body).fontFamily
        : 'Microsoft YaHei,微软雅黑',
      width: Number.MAX_SAFE_INTEGER,
      textAlign: 'left',
      verticalAlign: 'bottom',
      lineSpacing: 5,
      whiteSpace: 'collapse-all',
      spaceWidth: 5,
      newLine: 'preserve',
      lineHeight: 'static',
      strokeWidth: 0,
      strokeColor: 'black',
    };
  }));
export { defaultExport as default };
