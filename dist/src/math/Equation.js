"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Numeric_1 = require("./Numeric");
const Giac_1 = require("./Giac");
var EQUATION_SYMBOLS;
(function (EQUATION_SYMBOLS) {
    EQUATION_SYMBOLS[EQUATION_SYMBOLS["eq"] = 0] = "eq";
    EQUATION_SYMBOLS[EQUATION_SYMBOLS["lt"] = 1] = "lt";
    EQUATION_SYMBOLS[EQUATION_SYMBOLS["gt"] = 2] = "gt";
    EQUATION_SYMBOLS[EQUATION_SYMBOLS["leq"] = 3] = "leq";
    EQUATION_SYMBOLS[EQUATION_SYMBOLS["geq"] = 4] = "geq";
})(EQUATION_SYMBOLS = exports.EQUATION_SYMBOLS || (exports.EQUATION_SYMBOLS = {}));
class Equation {
    constructor(lhs, rhs, symbol = EQUATION_SYMBOLS.eq) {
        this.lhs = lhs;
        this.rhs = rhs;
        this.symbol = symbol;
    }
    // Polynomial equations ==================
    linealFromRoot(root, complexity = 2) {
        this.polynomialFromRoots(root, 1, complexity);
    }
    quadraticFromRoots(roots, complexity = 2) {
        this.polynomialFromRoots(roots, 2, complexity);
    }
    ;
    factorizableFromRoots(roots) {
    }
    ;
    biquadraticFromQuadraticRoots(roots, complexity = 1) {
        if (roots.length !== 2) {
            throw new Error("Equation:: Expecting two roots in biquadraticFromQuadraticRoots");
        }
        const [r1, r2] = roots;
        let A = 1;
        let B = r1.add(r2).oposite();
        let C = r1.multiply(r2);
        // Get rid of possible denominators
        const lcm = parseInt(Giac_1.Giac.lcm(B["d"], C["d"]));
        if (lcm > 1) {
            A = lcm;
            B = B.multiply(Numeric_1.Numeric.fromNumber(lcm));
            C = C.multiply(Numeric_1.Numeric.fromNumber(lcm));
        }
        this.lhs = "";
        this.rhs = "";
    }
    ;
    polynomialFromRoots(roots, degree = 2, complexity = 0) {
        this.lhs = "";
        this.rhs = "";
    }
    ;
    // Rational equations =====================
    // Radical equations ======================
    // Exponential equations ==================
    // Logarithmic equations ==================
    // Trigonometric equations ================
    toString() {
        return this.lhs + " " + this.symbol + " " + this.rhs;
    }
    toTeX() {
        return this.lhs + " " + this.symbol + " " + this.rhs;
    }
    solutions() {
        if (this.symbol === EQUATION_SYMBOLS.eq) {
            // Equation
        }
        else {
            // Innequation
        }
        return this.answers;
    }
    solutionsTeX() {
        return "todo";
    }
}
exports.Equation = Equation;
//# sourceMappingURL=Equation.js.map