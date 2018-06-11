"use strict";
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
        const [f1, f2, f3, f4, f5] = this.fractions;
        return "$\\frac{" + f1.toTeX() + " + " + f2.toTeX() + "}{\\left(" + f3.toTeX() + "-" + f4.toTeX() + "\\right)\\cdot " + f5.toTeX() + " }$";
    }
    getAnswer() {
        return "$" + this.answer.toTeX() + "$";
    }
    getDistractors() {
        return [];
    }
}
exports.FractionOpGen = FractionOpGen;
//# sourceMappingURL=FractionOpGen.js.map