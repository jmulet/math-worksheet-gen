"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = {};
/**
 * Decorator, dynamically generates the types of generator
 */
function WsGenerator(meta) {
    return function (target) {
        exports.Container[meta.category] = {
            meta: meta,
            clazz: target
        };
        console.log(exports.Container);
    };
}
exports.WsGenerator = WsGenerator;
//# sourceMappingURL=WsGenerator.js.map