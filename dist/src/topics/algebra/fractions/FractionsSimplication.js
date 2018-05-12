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
let FractionsSimplification = class FractionsSimplification {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const maxDegree = qGenOpts.question.maxDegree || 3;
        const question = rnd.algebraicFraction({ range: r, maxDegree: maxDegree, simplificable: true });
        this.question = question.toTeX();
        this.answer = question.simplified().toTeX();
    }
    getFormulation() {
        return "$" + this.question + " = {}$";
    }
    getAnswer() {
        return "$" + this.answer + "$ ";
    }
};
FractionsSimplification = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/fractions/simplify",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "maxDegree",
                defaults: 3,
                description: "Maximum degree of the involved polynomials"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], FractionsSimplification);
exports.FractionsSimplification = FractionsSimplification;
//# sourceMappingURL=FractionsSimplication.js.map