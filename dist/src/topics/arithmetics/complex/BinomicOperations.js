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
const Numeric_1 = require("../../../math/Numeric");
const powersOfI = [new Numeric_1.Numeric(1), new Numeric_1.Numeric(0, 1, 1, 1), new Numeric_1.Numeric(-1), new Numeric_1.Numeric(0, 1, -1, 1)];
/** prints + only if required */
function pAdd(n) {
    let sign = "";
    if (n.realPart().isPositive()) {
        sign = "+";
    }
    else if (n.realPart().isZero() && n.imaginaryPart().isPositive()) {
        sign = "+";
    }
    return sign + " " + n.toTeX();
}
let BinomicOperations = class BinomicOperations {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        let complexity = qGenOpts.question.complexity || 1;
        const z1 = new Numeric_1.Numeric(rnd.intBetween(-r, r), 0, rnd.intBetweenNotZero(-r, r));
        const z2 = new Numeric_1.Numeric(rnd.intBetween(-r, r), 0, rnd.intBetweenNotZero(-r, r));
        const z3 = new Numeric_1.Numeric(rnd.intBetween(-r, r), 0, rnd.intBetweenNotZero(-r, r));
        const z4 = new Numeric_1.Numeric(rnd.intBetween(-r, r), 0, rnd.intBetweenNotZero(-r, r));
        const s1 = Numeric_1.Numeric.fromNumber(rnd.intBetweenNotZero(2, r));
        const s2 = Numeric_1.Numeric.fromNumber(rnd.intBetweenNotZero(2, r));
        const n = rnd.intBetweenNotZero(2, 3);
        const n2 = rnd.intBetweenNotZero(2, r);
        if (complexity <= 0) {
            const dice = rnd.intBetween(1, 4);
            if (dice === 1) {
                this.answer = z1.add(z2);
                this.question = z1.toTeX() + pAdd(z2);
            }
            else if (dice === 2) {
                this.answer = z1.substract(z2);
                this.question = z1.toTeX() + " - \\left(" + z2.toTeX() + "\\right) ";
            }
            else if (dice === 3) {
                this.answer = z1.multiply(z2);
                this.question = "\\left( " + z1.toTeX() + "\\right) \\cdot \\left( " + z2.toTeX() + " \\right)";
            }
            else if (dice === 4) {
                this.answer = powersOfI[n2 % 4];
                this.question = "i^{" + n2 + "}";
            }
        }
        else if (complexity <= 1) {
            const dice = rnd.intBetween(1, 5);
            if (dice === 1) {
                this.answer = z1.add(z2).substract(z3);
                this.question = z1.toTeX() + pAdd(z2) + " - \\left( " + z3.toTeX() + "\\right)";
            }
            else if (dice === 2) {
                this.answer = z1.multiply(s1).substract(z2.multiply(s2)).add(z3);
                this.question = s1.toTeX() + "\\, \\left(" + z1.toTeX() + "\\right) - " + s2.toTeX() + "\\, \\left(" + z2.toTeX() + "\\right) " + pAdd(z3);
            }
            else if (dice === 3) {
                this.answer = z1.multiply(z2);
                this.question = "\\left( " + z1.toTeX() + "\\right) \\cdot \\left( " + z2.toTeX() + " \\right)";
            }
            else if (dice === 4) {
                this.answer = z1.inverse();
                this.question = "\\dfrac{1}{" + z1.toTeX() + "}";
            }
            else if (dice === 5) {
                this.answer = z1.divide(z2);
                this.question = "\\dfrac{" + z1.toTeX() + "}{" + z2.toTeX() + "}";
            }
        }
        else {
            const dice = rnd.intBetween(1, 4);
            if (dice === 1) {
                this.answer = z1.add(z2).multiply(z3.substract(z4));
                this.question = "\\left(" + z1.toTeX() + pAdd(z2) + "\\right) \\cdot \\left( " + z3.toTeX() + "- \\left(" + z4.toTeX() + "\\right) \\right)";
            }
            else if (dice === 2) {
                this.answer = z1.add(z2);
                const base = this.answer.copy();
                for (var i = 0; i < n - 1; i++) {
                    this.answer = this.answer.multiply(base);
                }
                this.question = "\\left( " + z1.toTeX() + pAdd(z2) + " \\right)^{" + n + "}";
            }
            else if (dice === 3) {
                this.answer = z1.multiply(z2).divide(z3.add(z4));
                this.question = "\\dfrac{\\left( " + z1.toTeX() + "\\right) \\cdot \\left( " + z2.toTeX() + " \\right)}{" + z3.toTeX() + pAdd(z4) + "}";
            }
            else if (dice === 4) {
                this.answer = z1.multiply(z2.add(z3.divide(z4)));
                this.question = "\\left(" + z1.toTeX() + "\\right) \\cdot \\left(" + z2.toTeX() + " + \\dfrac{ " + z3.toTeX() + "}{" + z4.toTeX() + "} \\right)";
            }
            else if (dice === 5) {
                this.answer = z1.divide(z2).add(z3).substract(z4.inverse());
                this.question = "\\dfrac{" + z1.toTeX() + "}{" + z2.toTeX() + "} + " + z3.toTeX() + " - \\dfrac{1}{" + z4.toTeX() + "}";
            }
        }
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.question + "$";
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.answer.toTeX() + "$";
        });
    }
};
BinomicOperations = __decorate([
    WsGenerator_1.WsGenerator({
        category: "arithmetics/complex/binomicOperations",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "complexity",
                defaults: 1,
                description: "Complexity; From 0-2"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], BinomicOperations);
exports.BinomicOperations = BinomicOperations;
//# sourceMappingURL=BinomicOperations.js.map