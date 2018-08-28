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
let MatrixEquations = class MatrixEquations {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        this.steps = "";
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 5;
        const dim = qGenOpts.question.dim || 2;
        const complexity = qGenOpts.question.complexity || 1;
        let A = Matrix_1.Matrix.fromDefinition(dim, dim, (i, j) => rnd.numericBetween(-r, r));
        let det = A.determinant();
        while (det.isZero()) {
            A = Matrix_1.Matrix.fromDefinition(dim, dim, (i, j) => rnd.numericBetween(-r, r));
            det = A.determinant();
        }
        let inverse;
        try {
            inverse = A.inverse();
        }
        catch (Ex) {
            console.log(Ex);
        }
        const B = Matrix_1.Matrix.fromDefinition(dim, dim, (i, j) => rnd.numericBetween(-r, r));
        if (complexity <= 1) {
            const dice = rnd.intBetween(1, 2);
            if (dice === 1) {
                this.question = "$A\\cdot X = B$,  $\\quad$ essent $\\quad$ $A=" + A.toTeX() + "\\,$, $B=" + B.toTeX() + "$";
                const X = inverse.multiply(B);
                this.answer = X;
                this.steps = "$|A|=" + det.toTeX() + "\\neq 0$, existeix $A^{-1}$. Multiplicam els dos membres de l'equació per $A^{-1}$ $\\,\\rightarrow \\,$";
                this.steps += "$A^{-1}\\cdot A \\cdot X  = A^{-1}\\cdot B$  $\\,\\rightarrow \\,$  $X=A^{-1}\\cdot B$ = $" + inverse.toTeX() + "\\cdot " +
                    B.toTeX() + "$ = " + this.answer;
            }
            else if (dice === 2) {
                this.question = "$X \\cdot A = B$, $\\quad$  essent $\\quad$ $A=" + A.toTeX() + "\\,$, $B=" + B.toTeX() + "$";
                const X = B.multiply(inverse);
                this.answer = X;
                this.steps = "$|A|=" + det.toTeX() + "\\neq 0$, existeix $A^{-1}$. Multiplicam els dos membres de l'equació per $A^{-1}$ $\\,\\rightarrow \\,$ ";
                this.steps += " $X \\cdot A \\cdot A^{-1} =  B \\cdot A^{-1}$  $\\,\\rightarrow \\,$  $X=B \\cdot A^{-1}$ = $" + B.toTeX() + "\\cdot " +
                    inverse.toTeX() + "$ = " + this.answer;
            }
        }
        else {
            let C = Matrix_1.Matrix.fromDefinition(dim, dim, (i, j) => rnd.numericBetween(-r, r));
            let detC = C.determinant();
            while (detC.isZero()) {
                C = Matrix_1.Matrix.fromDefinition(dim, dim, (i, j) => rnd.numericBetween(-r, r));
                detC = C.determinant();
            }
            const dice = rnd.intBetween(1, 3);
            if (dice === 1) {
                this.question = "$A\\cdot X + C = B$,  $\\quad$ essent $\\quad$ $A=" + A.toTeX() + "\\,$, $B=" + B.toTeX() + "$, $C=" + C.toTeX() + "$";
                const X = inverse.multiply(B.substract(C));
                this.answer = X;
                this.steps = "$|A|=" + det.toTeX() + "\\neq 0$, existeix $A^{-1}$. $A\\cdot X = B-C$, multiplicam els dos membres de l'equació per $A^{-1}$ $\\,\\rightarrow \\,$";
                this.steps += " $A^{-1}\\cdot A \\cdot X  = A^{-1}\\cdot (B-C)$  $\\,\\rightarrow \\,$  $X=A^{-1}\\cdot (B-C)$ = $" + inverse.toTeX() + "\\cdot " +
                    B.substract(C).toTeX() + "$ = " + this.answer;
            }
            else if (dice === 2) {
                this.question = "$A \\cdot X \\cdot C = B$,  $\\quad$ essent $\\quad$ $A=" + A.toTeX() + "\\,$, $B=" + B.toTeX() + "$, $C=" + C.toTeX() + "$";
                const inverseC = C.inverse();
                const X = inverse.multiply(B.multiply(inverseC));
                this.answer = X;
                this.steps = "$|A|=" + det.toTeX() + "\\neq 0$, existeix $A^{-1}$. $|C|=" + detC.toTeX() + "\\neq 0$, existeix $A^{-1}$ i $C^{-1}$. Multiplicam els dos membres de l'equació per $A^{-1}$ i $C^{-1}$ $\\,\\rightarrow \\,$";
                this.steps += " $A^{-1}\\cdot A \\cdot X \\cdot C \\cdot C^{-1}  = A^{-1}\\cdot B \\cdot C^{-1}$  $\\,\\rightarrow \\,$  $X=A^{-1}\\cdot B \\cdot C^{-1}$ = $" + inverse.toTeX() + "\\cdot " +
                    B.toTeX() + " \\cdot " + inverseC.toTeX() + "$ = " + this.answer;
            }
            else if (dice === 3) {
                const A2 = A.add(Matrix_1.Matrix.Identity(dim));
                this.question = "$X \\cdot A = X + B^{2}$,  $\\quad$ essent $\\quad$ $A=" + A2.toTeX() + "\\,$, $B=" + B.toTeX() + "$";
                const X = B.multiply(inverse);
                this.answer = X;
                this.steps = " $X\\cdot (A-I)= B$ $\\rightarrow$ $|A-I|=" + det.toTeX() + "\\neq 0$, existeix $(A-I)^{-1}$.  Multiplicam els dos membres de l'equació per $(A-I)^{-1}$ $\\,\\rightarrow \\,$";
                this.steps += " $X = B \\cdot (A-I)^{-1}$ = $" + B.toTeX() + "\\cdot " +
                    inverse.toTeX() + "$ = " + this.answer;
            }
        }
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.question;
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.answer.toTeX() + "$";
        });
    }
    getSteps() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.steps;
        });
    }
    getQuizz() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                type: "cloze",
                html: `
                <p>\\( X= \\) ${this.answer.toClozeForm()}</p>                
            `
            };
        });
    }
};
MatrixEquations = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/matrix/equations",
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
            },
            {
                name: "complexity",
                defaults: 1,
                description: "Dimension of matrices 1--2"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], MatrixEquations);
exports.MatrixEquations = MatrixEquations;
//# sourceMappingURL=MatrixEquations.js.map