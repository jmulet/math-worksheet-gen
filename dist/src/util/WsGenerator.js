"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = {};
/**
 * Decorator, dynamically generates the types of generator
 */
function WsGenerator(meta) {
    meta.parameters.forEach((p) => p.typeof = typeof (p.defaults));
    return function (target) {
        exports.Container[meta.category] = {
            meta: meta,
            clazz: target,
            moodleCapable: target.getQuizz != null
        };
    };
}
exports.WsGenerator = WsGenerator;
//# sourceMappingURL=WsGenerator.js.map