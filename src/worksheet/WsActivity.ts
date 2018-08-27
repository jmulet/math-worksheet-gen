import { WsQuestion } from "./WsQuestion";
import { ActivityOptsInterface } from "../interfaces/ActivityOptsInterface";
import { GenClass } from "../interfaces/GenClass";

function removeLaTeXCmds(cmd: string): string {
    const filtered = (cmd || "").replace(/\s/g,"").replace(/\\/gm, "").replace(/\{/gm, "").replace(/\}/gm, "")
                      .replace(/dfrac/gmi,"").replace(/frac/gmi,"").replace(/sqrt/gmi,"").replace(/cdot/gmi, ".")
                      .replace(/beginarray/gmi," ").replace(/endarray/gmi," ")
                      .replace(/left/gmi,"").replace(/right/gmi,"")
                      .replace(/\^/gmi,"").replace(/\_/gmi,"");
 
    return filtered;
}

export class WsActivity {
    includeKeys: number;
    questions: WsQuestion[] = []
    constructor(public formulation: string, private opts: ActivityOptsInterface, private qClass?: GenClass, private qGenOpts?: any) {
        this.qGenOpts = this.qGenOpts || {}; 
    }

    useRepeat(qClass?: GenClass, qGenOpts?: any, times = 1, type?: string, reuse?: boolean): WsActivity {
        qClass = qClass || this.qClass;
        qGenOpts = qGenOpts || this.qGenOpts || {};
      
        for (let i=0; i<times; i++) {
            const question = new WsQuestion(qClass, { question: qGenOpts, ...this.opts });
            this.questions.push(question);
        }
        return this;
    }

    getQuestions(): WsQuestion[] {
        return this.questions;
    }

    toLaTeX(): string[] {
        const latex = [];

        if (this.questions.length === 0) {
            // Assume that this is a theory box
            latex.push("\\par \\noindent \\vspace{0.25cm} \\fcolorbox{purple}{MORAT}{ \\parbox{0.88\\textwidth}{" + this.formulation.replace(/\n/g, '\n\n')  + "}}\n\\vspace{0.25cm}\n\n");

        } else if (this.questions.length === 1) {
            this.questions.forEach((question) => {
                latex.push("    \\item " + this.formulation.replace(/\n/g, '\n\n') + question.toLaTeX());
            });           
        } else { 
            latex.push("    \\item " + this.formulation.replace(/\n/g, '\n\n'));

            // Try to guess the number of columns
            const lengths = this.questions.map(question => removeLaTeXCmds(question.toLaTeX()).length);
            const maxLength = Math.max(...lengths);
            const cols = maxLength < 26? 2 : 1;

            latex.push("    \\begin{tasks}(" + cols + ")");
            this.questions.forEach((question, i) => {
                const questionLaTeX = question.toLaTeX();
                const length = lengths[i];
                let decorator = " ";
                if (length >= 30) {
                    decorator="! ";
                }
                try {
                    latex.push("      \\task" + decorator + questionLaTeX);
                } catch (Ex) {
                    console.log('EXCEPTION:: Skipping question:: ', Ex);
                    const ind = this.questions.indexOf(question);
                    this.questions.splice(ind, 1);
                }
            })
            latex.push("    \\end{tasks}");
        }
        return latex;
    }

    answersToLaTeX(): string[] {
        const latex = [];
        latex.push("    \\item ");
        latex.push("    \\begin{tasks}(2)");
        // Skip activity with no questions
        this.questions.forEach((question, i) => {
            if (Math.abs(this.includeKeys)===1) {
                if (i === 0 ) {
                    latex.push("      \\task " + question.answerToLaTeX());
                }
            } else {
                latex.push("      \\task " + question.answerToLaTeX());
            }
        });
        latex.push("    \\end{tasks}");

        return latex;
    }

    toHtml(): string[] {
        const latex = [];

        //Check it this activity contains no questions

        if (this.questions.length === 0) {
            // Assume that this is not a question and it is displayed as theory block
            latex.push('<div style="background:rgb(200,200,255); box-shadow: 5px 5px grey; webkit-box-shadow: 5px 5px grey; moz-box-shadow: 5px 5px grey; border-radius: 5px; width:95%; border:1px solid blue; padding:5px"><p class="activity-formulation">' +
                this.formulation + "</p></div>");
        } else if (this.questions.length === 1) {
            const q = this.questions[0];
            latex.push('    <li> <p><span class="activity-formulation">' + this.formulation.replace(/\n/g, '<br/>') + ' ');
            latex.push(q.toHtml());
            latex.push('</span></p></li>');
        } else {
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
                } catch (Ex) {
                    console.log('EXCEPTION:: Skipping question:: ', Ex);
                    const ind = this.questions.indexOf(question);
                    this.questions.splice(ind, 1);
                }
            });
            latex.push("    </ol>");
        }

        return latex;
    }

    answersToHtml(): string[] {
        const latex = [];
        const n = this.questions.length;
        if (n) {
            latex.push('  <li>');
            if (n > 1) {
                latex.push('    <ol class="olalpha">');
                // Skip activity with no questions
                this.questions.forEach((question, i) => {
                    if (Math.abs(this.includeKeys)===1) {
                        if (i === 0 ) {
                            latex.push('    <li> <p class="question-formulation">' + question.answerToHtml() + "</p></li>");
                        }
                    } else {
                        latex.push('    <li> <p class="question-formulation">' + question.answerToHtml() + "</p></li>");
                    }                    
                });
                latex.push("    </ol>");
            } else {
                latex.push(' <p class="question-formulation">' + this.questions[0].answerToHtml() + "</p>");
            }
            latex.push("  </li>");
            
        }
        return latex;
    }
}