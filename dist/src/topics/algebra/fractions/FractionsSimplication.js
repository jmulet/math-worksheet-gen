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
const AlgebraicFraction_1 = require("../../../math/AlgebraicFraction");
const Polynomial_1 = require("../../../math/Polynomial");
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
let FractionsSimplification = class FractionsSimplification {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const maxDegree = qGenOpts.question.maxDegree || 3;
        const complexity = qGenOpts.question.complexity || 1;
        const generateFraction = function () {
            const factorX1 = rnd.intBetween(0, 3);
            const factorX2 = rnd.intBetween(0, 3);
            const root = rnd.intBetweenNotZero(-r, r);
            let polyNum, polyDen;
            // Identity type 0= (a+b)^2; 1=(a-b)^2; 2=(a+b)*(a-b);
            const [type1, type2] = rnd.pickMany([0, 1, 2], 2);
            polyNum = rootsFromIdentityType(factorX1, type1, root);
            polyDen = rootsFromIdentityType(factorX2, type2, root);
            return new AlgebraicFraction_1.AlgebraicFraction(polyNum, polyDen);
        };
        if (complexity === 1) {
            const frac = generateFraction();
            this.question = frac.toTeX();
            this.answer = Giac_1.Giac.evaluate("latex(collect(" + frac.simplified().toString() + "))").replace(/"/g, "").replace(/\\frac/g, "\\dfrac");
        }
        else if (complexity === 2) {
            const frac = rnd.algebraicFraction({ range: r, maxDegree: maxDegree, simplificable: true });
            this.question = frac.toTeX();
            this.answer = Giac_1.Giac.evaluate("latex(collect(" + frac.simplified().toString() + "))").replace(/"/g, "").replace(/\\frac/g, "\\dfrac");
        }
        else {
            const op = rnd.pickOne(["\\cdot", ":"]);
            const frac1 = generateFraction();
            const frac2 = generateFraction();
            this.question = frac1.toTeX() + " " + op + " " + frac2.toTeX();
            let polyNum, polyDen;
            if (op === ":") {
                polyNum = frac1.polyNum.multiply(frac2.polyDen);
                polyDen = frac1.polyDen.multiply(frac2.polyNum);
            }
            else {
                polyNum = frac1.polyNum.multiply(frac2.polyNum);
                polyDen = frac1.polyDen.multiply(frac2.polyDen);
            }
            const frac = new AlgebraicFraction_1.AlgebraicFraction(polyNum, polyDen);
            this.answer = Giac_1.Giac.evaluate("latex(collect(" + frac.simplified().toString() + "))").replace(/"/g, "").replace(/\\frac/g, "\\dfrac");
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
FractionsSimplification = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/fractions/simplify",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "maxDegree",
                defaults: 3,
                description: "Maximum degree of the involved polynomials"
            },
            {
                name: "complexity",
                defaults: 1,
                description: "1: Only one algebraic fraction with simple polynomials, 2: Only one fraction difficult polynomials, 3: Two fractions x or : with simple polynomials"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], FractionsSimplification);
exports.FractionsSimplification = FractionsSimplification;
//# sourceMappingURL=FractionsSimplication.js.map