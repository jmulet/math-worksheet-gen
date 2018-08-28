"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Random_1 = require("../../util/Random");
class FractionOpGen {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const min = qGenOpts.question.min || -10;
        const max = qGenOpts.question.max || 10;
        this.fractions = [];
        for (let i = 0; i < 5; i++) {
            this.fractions[i] = rnd.fractionBetweenNotZero(min, max);
        }
        const [f1, f2, f3, f4, f5] = this.fractions;
        this.answer = (f1.add(f2)).divide((f3.substract(f4)).multiply(f5));
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            const [f1, f2, f3, f4, f5] = this.fractions;
            return "$\\frac{" + f1.toTeX() + " + " + f2.toTeX() + "}{\\left(" + f3.toTeX() + "-" + f4.toTeX() +
                "\\right)\\cdot " + f5.toTeX() + " }$";
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.answer.toTeX() + "$";
        });
    }
}
exports.FractionOpGen = FractionOpGen;
//# sourceMappingURL=FractionOpGen.js.map