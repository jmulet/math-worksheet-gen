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
const Random_1 = require("../../util/Random");
const WsGenerator_1 = require("../../util/WsGenerator");
let PowerValue = class PowerValue {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const minExp = qGenOpts.question.minExp || -4;
        const maxExp = qGenOpts.question.maxExp || 4;
        const domain = qGenOpts.question.domain || 'Z';
        let base = rnd.numericBetweenNotZero(-r, r, domain);
        while (base.isOne()) {
            base = rnd.numericBetweenNotZero(-r, r, domain);
        }
        const exp = rnd.intBetweenNotZero(minExp, maxExp);
        const decimal = Math.pow(base.toNumber(), exp);
        if (base.isNegative() || !base.isInt()) {
            this.question = "\\left( " + base.toTeX() + "\\right)^{" + exp + "}";
        }
        else {
            this.question = base.toTeX() + "^{" + exp + "}";
        }
        this.answer = decimal + "";
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.question + "={}$";
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.answer + "$";
        });
    }
};
PowerValue = __decorate([
    WsGenerator_1.WsGenerator({
        category: "arithmetics/power/value",
        description: "The student must express a given power in decimal form, e.g. 2^{-3} = 0.0125",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random bases are generated"
            },
            {
                name: "domain",
                defaults: "Z",
                description: "Type of coefficent number generated"
            },
            {
                name: "minExp",
                defaults: -4,
                description: "Range in which exponents are generated"
            },
            {
                name: "maxExp",
                defaults: 4,
                description: "Range in which exponents are generated"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], PowerValue);
exports.PowerValue = PowerValue;
//# sourceMappingURL=PowerValue.js.map