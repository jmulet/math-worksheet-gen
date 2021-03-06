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
const Random_1 = require("../../util/Random");
const WsGenerator_1 = require("../../util/WsGenerator");
let RadicalsSimplify = class RadicalsSimplify {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;
        const domain = qGenOpts.question.domain || 'Z';
        let radical = rnd.radical({ domain: 'Z', range: r, maxIndex: maxIndex, simplificable: true });
        while (radical.radicand.isOne()) {
            radical = rnd.radical({ domain: 'Z', range: r, maxIndex: maxIndex, simplificable: true });
        }
        this.question = radical.toTeX();
        this.answer = radical.simplify().toTeX();
    }
    getFormulation() {
        return "$" + this.question + "$";
    }
    getAnswer() {
        return "$" + this.answer + "$";
    }
    getDistractors() {
        return [];
    }
};
RadicalsSimplify = __decorate([
    WsGenerator_1.WsGenerator({
        category: "arithmetics/radicals/simplify",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "domain",
                defaults: "Z",
                description: "Type of coefficent number generated"
            },
            {
                name: "maxIndex",
                defaults: 5,
                description: "Max radical index"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], RadicalsSimplify);
exports.RadicalsSimplify = RadicalsSimplify;
//# sourceMappingURL=RadicalsSimplify.js.map