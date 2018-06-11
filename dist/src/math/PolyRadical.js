"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Radical_1 = require("./Radical");
const Formatter_1 = require("../util/Formatter");
const PolyMonomial_1 = require("./PolyMonomial");
// + or - of Radical objects
class PolyRadical {
    constructor(radicals) {
        this.radicals = radicals;
    }
    simplify() {
        // Simplify every radical in list and join those equivalents (equal)
        const radicals2 = this.radicals.map((r) => r.simplify());
        const cache = {};
        radicals2.forEach((r) => {
            const key = r.toTeX({ coef: false });
            let objList = cache[key];
            if (!objList) {
                objList = {
                    radicand: r.radicand,
                    index: r.index,
                    coefs: []
                };
                cache[key] = objList;
            }
            objList.coefs.push(r.coefficient);
        });
        // Build new polyRadical from cache object by merging objList's
        const radicals3 = [];
        for (var key in cache) {
            const obj = cache[key];
            const mergedCoeff = new PolyMonomial_1.PolyMonomial(obj.coefs);
            if (mergedCoeff.monomials.length === 1) {
                radicals3.push(new Radical_1.Radical(obj.radicand, obj.index, mergedCoeff.monomials[0]));
            }
            else {
                throw "PolyRadical:: simplify not implemented with polynomonial coeffs";
            }
        }
        return new PolyRadical(radicals3);
    }
    toTeX() {
        const args = [];
        this.radicals.forEach((r) => {
            args.push(r.coefficient);
            args.push(r.toTeX({ coef: false }));
        });
        return Formatter_1.Formatter.numericXstringTeX(false, ...args);
    }
    toString() {
        const args = [];
        this.radicals.forEach((r) => {
            args.push(r.coefficient);
            args.push(r.toString({ coef: false }));
        });
        return Formatter_1.Formatter.numericXstring(...args);
    }
}
exports.PolyRadical = PolyRadical;
//# sourceMappingURL=PolyRadical.js.map