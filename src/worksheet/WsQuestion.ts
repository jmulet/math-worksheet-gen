import { QuestionGenInterface } from "../interfaces/QuestionGenInterface";
import { QuestionOptsInterface } from "../interfaces/QuestionOptsInterface";
import { GenClass } from "../interfaces/GenClass";

export class WsQuestion {

    qsGen: QuestionGenInterface;
    constructor(private qsClass: GenClass, private qsGenOpts: QuestionOptsInterface) {
        this.qsGen = <QuestionGenInterface> new qsClass(qsGenOpts);        
    }
 
    toLaTeX(): string {
        return this.qsGen.getFormulation("latex");
    }

    answerToLaTeX(): string {
        return this.qsGen.getAnswer("latex");
    }

    toHtml(): string {
        return this.qsGen.getFormulation("html");
    }

    answerToHtml(): string {
        return this.qsGen.getAnswer("html");
    }
}