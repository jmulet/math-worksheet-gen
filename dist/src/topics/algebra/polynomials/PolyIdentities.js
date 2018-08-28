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
const PolyMonomial_1 = require("../../../math/PolyMonomial");
const Random_1 = require("../../../util/Random");
const WsGenerator_1 = require("../../../util/WsGenerator");
const Monomial_1 = require("../../../math/Monomial");
const Literal_1 = require("../../../math/Literal");
let PolyIdentities = PolyIdentities_1 = class PolyIdentities {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;
        let [letter1, letter2] = rnd.pickMany(PolyIdentities_1.Symbols, 2);
        let mono1, mono2;
        let identityType = rnd.intBetween(0, 2); //0 = + square, 1 = - square, 2 = + x -
        let coef1, coef2, exp1, exp2;
        switch (complexity) {
            case 0:
                coef1 = 1;
                coef2 = rnd.intBetween(1, r);
                mono1 = new Monomial_1.Monomial(coef1, letter1);
                mono2 = new Monomial_1.Monomial(coef2, []);
                break;
            case 1:
                coef1 = 1;
                coef2 = rnd.intBetween(1, r);
                mono1 = new Monomial_1.Monomial(coef1, letter1);
                mono2 = new Monomial_1.Monomial(coef2, letter2);
                break;
            case 2:
                coef1 = rnd.intBetween(1, r);
                coef2 = rnd.intBetween(1, r);
                exp1 = rnd.intBetween(2, r);
                exp2 = rnd.intBetween(2, r);
                mono1 = new Monomial_1.Monomial(coef1, [new Literal_1.Literal(letter1, exp2)]);
                mono2 = new Monomial_1.Monomial(coef2, [new Literal_1.Literal(letter2, exp1)]);
            default:
                coef1 = rnd.fractionBetweenNotZero(1, r);
                coef2 = rnd.intBetween(1, r);
                exp1 = rnd.intBetween(2, r);
                exp2 = rnd.intBetween(2, r);
                mono1 = new Monomial_1.Monomial(coef1, [new Literal_1.Literal(letter1, exp2)]);
                mono2 = new Monomial_1.Monomial(coef2, [new Literal_1.Literal(letter2, exp2)]);
        }
        let expanded, factorized;
        switch (identityType) {
            case 0:
                factorized = "\\left(" + mono1.toTeX() + " + " + mono2.toTeX() + "\\right)^2";
                expanded = PolyMonomial_1.PolyMonomial.power(PolyMonomial_1.PolyMonomial.add(mono1, mono2), 2).toTeX();
                break;
            case 1:
                factorized = "\\left(" + mono1.toTeX() + " - " + mono2.toTeX() + "\\right)^2";
                expanded = PolyMonomial_1.PolyMonomial.power(PolyMonomial_1.PolyMonomial.substract(mono1, mono2), 2).toTeX();
                break;
            case 2:
                factorized = "\\left(" + mono1.toTeX() + " + " + mono2.toTeX() + "\\right) \\cdot \\left(" + mono1.toTeX() + " - " + mono2.toTeX() + "\\right)";
                expanded = PolyMonomial_1.PolyMonomial.multiply(PolyMonomial_1.PolyMonomial.add(mono1, mono2), PolyMonomial_1.PolyMonomial.substract(mono1, mono2)).toTeX();
                break;
        }
        if (qGenOpts.question.indirect) {
            this.question = expanded;
            this.answer = factorized;
        }
        else {
            this.question = factorized;
            this.answer = expanded;
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
PolyIdentities.Symbols = ["x", "y", "z", "t", "a", "b", "c", "m", "n"];
PolyIdentities = PolyIdentities_1 = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/polynomial/identities",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "complexity",
                defaults: 1,
                description: "Complexity in the terms * of the binomial (* - *)^2. From 0-3"
            },
            {
                name: "fractions",
                defaults: false,
                description: "Allows fraction in coefficients"
            },
            {
                name: "indirect",
                defaults: false,
                description: "Given the polynomial, it must be expressed as an identity"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], PolyIdentities);
exports.PolyIdentities = PolyIdentities;
var PolyIdentities_1;
//# sourceMappingURL=PolyIdentities.js.map