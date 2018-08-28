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
const WsGenerator_1 = require("../../../util/WsGenerator");
const Random_1 = require("../../../util/Random");
const Numeric_1 = require("../../../math/Numeric");
function displayLog(base) {
    if (typeof (base) === 'string') {
        if (base === "e") {
            return "\\ln ";
        }
    }
    else {
        if (base.toNumber() === 10) {
            return "\\log_{} ";
        }
        else {
            return "\\log_{" + base.toTeX() + "} ";
        }
    }
}
function displayStrOrNumeric(a) {
    let base2;
    if (typeof (a) === "string") {
        base2 = a;
    }
    else {
        base2 = a.toTeX();
    }
    return base2;
}
let RadicalsGather = class RadicalsGather {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 5;
        const domain = qGenOpts.question.domain || 'Z';
        let base;
        // Use with same probability 10, e, any other
        const baseType = rnd.intBetween(0, 2);
        switch (baseType) {
            case 0:
                base = Numeric_1.Numeric.fromNumber(10);
                break;
            case 1:
                base = "e";
                break;
            case 2:
                base = rnd.numericBetween(2, r, domain);
                break;
        }
        let result = rnd.intBetween(-r, r);
        let a;
        if (typeof (base) === 'string') {
            a = base + "^{" + result + "}";
        }
        else {
            a = base.power(result);
        }
        let type = rnd.intBetween(0, 2);
        if (type === 2 && result === 0) {
            type = 0;
        }
        switch (type) {
            case 0:
                // La incògnita és el resultat del logaritme
                this.question = displayLog(base) + displayStrOrNumeric(a) + " = x ";
                this.answer = "x=" + result;
                break;
            case 1:
                // La incògnita és l'argument del logaritme
                this.question = displayLog(base) + " x = " + result;
                this.answer = "x=" + displayStrOrNumeric(a);
                break;
            case 2:
                // La incògnita és la base del logaritme.
                this.question = "\\log_{x} " + displayStrOrNumeric(a) + " = " + result;
                this.answer = "x=" + displayStrOrNumeric(base);
                break;
        }
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.question + "$";
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.answer + "$";
        });
    }
};
RadicalsGather = __decorate([
    WsGenerator_1.WsGenerator({
        category: "arithmetics/logarithm/definition",
        parameters: [
            {
                name: "interval",
                defaults: 5,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "domain",
                defaults: "Z",
                description: "Set of numbers"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], RadicalsGather);
exports.RadicalsGather = RadicalsGather;
//# sourceMappingURL=Definition.js.map