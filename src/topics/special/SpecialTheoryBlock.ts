import { WsGenerator } from "../../util/WsGenerator";
import { QuestionGenInterface } from "../../interfaces/QuestionGenInterface";
import { QuestionOptsInterface } from "../../interfaces/QuestionOptsInterface";
import { Random } from "../../util/Random";
import * as vm from "vm";

function evalInContext(str: string, context: any): string {
        let evaluated = "";  
        try {
            vm.runInContext("_evaluated = \`" + str + "\`", context);
            evaluated = context["_evaluated"];
        } catch(Ex) {
            console.log(Ex);
        }
        return evaluated;
}

@WsGenerator({
    category: "special/theoryblock",
    parameters: [
        {
            name: "qFormulation",
            defaults: "",
            description: "text that will appear in a box"
        }
    ]
})
export class SpecialTheoryBlock implements QuestionGenInterface {     
    qFormulation: string;
    qAnswer: string;
    qDistractors: string[];
    name = "special/theoryblock";
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const scope = qGenOpts.scope;
        const r = qGenOpts.question.interval || 10;
        this.qFormulation = qGenOpts.question.qFormulation || "";
         
    }

    getFormulation(format?: string): string {       
        if (format==="html") {
            return '<div style="background:rgb(200,200,255); border:1px solid blue; padding:5px">' +
                     this.qFormulation + "</div>";
        } else {
            return this.qFormulation;
        } 
    }

    getAnswer(): string {  
        // Skip this answer      
        return null;
    }
 
    getDistractors(): string[] {
        // Skip these distractors
        return null;
    }
}