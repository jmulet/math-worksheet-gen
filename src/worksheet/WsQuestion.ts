import { QuestionGenInterface } from "../interfaces/QuestionGenInterface";
import { QuestionOptsInterface } from "../interfaces/QuestionOptsInterface";
import { GenClass } from "../interfaces/GenClass";

export class WsQuestion {

    qsGen: QuestionGenInterface;
    constructor(private qsClass: GenClass, private qsGenOpts: QuestionOptsInterface) {
        this.qsGen = <QuestionGenInterface> new qsClass(qsGenOpts);        
    }
 
    toLaTeX(): string {
        return this.qsGen.getFormulation();
    }

    answerToLaTeX(): string {
        return this.qsGen.getAnswer();
    }
}