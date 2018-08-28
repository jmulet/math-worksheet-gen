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
let PolyCommonFactor = PolyCommonFactor_1 = class PolyCommonFactor {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const complexity = qGenOpts.question.complexity || 1;
        let [letter1, letter2, letter3] = rnd.pickMany(PolyCommonFactor_1.Symbols, 3);
        let coef1, coef2, coef3, coef4;
        coef1 = rnd.numericBetweenNotZero(-r, r);
        coef2 = rnd.numericBetweenNotZero(-r, r);
        coef3 = rnd.numericBetweenNotZero(-r, r);
        coef4 = rnd.numericBetweenNotZero(1, r);
        const expo1 = rnd.intBetween(1, r);
        const expo2 = rnd.intBetween(1, r);
        let mono1, mono2, mono3, factor;
        let poly, question;
        switch (complexity) {
            case 0:
                poly = PolyMonomial_1.PolyMonomial.fromCoefs([coef1, coef2, coef3], letter1);
                factor = new Monomial_1.Monomial(coef4, [new Literal_1.Literal(letter1, expo1)]);
                question = PolyMonomial_1.PolyMonomial.multiply(factor, poly);
                break;
            default:
                poly = PolyMonomial_1.PolyMonomial.fromCoefs([coef1, coef2, coef3], letter1);
                factor = new Monomial_1.Monomial(coef4, [new Literal_1.Literal(letter1, expo1), new Literal_1.Literal(letter2, expo2)]);
                question = PolyMonomial_1.PolyMonomial.multiply(factor, poly);
                break;
        }
        this.question = question.toTeX();
        this.answer = factor.toTeX() + " \\cdot \\left(" + poly.toTeX() + "\\right)";
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
PolyCommonFactor.Symbols = ["x", "y", "z", "t", "a", "b", "c", "m", "n"];
PolyCommonFactor = PolyCommonFactor_1 = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/polynomial/commonfactor",
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
], PolyCommonFactor);
exports.PolyCommonFactor = PolyCommonFactor;
var PolyCommonFactor_1;
//# sourceMappingURL=PolyCommonFactor.js.map