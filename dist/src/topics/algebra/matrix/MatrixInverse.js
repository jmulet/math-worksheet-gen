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
let MatrixInverse = class MatrixInverse {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        this.steps = "";
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 5;
        const dim = qGenOpts.question.dim || 2;
        this.m = Matrix_1.Matrix.fromDefinition(dim, dim, (i, j) => rnd.numericBetween(-r, r));
        this.question = this.m.toTeX();
        try {
            this.inverse = this.m.inverse();
            const transpose = this.m.transpose();
            const adjunts = transpose.adjunts();
            this.answer = "$" + this.inverse.toTeX() + "$";
            const det = this.m.determinant();
            this.steps = "$|M|=" + det.toTeX() + "$ $\\rightarrow$ ";
            if (det.isZero()) {
                this.steps += " $\\nexists \\,  M^{-1}$ ";
            }
            else {
                this.steps += " $M^t = " + transpose.toTeX() + "$ $\\,\\rightarrow\\,$  adj$(M^t)=" + adjunts.toTeX() +
                    "$ $\\,\\rightarrow\\,$ $M^{-1} = \\dfrac{1}{" + det.toTeX() + "} " + adjunts.toTeX() + "$ = " + this.answer;
            }
        }
        catch (Ex) {
            this.answer = "$\\nexists \\, M^{-1}$";
        }
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$M = " + this.question + "$";
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
            const mat = this.inverse ? this.inverse : Matrix_1.Matrix.fromDefinition(this.m.rows, this.m.cols, () => null);
            return {
                type: "cloze",
                html: `
                <p>\\(M^{-1}=\\) ${mat.toClozeForm()}</p>
                <p><em>Deixa els quadres buits si la inversa no existeix.</em></p>
            `
            };
        });
    }
};
MatrixInverse = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/matrix/inverse",
        parameters: [
            {
                name: "interval",
                defaults: 5,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "dim",
                defaults: 2,
                description: "Dimension of matrices 2--4"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], MatrixInverse);
exports.MatrixInverse = MatrixInverse;
//# sourceMappingURL=MatrixInverse.js.map