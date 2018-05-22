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
let RadicalsOpGen = class RadicalsOpGen {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;
        const algebraic = qGenOpts.question.algebraic || false;
        const operators = qGenOpts.question.operators || '*/^r';
        this.radicals = [];
        const bar = rnd.pickOne(Random_1.BAR_NAMES);
        const options = { range: r, maxIndex: maxIndex, algebraic: algebraic, useCoeff: false, maxVars: 1, bar: bar };
        const n = rnd.intBetween(1, 3);
        for (let i = 0; i < n; i++) {
            this.radicals[i] = rnd.radical(options);
        }
        if (this.radicals.length === 1) {
            const [r1, ...r2] = this.radicals;
            const rindex = rnd.intBetween(2, maxIndex);
            if (rnd.intBetween(0, 1) === 0) {
                this.question = "$\\sqrt[" + rindex + "]{" + r1.toTeX() + " }$";
                this.answer = r1.enterCoefficient().root(rindex);
            }
            else {
                this.question = "$\\left( " + r1.toTeX() + " \\right)^{" + rindex + "}$";
                this.answer = r1.power(rindex);
            }
        }
        else if (this.radicals.length === 2) {
            const [r1, r2, ...r3] = this.radicals;
            if (rnd.intBetween(0, 1) === 1) {
                this.question = "$\\dfrac{" + r1.toTeX() + " }{ " + r2.toTeX() + "}$";
                this.answer = r1.divide(r2);
            }
            else {
                this.question = "$" + r1.toTeX() + " \\cdot " + r2.toTeX() + "$";
                this.answer = r1.multiply(r2);
            }
        }
        else {
            const [r1, r2, r3, ...r4] = this.radicals;
            this.answer = r1.multiply(r2).divide(r3);
            this.question = "$\\dfrac{" + this.radicals[0].toTeX() + " \\cdot " + this.radicals[1].toTeX() + "}{" + this.radicals[2].toTeX() + "}$";
        }
    }
    getFormulation() {
        return this.question;
    }
    getAnswer() {
        return "$" + this.answer.simplify().toTeX() + "$";
    }
    getDistractors() {
        return [];
    }
};
RadicalsOpGen = __decorate([
    WsGenerator_1.WsGenerator({
        category: "arithmetics/radicals/operations",
        parameters: [
            {
                name: "interval",
                defaults: 4,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "maxIndex",
                defaults: 5,
                description: "Max radical index"
            },
            {
                name: "algebraic",
                defaults: false,
                description: "Whether radicand and coefficent are algebraic or numeric"
            },
            {
                name: "operators",
                defaults: '*/',
                description: "Which operations must include"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], RadicalsOpGen);
exports.RadicalsOpGen = RadicalsOpGen;
//# sourceMappingURL=RadicalsOpGen.js.map