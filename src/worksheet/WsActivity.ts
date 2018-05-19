import { WsQuestion } from "./WsQuestion"; 
import { ActivityOptsInterface } from "../interfaces/ActivityOptsInterface";
import { GenClass } from "../interfaces/GenClass";
import { QuestionOptsInterface } from "../interfaces/QuestionOptsInterface";

export class WsActivity { 
    questions: WsQuestion[] = []
    constructor(public formulation: string, private opts: ActivityOptsInterface, private qClass?: GenClass, private qGenOpts?: any) {
    }

    // if times < 0, then reuse the same question gen object for all times
    useRepeat(qClass?: GenClass, qGenOpts?: any, times=1, reuse?: boolean): WsActivity {
        qClass = qClass || this.qClass;
        qGenOpts = qGenOpts || this.qGenOpts || {};        

        let question;
        for (var i = 0; i < times; i++ ) {
            if(!reuse || !question) {
                question = new WsQuestion(qClass, {question: qGenOpts, ...this.opts});
            }
            this.questions.push(question);
        }
        return this;
    }
  
    getQuestions(): WsQuestion[] {
        return this.questions;
    }

    toLaTeX(): string[] {
        const latex = [];
        latex.push("    \\item " + this.formulation );
        latex.push("    \\begin{tasks}(2)");
        this.questions.forEach( (question) => {
            try {
                latex.push("      \\task " + question.toLaTeX());
            } catch (Ex) {
                console.log('EXCEPTION:: Skipping question:: ', Ex);
                const ind = this.questions.indexOf(question);
                this.questions.splice(ind, 1);
            }            
        })
        latex.push("    \\end{tasks}");
        
        return latex;
    }

    answersToLaTeX(): string[] {
        const latex = [];
        latex.push("    \\item ");
        latex.push("    \\begin{tasks}(2)");
        this.questions.forEach( (question) => {
            latex.push("      \\task " + question.answerToLaTeX());
        })
        latex.push("    \\end{tasks}");
        
        return latex;
    }

    toHtml(): string[] {
        const latex = [];
        latex.push("    <li> " + this.formulation + "</li>");
        latex.push('    <ol class="olalpha">'); 
        this.questions.forEach( (question) => {
            try {
                latex.push("      <li> " + question.toHtml() + "</li>");
            } catch (Ex) {
                console.log('EXCEPTION:: Skipping question:: ', Ex);
                const ind = this.questions.indexOf(question);
                this.questions.splice(ind, 1);
            }            
        });
        latex.push("    </ol>");
        
        return latex;
    }

    answersToHtml(): string[] {
        const latex = [];
        latex.push('  <li>');
        latex.push('    <ol class="olalpha">');
        this.questions.forEach( (question) => {
            latex.push("    <li> " + question.answerToHtml() + "</li>");
        });
        latex.push("    </ol>");
        latex.push("  </li>");
        
        return latex;
    }
}