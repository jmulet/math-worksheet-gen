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
const Giac_1 = require("../../../math/Giac");
const Formatter_1 = require("../../../util/Formatter");
const Numeric_1 = require("../../../math/Numeric");
const Polynomial_1 = require("../../../math/Polynomial");
const VARNAMES = ["x", "y", "z", "t", "w"];
let EquationsNonlinearSystem = class EquationsNonlinearSystem {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        let complexity = qGenOpts.question.complexity || 1;
        const graphical = qGenOpts.question.graphical || false;
        const dimension = 2;
        let operations = (qGenOpts.question.operations || "*,^").split(",").map(e => e.trim());
        if (operations.length === 0) {
            operations.push("^");
        }
        const roots = rnd.intList(2, -r, r);
        let [rootX, rootY] = roots;
        const coin = rnd.intBetween(0, operations.length - 1);
        const op = operations[coin];
        if (op === "sqrt") {
            // we want sqrt to be exact, so
            const alpha = rnd.intBetween(1, 5);
            roots[1] = alpha * alpha - roots[0];
            rootY = roots[1];
        }
        const eqns = [];
        const eqnsTeX = [];
        if (graphical) {
            complexity = 1;
        }
        if (complexity === 1) {
            // In complexity 1: Create a linear equation with at least one coef being +- 1
            const linCoefs = rnd.intList(2, r);
            linCoefs[rnd.intBetween(0, 1)] = rnd.intBetweenNotZero(-1, 1);
            const rightScalar = linCoefs.map((e, k) => e * roots[k]).reduce((pv, cv) => cv + pv);
            const lhsTeX = linCoefs.map((e, k) => {
                let str = Formatter_1.Formatter.numericXstringTeX(false, Numeric_1.Numeric.fromNumber(e), Random_1.BAR_NAMES[k]);
                if (k > 0 && e > 0) {
                    str = " + " + str;
                }
                return str;
            });
            const lhs = linCoefs.map((e, k) => {
                let str = Formatter_1.Formatter.numericXstring(Numeric_1.Numeric.fromNumber(e), Random_1.BAR_NAMES[k]);
                if (k > 0 && e > 0) {
                    str = " + " + str;
                }
                return str;
            });
            eqns.push(lhs.join("") + "=" + rightScalar);
            eqnsTeX.push(lhsTeX.join("") + "&=" + rightScalar);
            if (graphical) {
                // Make the second equation non-linear but easy to draw
                const coin = rnd.intBetween(0, 1);
                if (coin === 0) {
                    // The second eq. is a parabola
                    const alpha = rnd.intBetween(-r, r);
                    const beta = rootY + rootX * (2 * alpha - rootX);
                    const coefs = [1, -2 * alpha, beta];
                    eqns.push("y=" + new Polynomial_1.Polynomial(coefs).toString());
                    eqnsTeX.push("y&=" + new Polynomial_1.Polynomial(coefs).toTeX() + "");
                }
                else {
                    // The second eq. is inverse proportional
                    const rhs = rootX * rootY;
                    eqns.push("x*y=" + rhs);
                    eqnsTeX.push("x \\cdot y" + "&=" + rhs + "");
                }
            }
            else {
                // The second equation is non-linear and picked from the allowed operations
                if (op === "^") {
                    const op2 = rnd.pickOne(["+", "-"]);
                    const lhs = "x**2 " + op2 + "y**2";
                    const lhsTeX = "x^2 " + op2 + "y^2";
                    let rhs = rootX * rootX;
                    if (op2 === "+") {
                        rhs += rootY * rootY;
                    }
                    else {
                        rhs -= rootY * rootY;
                    }
                    eqns.push(lhs + "=" + rhs);
                    eqnsTeX.push(lhsTeX + "&=" + rhs);
                }
                else if (op === "*") {
                    const rhs = rootX * rootY;
                    eqns.push("x*y=" + rhs);
                    eqnsTeX.push("x \\cdot y" + "&=" + rhs);
                }
                else {
                    const beta = rnd.intBetween(2, 5);
                    const rhs = beta * rootX + Math.sqrt(rootX + rootY);
                    eqns.push(beta + "*x + sqrt(x + y) =" + rhs);
                    eqnsTeX.push(beta + " x + \\sqrt{x + y} &=" + rhs);
                }
            }
        }
        else {
            // Complexity 2, both equations are nonlinear
            // Cases for the selected operation op are applied here
            if (op === "^") {
                let rhs = rootX * rootX + rootY * rootY;
                eqns.push("x**2 + y**2 =" + rhs);
                eqnsTeX.push("x^2 + y^2 &=" + rhs);
                rhs = rootX * rootX - rootY * rootY;
                eqns.push("x**2 - y**2 =" + rhs);
                eqnsTeX.push("x^2 - y^2 &=" + rhs);
            }
            else if (op === "*") {
                let rhs = rootX * rootY;
                eqns.push("x*y =" + rhs);
                eqnsTeX.push("x \\cdot y &=" + rhs);
                const op3 = rnd.pickOne(["+", "-"]);
                rhs = rootX * rootX + (op3 === "+" ? 1 : -1) * rootY * rootY;
                eqns.push("x**2 " + op3 + " y**2 =" + rhs);
                eqnsTeX.push("x^2 " + op3 + " y^2 &=" + rhs);
            }
            else {
                rootX = Math.abs(rootX);
                rootY = Math.abs(rootY);
                let rhs = rootX + rootY;
                eqns.push("sqrt(x) + sqrt(y) =" + rhs);
                eqnsTeX.push("\\sqrt{x} + \\sqrt{y} &=" + rhs);
                rhs = rootX - rootY;
                eqns.push("sqrt(x) - sqrt(y) =" + rhs);
                eqnsTeX.push("\\sqrt{x} - \\sqrt{y} &=" + rhs);
            }
        }
        this.question = "\\left\\{ \\begin{array}{ll}  ";
        this.question += eqnsTeX.join("\\\\");
        this.question += "\\end{array} \\right.";
        this.answer = Giac_1.Giac.evaluate("latex(solve([" + eqns.join(", ") + "], [x,y]))").replace(/"/g, "");
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.question + "$";
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$" + this.answer + "$";
        });
    }
};
EquationsNonlinearSystem = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/system/nonlinear",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "complexity",
                defaults: 1,
                description: "Complexity; From 1-2. In 1 one equation is made linear"
            },
            {
                name: "dimension",
                defaults: 2,
                description: "Only dimension 2 is implemented"
            },
            {
                name: "operations",
                defaults: "*,^,sqrt",
                description: "which operations can lead to non-linearity"
            },
            {
                name: "graphical",
                defaults: false,
                description: "When true, the activity is prepared to be done graphically"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], EquationsNonlinearSystem);
exports.EquationsNonlinearSystem = EquationsNonlinearSystem;
//# sourceMappingURL=NonLinearSystem.js.map