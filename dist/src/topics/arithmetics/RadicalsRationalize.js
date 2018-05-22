"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const Random_1 = require("../../util/Random");
const WsGenerator_1 = require("../../util/WsGenerator");
const PolyRadical_1 = require("../../math/PolyRadical");
const Monomial_1 = require("../../math/Monomial");
let RadicalsRationalize = class RadicalsRationalize {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;
        const domain = qGenOpts.question.domain || 'Z';
        const conjugate = qGenOpts.question.conjugate || false;
        if (conjugate) {
            //Only square-roots in conjugate mode
            let radical1 = rnd.radical({ domain: 'Z', range: r, maxIndex: 2 });
            let radical2 = rnd.radical({ domain: 'Z', range: r, maxIndex: 2 });
            while (!radical1.isRadical()) {
                radical1 = rnd.radical({ domain: 'Z', range: r, maxIndex: 2 });
            }
            while (!radical1.isRadical()) {
                radical2 = rnd.radical({ domain: 'Z', range: r, maxIndex: 2 });
            }
            const polyRad = new PolyRadical_1.PolyRadical([radical1, radical2]);
            const radical3 = rnd.radical({ domain: 'Z', range: r, maxIndex: 2 }).simplify();
            const radical1_2 = radical1.power(2).simplify();
            const radical2_2 = radical2.power(2).simplify();
            const denom = radical1_2.coefficient.coef.substract(radical2_2.coefficient.coef);
            const numerator = new PolyRadical_1.PolyRadical([radical1.multiply(radical3), radical2.opposite().multiply(radical3)]);
            numerator.radicals.forEach((r) => {
                r.coefficient.coef = r.coefficient.coef.divide(denom);
            });
            this.question = "\\dfrac{" + radical3.toTeX() + "}{" + polyRad.toTeX() + "}";
            this.answer = numerator.simplify().toTeX();
        }
        else {
            let radical = rnd.radical({ domain: 'Z', range: r, maxIndex: maxIndex, useCoeff: false });
            while (!radical.isRadical()) {
                radical = rnd.radical({ domain: 'Z', range: r, maxIndex: maxIndex, useCoeff: false });
            }
            const topCoeff = rnd.intBetween(1, r);
            this.question = "\\dfrac{" + topCoeff + "}{" + radical.toTeX() + "}";
            let radical2 = radical.power(radical.index - 1);
            radical2.coefficient = radical2.coefficient.multiply(Monomial_1.Monomial.fromNumber(topCoeff)).divide(radical.radicand);
            this.answer = radical2.simplify().toTeX();
        }
    }
    getFormulation() {
        return "$" + this.question + "$";
    }
    getAnswer() {
        return "$" + this.answer + "$";
    }
    getDistractors() {
        return [];
    }
};
RadicalsRationalize = __decorate([
    WsGenerator_1.WsGenerator({
        category: "arithmetics/radicals/rationalize",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "domain",
                defaults: "Z",
                description: "Type of coefficent number generated"
            },
            {
                name: "maxIndex",
                defaults: 5,
                description: "Max radical index"
            },
            {
                name: "conjugate",
                defaults: false,
                description: "Allow conjugate +/- expression in denominador"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], RadicalsRationalize);
exports.RadicalsRationalize = RadicalsRationalize;
//# sourceMappingURL=RadicalsRationalize.js.map