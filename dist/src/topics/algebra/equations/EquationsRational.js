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
const Equation_1 = require("../../../math/Equation");
const Random_1 = require("../../../util/Random");
const WsGenerator_1 = require("../../../util/WsGenerator");
let EquationsRational = class EquationsRational {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        let complexity = qGenOpts.question.complexity || 1;
        const eqn = new Equation_1.Equation(rnd);
        eqn.rational(r, complexity);
        this.question = eqn.toTeX();
        this.answer = eqn.solutionsTeX();
    }
    getFormulation() {
        return "$" + this.question + "$";
    }
    getAnswer() {
        return this.answer;
    }
    getDistractors() {
        return [];
    }
};
EquationsRational = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/equations/rational",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "complexity",
                defaults: 1,
                description: "Complexity; number of indeterminates. From 1-2"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], EquationsRational);
exports.EquationsRational = EquationsRational;
//# sourceMappingURL=EquationsRational.js.map