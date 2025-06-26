/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  SubPatchOp: () => (/* binding */ SubPatchOp)
});

;// CONCATENATED MODULE: external "CABLES"
const external_CABLES_namespaceObject = CABLES;
;// CONCATENATED MODULE: ./src/corelibs/subpatchop/subpatchop.js


class SubPatchOp
{
    constructor(op, options)
    {
        options = options || {};
        this._op = op;

        op.patchId = op.addInPort(new external_CABLES_namespaceObject.Port(op, "patchId", external_CABLES_namespaceObject.CONSTANTS.OP.OP_PORT_TYPE_STRING, { "display": "readonly", "hidePort": true, "hideParam": true }));

        op.setUiAttribs({ "subPatchOp": { "version": 2 } });

        if (op.uiAttribs.parentOfSubpatch)
        {
            op.patchId.set(op.uiAttribs.parentOfSubpatch);
        }
        else
        {
            if (options.subId) op.patchId.set(options.subId);
            else op.patchId.set(external_CABLES_namespaceObject.utils.generateUUID());
        }

        op.patchId.onChange = () =>
        {
            if (options.subId) op.patchId.value = options.subId;
        };

        op.init = () =>
        {
            op.setStorage({ "subPatchVer": 2 });
        };

        op.loadDependencies = (p, next) =>
        {
            if (CABLES.UI)
            {
                gui.serverOps.loadProjectDependencies(p, () =>
                {
                    if (next)next();
                });
            }
            else
            if (next)next();
        };

        op.on("delete", () =>
        {
            if (op.patch.clearSubPatchCache)op.patch.clearSubPatchCache(this.patchId);
            const ops = op.patch.ops;
            for (let i = ops.length - 1; i >= 0; i--)
                if (ops[i] && ops[i].uiAttribs && ops[i].uiAttribs.subPatch == op.patchId.get())
                    op.patch.deleteOp(ops[i].id);
        });

        this._op.isExposableSubpatchOp = () =>
        {
            return true;
        };
    }

    get patchId()
    {
        return this._op.patchId.get();
    }
}

})();

var __webpack_export_target__ = (CABLES = typeof CABLES === "undefined" ? {} : CABLES);
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;