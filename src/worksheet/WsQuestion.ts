import { QuestionGenInterface } from "../interfaces/QuestionGenInterface";
import { QuestionOptsInterface } from "../interfaces/QuestionOptsInterface";
import { GenClass } from "../interfaces/GenClass";

export class WsQuestion {
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
        return this.qsGen.getSteps("latex") || this.qsGen.getAnswer("latex");
    }

    toHtml(): string {
        return this.qsGen.getFormulation("html");
    }

    answerToHtml(): string {
        return this.qsGen.getSteps("html") || this.qsGen.getAnswer("html");
    }

    distractorsHtml(): string[] {
        return this.qsGen.getDistractors("html");
    }
}