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
const Matrix_1 = require("../../../math/Matrix");
const matricesNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
let PossibleProducts = class PossibleProducts {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        this.steps = "";
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 5;
        let numMatrix = qGenOpts.question.numMatrix || 3;
        if (numMatrix < 2) {
            numMatrix = 2;
        }
        else if (numMatrix > 11) {
            numMatrix = 11;
        }
        const minDim = qGenOpts.question.mimDim || 1;
        const maxDim = qGenOpts.question.maxDim || 3;
        const mustCompute = qGenOpts.question.mustCompute;
        const matrices = new Array(numMatrix);
        for (let i = 0; i < numMatrix; i++) {
            let rows = rnd.intBetween(minDim, maxDim);
            let cols = rnd.intBetween(minDim, maxDim);
            if (rows + cols === 2) {
                if (rnd.intBetween(0, 1)) {
                    while (cols + rows <= 2) {
                        cols = rnd.intBetween(minDim, maxDim);
                    }
                }
                else {
                    while (cols + rows <= 2) {
                        rows = rnd.intBetween(minDim, maxDim);
                    }
                }
            }
            matrices[i] = Matrix_1.Matrix.fromDefinition(rows, cols, (i, j) => rnd.numericBetween(-r, r));
            matrices[i].name = matricesNames[i];
        }
        this.question = matrices.map((m) => "$" + m.toTeX() + "$").join(",$\\,\\,$ ");
        this.answer = "";
        this.good = [];
        this.bad = [];
        for (let i = 0; i < numMatrix; i++) {
            const first = matrices[i];
            for (let j = 0; j < numMatrix; j++) {
                const second = matrices[j];
                const cas = first.name + " \\cdot " + second.name;
                if (first.cols === second.rows) {
                    this.answer += "$" + cas + "$";
                    this.good.push("\\(" + cas + "\\)");
                    if (mustCompute) {
                        this.answer += "= $" + first.multiply(second).toTeX() + "$";
                    }
                    this.answer += ",$\\quad$ ";
                }
                else {
                    this.bad.push("\\(" + cas + "\\)");
                }
            }
        }
        if (!this.answer) {
            this.answer = "No hi ha cap producte possible.";
        }
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.question;
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.answer;
        });
    }
    getSteps() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.steps;
        });
    }
    getQuizz() {
        return __awaiter(this, void 0, void 0, function* () {
            const correct = this.good.length === 0 ? this.bad : this.good;
            const incorrect = this.good.length === 0 ? this.good : this.bad;
            const correct2 = correct.map(e => { return { html: e, grade: 100 }; });
            const incorrect2 = incorrect.map(e => { return { html: e, grade: 0 }; });
            const merge = Random_1.Random.shuffle([...correct2, ...incorrect2]).slice(0, 4);
            let numCorrect = merge.filter(e => e.grade === 100).length;
            if (numCorrect === 0) {
                numCorrect = 1;
                merge[0] = correct2[0];
            }
            let numIncorrect = merge.length - numCorrect;
            merge.filter(e => e.grade === 100).forEach(e => e.grade = 100. / numCorrect);
            merge.filter(e => e.grade === 0).forEach(e => e.grade = -100. / numIncorrect);
            return {
                type: "multiplechoice",
                options: merge,
                html: this.good.length === 0 ? "<p><em>Tria els productes que no són possibles</em></p>" : "<p><em>Tria els productes possibles</em></p>"
            };
        });
    }
};
PossibleProducts = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/matrix/possibleProducts",
        parameters: [
            {
                name: "interval",
                defaults: 5,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "numMatrix",
                defaults: 3,
                description: "Number of matrices to be displayed 2--11"
            },
            {
                name: "minDim",
                defaults: 1,
                description: "minimum Dimension for matrices"
            },
            {
                name: "maxDim",
                defaults: 3,
                description: "maximum Dimension for matrices"
            },
            {
                name: "mustCompute",
                defaults: true,
                description: "Whether products must be computed or not"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], PossibleProducts);
exports.PossibleProducts = PossibleProducts;
//# sourceMappingURL=PossibleProducts.js.map