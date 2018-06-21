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
const Random_1 = require("../../../util/Random");
const WsGenerator_1 = require("../../../util/WsGenerator");
const Giac_1 = require("../../../math/Giac");
let TangentLine = class TangentLine {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const interval = qGenOpts.question.interval || 10;
        const range = qGenOpts.question.range || 10;
        const domain = qGenOpts.question.domain || 'Z';
        const askNormal = qGenOpts.question.askNormal || false;
        const types = qGenOpts.question.types || [0, 1, 2];
        this.fun = rnd.elementalFunction(types, { range: interval, domain: domain });
        const a = rnd.intBetween(-range, range);
        // Must check that a is within the domain of the function!
        this.answer = Giac_1.Giac.evaluate('latex(equation(LineTan(' + this.fun.toString() + ',' + a + ')))').replace("(", "").replace(")", "");
    }
    getFormulation() {
        return "$y = " + this.fun.toTeX() + "$";
    }
    getAnswer() {
        return "$" + this.answer + "$";
    }
    getDistractors() {
        return [];
    }
};
TangentLine = __decorate([
    WsGenerator_1.WsGenerator({
        category: "calculus/differentiation/tangentline",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "range",
                defaults: 10,
                description: "Range in which x=a is taken"
            },
            {
                name: "domain",
                defaults: 'Z',
                description: "Number domain"
            },
            {
                name: "askNormal",
                defaults: false,
                description: "Whether to ask also for normal instead of tangent line"
            },
            {
                name: "types",
                defaults: [0, 1, 2],
                description: "List of function types  Polynomical: 0, Rational: 1, Irrational: 2, Exponential: 3, Logarithm: 4, Trigonometric: 5"
            },
        ]
    }),
    __metadata("design:paramtypes", [Object])
], TangentLine);
exports.TangentLine = TangentLine;
//# sourceMappingURL=TangentLine.js.map