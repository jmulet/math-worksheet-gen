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
const PolyRadical_1 = require("../../../math/PolyRadical");
const Radical_1 = require("../../../math/Radical");
const Random_1 = require("../../../util/Random");
const WsGenerator_1 = require("../../../util/WsGenerator");
let RadicalsGather = class RadicalsGather {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;
        const minElements = qGenOpts.question.minElements || 3;
        const maxElements = qGenOpts.question.maxElements || 5;
        const maxSimplifiedRadicals = qGenOpts.question.maxSimplifiedRadicals || 2;
        const domain = qGenOpts.question.domain || 'Z';
        this.radicals = [];
        const n = rnd.intBetween(minElements, maxElements);
        const index = rnd.intBetween(2, maxIndex);
        const nradInAnswer = rnd.intBetween(1, maxSimplifiedRadicals);
        const commonRads = rnd.intList(nradInAnswer, 2, 9);
        for (let i = 0; i < n; i++) {
            const j = rnd.intBetween(2, 5);
            const commonRad = rnd.pickOne(commonRads);
            this.radicals[i] = new Radical_1.Radical(commonRad * Math.pow(j, index), index, rnd.numericBetweenNotZero(-r, r, domain));
        }
        const polyr = new PolyRadical_1.PolyRadical(this.radicals);
        this.question = polyr.toTeX();
        this.answer = polyr.simplify().toTeX();
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
RadicalsGather = __decorate([
    WsGenerator_1.WsGenerator({
        category: "arithmetics/radicals/gather",
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
                name: "minElements",
                defaults: 2,
                description: "Max radical index"
            },
            {
                name: "maxSimplifiedRadicals",
                defaults: 2,
                description: "Maximum number of non equivalent radicals"
            },
            {
                name: "maxElements",
                defaults: 5,
                description: "Max radical index"
            },
            {
                name: "maxIndex",
                defaults: 5,
                description: "Max radical index"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], RadicalsGather);
exports.RadicalsGather = RadicalsGather;
//# sourceMappingURL=RadicalsGather.js.map