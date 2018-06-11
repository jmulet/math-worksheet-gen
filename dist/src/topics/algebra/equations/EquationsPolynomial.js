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
let EquationsPolynomial = class EquationsPolynomial {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        let complexity = qGenOpts.question.complexity || 1;
        const minDegree = qGenOpts.question.minDegree || 1;
        const maxDegree = qGenOpts.question.maxDegree || 2;
        const specialType = qGenOpts.question.specialType;
        const degree = rnd.intBetween(minDegree, maxDegree);
        const eqn = new Equation_1.Equation(rnd);
        if (specialType === "biquadratic") {
            const roots = rnd.numericList(2, -r, r).map(e => {
                if (rnd.intBetween(0, 1) === 0) {
                    return e.multiply(e);
                }
                else {
                    return e.multiply(e).oposite();
                }
            });
            eqn.biquadraticFromQuadraticRoots(roots, complexity);
        }
        else {
            const roots = rnd.numericList(degree, -r, r);
            if (specialType === "factorizable") {
                complexity = 0;
            }
            eqn.polynomialFromRoots(roots, degree, complexity);
        }
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
EquationsPolynomial = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/equations/polynomial",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "complexity",
                defaults: 1,
                description: "Complexity; number of indeterminates. From 0-2"
            },
            {
                name: "minDegree",
                defaults: 1,
                description: "minDegree of polynomial"
            },
            {
                name: "maxDegree",
                defaults: 2,
                description: "maxDegree of polynomial"
            },
            {
                name: "specialType",
                defaults: "",
                description: "Use: biquadratic, factorizable"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], EquationsPolynomial);
exports.EquationsPolynomial = EquationsPolynomial;
//# sourceMappingURL=EquationsPolynomial.js.map