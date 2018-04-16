import { WsQuestion } from "./WsQuestion"; 
import { ActivityOptsInterface } from "../interfaces/ActivityOptsInterface";
import { GenClass } from "../interfaces/GenClass";
import { QuestionOptsInterface } from "../interfaces/QuestionOptsInterface";

export class WsActivity {
    qGenOpts: any;
    qClass: GenClass;
    questions: WsQuestion[] = []
    constructor(private formulation: string, private opts: ActivityOptsInterface) {
    }

    use(qClass: GenClass, qGenOpts?: any): WsActivity {
        this.qClass = qClass;
        this.qGenOpts = qGenOpts;
        return this;
    }

    repeat(times: number): WsActivity {
        for (var i = 0; i < times; i++ ) {
            const question = new WsQuestion(this.qClass, {question: this.qGenOpts, ...this.opts});
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
            latex.push("      \\task " + question.toLaTeX());
        })
        latex.push("    \\end{tasks}");
        
        return latex;
    }

    answersToLaTeX(): string[] {
        const latex = [];
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
        latex.push('    <ol style="list-style-type: lower-alpha;">'); 
        this.questions.forEach( (question) => {
            latex.push("      <li> " + question.toHtml() + "</li>");
        })
        latex.push("    </ol>");
        
        return latex;
    }

    answersToHtml(): string[] {
        const latex = [];
        latex.push('    <ol style="list-style-type: lower-alpha;">');
        this.questions.forEach( (question) => {
            latex.push("    <li> " + question.answerToHtml() + "</li>");
        })
        latex.push("    </ol>");
        
        return latex;
    }
}