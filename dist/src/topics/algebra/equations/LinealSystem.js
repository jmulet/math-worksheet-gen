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
const Giac_1 = require("../../../math/Giac");
const Formatter_1 = require("../../../util/Formatter");
const Numeric_1 = require("../../../math/Numeric");
const VARNAMES = ["x", "y", "z", "t", "w"];
let EquationsLinealSystem = class EquationsLinealSystem {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        let complexity = qGenOpts.question.complexity || 1;
        let dimension = qGenOpts.question.dimension || 2;
        let nequations = qGenOpts.question.nequations || dimension;
        const allowIncompatible = qGenOpts.question.allowIncompatible || false;
        const allowIndeterminate = qGenOpts.question.allowIndeterminate || false;
        const extraComplexity = qGenOpts.question.extraComplexity || false;
        if (dimension > 5) {
            dimension = 5;
        }
        const matrix = [];
        const rightVector = [];
        const eqns = [];
        const eqnsTeX = [];
        const bars = Random_1.BAR_NAMES.slice(0, dimension);
        //Provide a solution for the system (by Default assume SCD)
        const roots = [];
        for (var i = 0; i < dimension; i++) {
            const root = rnd.intBetween(-r, r);
            roots.push(root);
        }
        for (var i = 0; i < nequations; i++) {
            const coefs = rnd.intList(dimension, -r, r);
            matrix.push(coefs);
        }
        //Make sure that at least one coef is one in complexity=1
        if (complexity < 2) {
            matrix[rnd.intBetween(0, nequations - 1)][0] = 1;
        }
        // Compute rhs to verify the given root   
        for (var i = 0; i < nequations; i++) {
            const coefs = matrix[i];
            const rhs = coefs.map((e, k) => e * roots[k]).reduce((pv, cv) => cv + pv);
            rightVector.push(rhs);
        }
        const coin = rnd.intBetween(0, 3);
        if ((allowIndeterminate || allowIncompatible) && coin < 1) {
            for (var k = 0; k < dimension; k++) {
                matrix[nequations - 1][k] = 0;
            }
            rightVector[nequations - 1] = 0;
            //Make the system indeterminate (infinite solucions)
            //Modify an equation to make it linear combination of the other ones.
            const combCoefs = []; //Coeficients de la combinació
            for (var k = 0; k < nequations - 1; k++) {
                combCoefs.push(rnd.numericBetweenNotZero(-r, r));
            }
            for (var k = 0; k < nequations - 2; k++) {
                const coefs = matrix[k];
                for (var s = 0; s < coefs.length; s++) {
                    matrix[nequations - 1][s] += combCoefs[k] * coefs[s];
                }
                rightVector[nequations - 1] += combCoefs[k] * rightVector[k];
            }
            if (allowIncompatible && coin === 0) {
                //Make it incompatible by changing one rightVector coef
                rightVector[nequations - 1] += rnd.intBetween(1, 5);
            }
        }
        // After matrix modifications build the display latex
        for (var i = 0; i < nequations; i++) {
            const coefs = matrix[i];
            const lhsTeX = coefs.map((e, k) => {
                let str = Formatter_1.Formatter.numericXstringTeX(false, Numeric_1.Numeric.fromNumber(e), Random_1.BAR_NAMES[k]);
                if (k > 0 && e > 0) {
                    str = " + " + str;
                }
                return str;
            });
            const lhs = coefs.map((e, k) => {
                let str = Formatter_1.Formatter.numericXstring(Numeric_1.Numeric.fromNumber(e), Random_1.BAR_NAMES[k]);
                if (k > 0 && e > 0) {
                    str = " + " + str;
                }
                return str;
            });
            eqns.push(lhs.join("") + "=" + rightVector[i]);
            if (extraComplexity) {
                const a = rnd.intBetween(2, 5);
                const b = rnd.intBetween(2, 5);
                const c = rnd.intBetween(2, 5);
                const d = rnd.intBetween(2, 5);
                const distractor1 = `${a}*(x-${b}*y )`;
                const distractor2 = `${d}*(x-y)`;
                const distractor1LaTeX = `${a} \\cdot (x-${b}y )`;
                const distractor2LaTeX = `${d} \\cdot (x-y)`;
                const newLHS = Giac_1.Giac.evaluate("latex(simplify(" + lhs.join("") + "+" + distractor1 + "))").replace(/"/g, "") + " + " + distractor2LaTeX;
                const newRHS = Giac_1.Giac.evaluate("latex(simplify(" + rightVector[i] + "+" + distractor2 + "))").replace(/"/g, "") + " + " + distractor1LaTeX;
                eqnsTeX.push(newLHS.replace(/\\cdot/g, "\\, ") + "&=" + newRHS.replace(/\\cdot/g, "\\, "));
            }
            else {
                eqnsTeX.push(lhsTeX.join("") + "&=" + rightVector[i]);
            }
        }
        this.answer = Giac_1.Giac.evaluate("latex(linsolve([" + eqns.join(",") + "], [" + bars + "]))").replace(/"/g, "").replace(/,/g, ", \\quad ").replace(/\[/, '').replace(/\]/, '');
        this.question = "\\left\\{ \\begin{array}{ll}  ";
        this.question += eqnsTeX.join("\\\\");
        this.question += "\\end{array} \\right.";
    }
    getFormulation() {
        return "$" + this.question + "$";
    }
    getAnswer() {
        return "$ \\left(" + this.answer + " \\right)$";
    }
    getDistractors() {
        return [];
    }
};
EquationsLinealSystem = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/system/lineal",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "complexity",
                defaults: 1,
                description: "Complexity; From 1-2"
            },
            {
                name: "extraComplexity",
                defaults: false,
                description: "Does not generate a matrix form sytem, needs reduction"
            },
            {
                name: "dimension",
                defaults: 2,
                description: "number of variables of the system from 2 to 5"
            },
            {
                name: "nequations",
                defaults: 2,
                description: "number of equations of the system from 2 to 5"
            },
            {
                name: "allowIncompatible",
                defaults: false,
                description: "generate problems that do not have any answer"
            },
            {
                name: "allowIndeterminate",
                defaults: false,
                description: "generate problems that do have infinite answers"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], EquationsLinealSystem);
exports.EquationsLinealSystem = EquationsLinealSystem;
//# sourceMappingURL=LinealSystem.js.map