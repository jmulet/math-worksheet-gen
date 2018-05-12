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
const Polynomial_1 = require("../../../math/Polynomial");
const Random_1 = require("../../../util/Random");
const WsGenerator_1 = require("../../../util/WsGenerator");
let PolyDivision = class PolyDivision {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const minDegree = qGenOpts.question.minDegree || 3;
        const maxDegree = qGenOpts.question.maxDegree || 6;
        const coefs = rnd.intList(rnd.intBetween(minDegree, maxDegree), r);
        while (coefs[0] === 0) {
            coefs[0] = rnd.intBetween(-r, r);
        }
        if (qGenOpts.question.ruffini) {
            this.polyD = new Polynomial_1.Polynomial(coefs);
            this.polyd = new Polynomial_1.Polynomial([1, rnd.intBetweenNotZero(-r, r)]);
            this.answers = this.polyD.divide(this.polyd);
        }
        else {
            if (!qGenOpts.question.fractions) {
                // Reverse question, generate q, d and R, so D = q*d + R
                const DDegree = rnd.intBetween(minDegree, maxDegree - 1);
                const dDegree = rnd.intBetween(minDegree, DDegree - 2);
                const rDegree = rnd.intBetween(0, dDegree - 2);
                const qDegree = DDegree - dDegree;
                this.polyd = new Polynomial_1.Polynomial(rnd.intList(dDegree + 1, r));
                this.answers = {
                    quotient: new Polynomial_1.Polynomial(rnd.intList(qDegree + 1, r)),
                    remainder: new Polynomial_1.Polynomial(rnd.intList(rDegree + 1, r))
                };
                this.polyD = this.polyd.multiply(this.answers.quotient).add(this.answers.remainder);
            }
            else {
                this.polyD = new Polynomial_1.Polynomial(coefs);
                const coefs2 = rnd.intList(rnd.intBetween(minDegree, this.polyD.degree()), r);
                this.polyd = new Polynomial_1.Polynomial(coefs2);
                this.answers = this.polyD.divide(this.polyd);
            }
        }
    }
    getFormulation() {
        const bar = this.qGenOpts.question.bar || "x";
        return "$\\left(" + this.polyD.toTeX(bar) + "\\right) : \\left(" + this.polyd.toTeX(bar) + "\\right)$";
    }
    getAnswer() {
        const bar = this.qGenOpts.question.bar || "x";
        return "$Q(x)=" + this.answers.quotient.toTeX(bar) + "$; $R=" + this.answers.remainder.toTeX(bar) + "$ ";
    }
};
PolyDivision = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/polynomial/division",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "minDegree",
                defaults: 3,
                description: "Lowest degree of the generated polynomial"
            },
            {
                name: "maxDegree",
                defaults: 6,
                description: "Highest degree of the generated polynomial"
            },
            {
                name: "ruffini",
                defaults: false,
                description: "When set to true only divisions by (x+-a) are generated"
            },
            {
                name: "fractions",
                defaults: false,
                description: "Allows fraction coefficients in the quotient and reminder"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], PolyDivision);
exports.PolyDivision = PolyDivision;
//# sourceMappingURL=PolyDivision.js.map