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
const WsGenerator_1 = require("../../../util/WsGenerator");
const Random_1 = require("../../../util/Random");
let ElementalFunctionGraph = class ElementalFunctionGraph {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const domain = qGenOpts.question.domain || 'Z';
        const types = qGenOpts.question.types || [0, 1];
        this.fun = rnd.elementalFunction(types, { range: r, domain: domain });
    }
    getFormulation() {
        return "$y = " + this.fun.toTeX() + "$";
    }
    getAnswer() {
        return "Correcció manual";
    }
    getDistractors() {
        return [];
    }
};
ElementalFunctionGraph = __decorate([
    WsGenerator_1.WsGenerator({
        category: "calculus/elemental/graph",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "domain",
                defaults: 'Z',
                description: "Number domain"
            },
            {
                name: "types",
                defaults: [0, 1],
                description: "List of type names of the desired types  Lineal: 0, Quadratic: 1, Radical: 2, Hyperbole: 3, Exponential: 4, Logarithm: 5, Trigonometric: 6 "
            },
        ]
    }),
    __metadata("design:paramtypes", [Object])
], ElementalFunctionGraph);
exports.ElementalFunctionGraph = ElementalFunctionGraph;
//# sourceMappingURL=ElementalFunctionGraph.js.map