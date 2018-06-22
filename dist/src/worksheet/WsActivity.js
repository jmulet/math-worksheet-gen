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
        this.qGenOpts = this.qGenOpts || {};
    }
    useRepeat(qClass, qGenOpts, times = 1, type, reuse) {
        qClass = qClass || this.qClass;
        qGenOpts = qGenOpts || this.qGenOpts || {};
        for (let i = 0; i < times; i++) {
            const question = new WsQuestion_1.WsQuestion(qClass, Object.assign({ question: qGenOpts }, this.opts));
            this.questions.push(question);
        }
        return this;
    }
    getQuestions() {
        return this.questions;
    }
    toLaTeX() {
        const latex = [];
        if (this.questions.length === 0) {
            // Assume that this is a theory box
            latex.push("\n\n \\makebox[\\textwidth]{" + this.formulation.replace(/\n/g, '\n\n') + "}\n\n");
        }
        else if (this.questions.length === 1) {
            latex.push("    \\item ");
            latex.push("    \\begin{tasks}(2)");
            this.questions.forEach((question) => {
                latex.push("    \\item " + this.formulation.replace(/\n/g, '\n\n') + question.toLaTeX());
            });
            latex.push("    \\end{tasks}");
        }
        else {
            latex.push("    \\item " + this.formulation.replace(/\n/g, '\n\n'));
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
        }
        return latex;
    }
    answersToLaTeX() {
        const latex = [];
        latex.push("    \\item ");
        latex.push("    \\begin{tasks}(2)");
        // Skip activity with no questions
        this.questions.forEach((question) => {
            latex.push("      \\task " + question.answerToLaTeX());
        });
        latex.push("    \\end{tasks}");
        return latex;
    }
    toHtml() {
        const latex = [];
        //Check it this activity contains no questions
        if (this.questions.length === 0) {
            // Assume that this is not a question and it is displayed as theory block
            latex.push('<div style="background:rgb(200,200,255); box-shadow: 5px 5px grey; webkit-box-shadow: 5px 5px grey; moz-box-shadow: 5px 5px grey; border-radius: 5px; width:95%; border:1px solid blue; padding:5px"><p class="activity-formulation">' +
                this.formulation + "</p></div>");
        }
        else if (this.questions.length === 1) {
            const q = this.questions[0];
            latex.push('    <li> <p><span class="activity-formulation">' + this.formulation.replace(/\n/g, '<br/>') + ' ');
            latex.push(q.toHtml());
            latex.push('</span></p></li>');
        }
        else {
            latex.push('    <li> <p><span class="activity-formulation">' + this.formulation.replace(/\n/g, '<br/>') + "</span></p></li>");
            latex.push('    <ol class="olalpha">');
            this.questions.forEach((question, indx) => {
                let sampleAnswer = "";
                const qHtml = question.toHtml();
                const answer = question.answerToHtml();
                const hasAnswer = answer && answer !== "Correcció manual";
                if (this.qGenOpts.showFirstQuestionAnswer && hasAnswer && indx === 0 && (question.qsGen.name || "").indexOf("special/") < 0) {
                    const trim = qHtml.replace(/\$/g, '').replace(/ /g, '');
                    if (trim.lastIndexOf("=") !== trim.length - 1 && trim.lastIndexOf("={}") !== trim.length - 3) {
                        sampleAnswer = "  $\\quad\\rightarrow \\quad$ ";
                    }
                    sampleAnswer += answer;
                }
                try {
                    latex.push('      <li> <p class="question-formulation">' + qHtml + '<span style="color:red">' + sampleAnswer + "</span></p></li>");
                }
                catch (Ex) {
                    console.log('EXCEPTION:: Skipping question:: ', Ex);
                    const ind = this.questions.indexOf(question);
                    this.questions.splice(ind, 1);
                }
            });
            latex.push("    </ol>");
        }
        return latex;
    }
    answersToHtml() {
        const latex = [];
        const n = this.questions.length;
        if (n) {
            latex.push('  <li>');
            if (n > 1) {
                latex.push('    <ol class="olalpha">');
                // Skip activity with no questions
                this.questions.forEach((question) => {
                    latex.push('    <li> <p class="question-formulation">' + question.answerToHtml() + "</p></li>");
                });
                latex.push("    </ol>");
            }
            else {
                latex.push(' <p class="question-formulation">' + this.questions[0].answerToHtml() + "</p>");
            }
            latex.push("  </li>");
        }
        return latex;
    }
}
exports.WsActivity = WsActivity;
//# sourceMappingURL=WsActivity.js.map