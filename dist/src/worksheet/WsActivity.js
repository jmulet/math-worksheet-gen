"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WsQuestion_1 = require("./WsQuestion");
class WsActivity {
    constructor(formulation, opts, qClass, qGenOpts) {
        this.formulation = formulation;
        this.opts = opts;
        this.qClass = qClass;
        this.qGenOpts = qGenOpts;
        this.questions = [];
    }
    // if times < 0, then reuse the same question gen object for all times
    useRepeat(qClass, qGenOpts, times = 1, type, reuse) {
        qClass = qClass || this.qClass;
        qGenOpts = qGenOpts || this.qGenOpts || {};
        let question;
        for (var i = 0; i < times; i++) {
            if (!reuse || !question) {
                question = new WsQuestion_1.WsQuestion(qClass, Object.assign({ question: qGenOpts }, this.opts));
                question.type = type;
            }
            this.questions.push(question);
        }
        return this;
    }
    getQuestions() {
        return this.questions;
    }
    toLaTeX() {
        const latex = [];
        latex.push("    \\item " + this.formulation);
        latex.push("    \\begin{tasks}(2)");
        this.questions.forEach((question) => {
            try {
                latex.push("      \\task " + question.toLaTeX());
            }
            catch (Ex) {
                console.log('EXCEPTION:: Skipping question:: ', Ex);
                const ind = this.questions.indexOf(question);
                this.questions.splice(ind, 1);
            }
        });
        latex.push("    \\end{tasks}");
        return latex;
    }
    answersToLaTeX() {
        const latex = [];
        latex.push("    \\item ");
        latex.push("    \\begin{tasks}(2)");
        this.questions.forEach((question) => {
            latex.push("      \\task " + question.answerToLaTeX());
        });
        latex.push("    \\end{tasks}");
        return latex;
    }
    toHtml() {
        const latex = [];
        latex.push("    <li> " + this.formulation + "</li>");
        latex.push('    <ol class="olalpha">');
        this.questions.forEach((question) => {
            try {
                latex.push("      <li> " + question.toHtml() + "</li>");
            }
            catch (Ex) {
                console.log('EXCEPTION:: Skipping question:: ', Ex);
                const ind = this.questions.indexOf(question);
                this.questions.splice(ind, 1);
            }
        });
        latex.push("    </ol>");
        return latex;
    }
    answersToHtml() {
        const latex = [];
        latex.push('  <li>');
        latex.push('    <ol class="olalpha">');
        this.questions.forEach((question) => {
            latex.push("    <li> " + question.answerToHtml() + "</li>");
        });
        latex.push("    </ol>");
        latex.push("  </li>");
        return latex;
    }
}
exports.WsActivity = WsActivity;
//# sourceMappingURL=WsActivity.js.map