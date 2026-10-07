const SIGNED_OUT_STARTUP = 'r.isLogin||i.initApiStore(),';

/** Handle the known, captured ended activity at the original fire-and-forget call site. */
function patchNativeInitialization(source) {
  if (source.split(SIGNED_OUT_STARTUP).length !== 2) {
    throw new Error('Expected exactly one native signed-out startup call');
  }
  return source.replace(SIGNED_OUT_STARTUP,
    'r.isLogin||i.initApiStore().catch(function(error){if(!error||!error.data||error.data.retcode!==-500012)throw error}),');
}

module.exports = { patchNativeInitialization };
