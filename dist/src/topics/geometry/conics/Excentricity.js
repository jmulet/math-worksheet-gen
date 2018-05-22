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
let Excentricity = class Excentricity {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        this.conica = rnd.conic({ range: r });
        this.e = this.conica.excentricity();
    }
    getFormulation() {
        return "\\( " + this.conica.toTeX() + " \\)";
    }
    getAnswer() {
        return this.e.toFixed(3);
    }
    getDistractors() {
        let distractors = [0, 1, this.conica.a / this.conica.b, this.conica.c / this.conica.b, Math.random(), 1 + Math.random(), 1 / this.e];
        distractors = distractors.filter((v, i) => {
            if (v === this.e) {
                return false;
            }
            if (distractors.indexOf(v) !== i) {
                return false;
            }
            return true;
        });
        // Filter all different distractors
        return distractors.map(d => d.toFixed(3)).slice(0, Math.min(3, distractors.length));
    }
};
Excentricity = __decorate([
    WsGenerator_1.WsGenerator({
        category: "geometry/conics/excentricity",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], Excentricity);
exports.Excentricity = Excentricity;
//# sourceMappingURL=Excentricity.js.map