"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WsActivity_1 = require("./WsActivity");
const Vector_1 = require("../math/Vector");
const Polynomial_1 = require("../math/Polynomial");
const PolyMonomial_1 = require("../math/PolyMonomial");
const AlgebraicFraction_1 = require("../math/AlgebraicFraction");
const Numeric_1 = require("../math/Numeric");
const vm = require('vm');
class WsSection {
    constructor(title, opts) {
        this.title = title;
        this.opts = opts;
        this.activities = [];
    }
    createActivity(formulation, scope, qClass, qGenOpts) {
        if (scope && Object.keys(scope).length) {
            try {
                const context = { rnd: this.opts.rand, Vector: Vector_1.Vector, Polynomial: Polynomial_1.Polynomial,
                    PolyMonomial: PolyMonomial_1.PolyMonomial, Numeric: Numeric_1.Numeric, AlgebraicFraction: AlgebraicFraction_1.AlgebraicFraction };
                vm.createContext(context);
                // Must evaluate this scope into objects
                for (let key in scope) {
                    vm.runInContext(key + "=" + scope[key], context);
                    scope[key] = context[key];
                }
                // Finally eval formulation into the given scope
                vm.runInContext("_formulation = \`" + formulation + "\`", context);
                formulation = context["_formulation"];
            }
            catch (Ex) {
                console.log(Ex);
            }
        }
        const activity = new WsActivity_1.WsActivity(formulation, Object.assign({ scope: scope }, this.opts), qClass, qGenOpts);
        this.activities.push(activity);
        return activity;
    }
    toLaTeX() {
        const latex = [];
        latex.push("  \\section{" + this.title + "}");
        latex.push("     \\begin{enumerate}[resume]");
        this.activities.forEach((activity) => {
            latex.push(...activity.toLaTeX());
        });
        latex.push("     \\end{enumerate}");
        latex.push(" ");
        return latex;
    }
    answersToLaTeX() {
        const latex = [];
        this.activities.forEach((activity) => {
            latex.push(...activity.answersToLaTeX());
        });
        return latex;
    }
    toHtml(activityCounter) {
        const latex = [];
        latex.push('<ol class="olsection">');
        latex.push('  <li><h3 style="display: inline-block;"><b>' + this.title + "</b></h3></li>");
        latex.push('  <ol start="' + activityCounter + '">');
        this.activities.forEach((activity) => {
            latex.push(...activity.toHtml());
        });
        latex.push("  </ol>");
        latex.push("</ol><hr/>");
        return latex;
    }
    answersToHtml(activityCounter) {
        const latex = [];
        latex.push('<ol start="' + activityCounter + '">');
        this.activities.forEach((activity) => {
            latex.push(...activity.answersToHtml());
        });
        latex.push("</ol>");
        return latex;
    }
}
exports.WsSection = WsSection;
//# sourceMappingURL=WsSection.js.map