import { QuestionGenInterface } from "../interfaces/QuestionGenInterface";
import { QuestionOptsInterface } from "../interfaces/QuestionOptsInterface";
import { GenClass } from "../interfaces/GenClass";

export class WsQuestion {
    includeKeys: number;
    type: string;
    qsGen: QuestionGenInterface;
    constructor(private qsClass: GenClass, private qsGenOpts: QuestionOptsInterface) {
        this.qsGen = <QuestionGenInterface> new qsClass(qsGenOpts);  
        this.type = this.qsGenOpts.question.type;      
    }
 
    toLaTeX(): string {
        return this.qsGen.getFormulation("latex");
    }

    answerToLaTeX(): string {
        let answer = "";
        const stepsFun = this.qsGen.getSteps;
        if (stepsFun && this.includeKeys < 0) {
            answer = stepsFun.call(this.qsGen, "latex");
        }
        if (!answer) {
            answer = this.qsGen.getAnswer("latex")
        }
        return answer;
    }

    toHtml(): string {
        return this.qsGen.getFormulation("html");
    }

    answerToHtml(): string {
        let answer = ""; 
        const stepsFun = this.qsGen.getSteps;
        if (stepsFun && this.includeKeys < 0) {
            answer = stepsFun.call(this.qsGen, "html");
        }
        if (!answer) {
            answer = this.qsGen.getAnswer("html")
        } 
        return answer;
    }

    distractorsHtml(): string[] {
        return this.qsGen.getDistractors("html");
    }
}