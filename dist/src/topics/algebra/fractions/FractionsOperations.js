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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Random_1 = require("../../../util/Random");
const WsGenerator_1 = require("../../../util/WsGenerator");
const PolyCommonFactor_1 = require("../polynomials/PolyCommonFactor");
const Polynomial_1 = require("../../../math/Polynomial");
const AlgebraicFraction_1 = require("../../../math/AlgebraicFraction");
const Giac_1 = require("../../../math/Giac");
// Identity type 0= (a+b)^2; 1=(a-b)^2; 2=(a+b)*(a-b);
function rootsFromIdentityType(factorX1, type1, root) {
    const roots = [];
    for (let i = 0; i < factorX1; i++) {
        roots.push(0);
    }
    if (type1 === 0) {
        roots.push(root);
        roots.push(root);
    }
    else if (type1 === 1) {
        roots.push(-root);
        roots.push(-root);
    }
    else {
        roots.push(root);
        roots.push(-root);
    }
    return Polynomial_1.Polynomial.fromRoots(roots);
}
let FractionsOperations = class FractionsOperations {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;
        let [letter1, letter2, letter3] = rnd.pickMany(PolyCommonFactor_1.PolyCommonFactor.Symbols, 3);
        let coef1, coef2, coef3, coef4;
        coef1 = rnd.numericBetweenNotZero(-r, r);
        coef2 = rnd.numericBetweenNotZero(-r, r);
        coef3 = rnd.numericBetweenNotZero(-r, r);
        coef4 = rnd.numericBetweenNotZero(1, r);
        const expo1 = rnd.intBetween(1, r);
        const expo2 = rnd.intBetween(1, r);
        const generateFraction = function (useRoot) {
            const factorX2 = rnd.intBetween(0, 3);
            let polyNum, polyDen;
            // Identity type 0= (a+b)^2; 1=(a-b)^2; 2=(a+b)*(a-b);
            const type2 = rnd.intBetween(0, 2);
            const numCoefs = rnd.numericList(2, r, 'Z');
            polyNum = new Polynomial_1.Polynomial(numCoefs);
            polyDen = rootsFromIdentityType(factorX2, type2, useRoot);
            return new AlgebraicFraction_1.AlgebraicFraction(polyNum, polyDen);
        };
        /**
        switch (complexity) {
            case 0:
                poly = PolyMonomial.fromCoefs([coef1, coef2, coef3], letter1);
                factor = new Monomial(coef4, [new Literal(letter1, expo1)]);
                question = PolyMonomial.multiply(factor, poly);
                break;
            default:
                poly = PolyMonomial.fromCoefs([coef1, coef2, coef3], letter1);
                factor = new Monomial(coef4, [new Literal(letter1, expo1), new Literal(letter2, expo2)]);
                question = PolyMonomial.multiply(factor, poly);
                break;
        }
        */
        const root = rnd.intBetweenNotZero(-r, r);
        if (complexity <= 1) {
            const frac1 = generateFraction(root);
            const frac2 = generateFraction(root);
            const op = rnd.pickOne(['+', '-']);
            this.question = frac1.toTeX() + " " + op + " " + frac2.toTeX();
            const computation = frac1.toString() + " " + op + " " + frac2.toString();
            this.answer = Giac_1.Giac.evaluate("latex(collect(simplify(" + computation + ")))").replace(/"/g, "").replace(/\\frac/g, "\\dfrac");
        }
        else {
            const frac1 = generateFraction(root);
            const frac2 = generateFraction(root);
            const frac3 = generateFraction(root);
            const op = rnd.pickOne(['+', '-']);
            const op2 = rnd.pickOne(['*', '/']);
            this.question = frac1.toTeX() + " " + op + " " + frac2.toTeX();
            let computation = frac1.toString() + " " + op + " " + frac2.toString();
            if (op2 === "*") {
                computation = "(" + computation + ") * " + frac3.toString();
                this.question = "\\left(" + this.question + "\\right) \\cdot " + frac3.toTeX();
            }
            else {
                computation = "(" + computation + ") / (" + frac3.toString() + ")";
                this.question = "\\left(" + this.question + "\\right) : " + frac3.toTeX();
            }
            this.answer = Giac_1.Giac.evaluate("latex(collect(simplify(" + computation + ")))").replace(/"/g, "").replace(/\\frac/g, "\\dfrac");
        }
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.question + " = {}$";
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.answer + "$ ";
        });
    }
};
FractionsOperations.Symbols = ["x", "y", "z", "t", "a", "b", "c", "m", "n"];
FractionsOperations = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/fractions/operations",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "complexity",
                defaults: 1,
                description: "Complexity; number of indeterminates. From 0-1"
            },
            {
                name: "fractions",
                defaults: false,
                description: "Allows fraction in coefficients"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], FractionsOperations);
exports.FractionsOperations = FractionsOperations;
//# sourceMappingURL=FractionsOperations.js.map