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
const Formatter_1 = require("../../../util/Formatter");
const BAR_NAMES = [['x', 'y'], ['a', 'b']];
let RadicalsIntroduce = class RadicalsIntroduce {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;
        const complexity = qGenOpts.question.complexity || 2;
        const algebraic = qGenOpts.question.algebraic || false;
        const MyBAR_NAMES = rnd.pickOne(BAR_NAMES);
        if (complexity < 2) {
            let a, b;
            const ind1 = rnd.intBetween(2, 5);
            const ea = rnd.intBetween(1, 5);
            const eb = rnd.intBetween(1, 5);
            if (algebraic) {
                a = rnd.pickOne(MyBAR_NAMES);
                b = rnd.pickOne(MyBAR_NAMES);
            }
            else {
                a = rnd.intBetween(2, 4);
                b = rnd.intBetween(2, 4);
            }
            let exponentA, exponentB, exponentC;
            exponentA = ind1 * ea;
            exponentB = 0;
            if (b === a) {
                exponentA += ind1 * ea;
            }
            else {
                exponentB = eb;
            }
            this.question = Formatter_1.Formatter.displayPower(a, ea) + Formatter_1.Formatter.displayRoot(ind1, Formatter_1.Formatter.displayPower(b, eb));
            this.answer = Formatter_1.Formatter.displayRoot(ind1, Formatter_1.Formatter.displayPower(a, exponentA) + "\\, " + Formatter_1.Formatter.displayPower(b, exponentB));
        }
        else if (complexity >= 2) {
            let a, b, c;
            const ind1 = rnd.intBetween(2, 5);
            const ind2 = rnd.intBetween(2, 5);
            const ea = rnd.intBetween(0, 5);
            const eb = rnd.intBetween(1, 5);
            const ec = rnd.intBetween(1, 5);
            if (algebraic) {
                a = rnd.pickOne(MyBAR_NAMES);
                b = rnd.pickOne(MyBAR_NAMES);
                c = rnd.pickOne(MyBAR_NAMES);
            }
            else {
                a = rnd.intBetween(2, 4);
                b = rnd.intBetween(2, 4);
                c = rnd.intBetween(2, 5);
            }
            let exponentA, exponentB, exponentC;
            exponentA = ind1 * ind2 * ea;
            exponentB = 0;
            exponentC = 0;
            if (b === a) {
                exponentA += ind1 * ind2 * ea;
                if (c === a) {
                    exponentA += ec;
                }
                else {
                    exponentC = ec;
                }
            }
            else {
                exponentB = ind2 * eb;
                if (c === a) {
                    exponentA += ec;
                }
                else if (c === b) {
                    exponentB += ec;
                }
                else {
                    exponentC = ec;
                }
            }
            const index = ind1 * ind2;
            this.question = Formatter_1.Formatter.displayPower(a, ea) + Formatter_1.Formatter.displayRoot(ind1, Formatter_1.Formatter.displayPower(b, eb) + " " +
                Formatter_1.Formatter.displayRoot(ind2, Formatter_1.Formatter.displayPower(c, ec)));
            this.answer = Formatter_1.Formatter.displayRoot(index, Formatter_1.Formatter.displayPower(a, exponentA) + "\\, " +
                Formatter_1.Formatter.displayPower(b, exponentB) + "\\, " + Formatter_1.Formatter.displayPower(c, exponentC));
        }
    }
    getFormulation() {
        return "$" + this.question + " = {}$";
    }
    getAnswer() {
        return "$" + this.answer + "$";
    }
    getDistractors() {
        return [];
    }
};
RadicalsIntroduce = __decorate([
    WsGenerator_1.WsGenerator({
        category: "arithmetics/radicals/introduce",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "algebraic",
                defaults: false,
                description: "Whether to use algebraic notation or not"
            },
            {
                name: "maxIndex",
                defaults: 5,
                description: "Max radical index"
            },
            {
                name: "complexity",
                defaults: 2,
                description: "1= One root; n= N roots sandwitched"
            },
        ]
    }),
    __metadata("design:paramtypes", [Object])
], RadicalsIntroduce);
exports.RadicalsIntroduce = RadicalsIntroduce;
//# sourceMappingURL=RadicalsIntroduce.js.map