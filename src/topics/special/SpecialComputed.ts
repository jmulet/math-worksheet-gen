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
    category: "special/computed",
    parameters: [
        {
            name: "qFormulation",
            defaults: "",
            description: "Question formulation (have access to scope from parent activity)"
        },
        {
            name: "qAnswer",
            defaults: "",
            description: "Question Answer (have access to scope from parent activity)"
        },
        {
            name: "qDistractors",
            defaults: "[]",
            description: "Question answer distractors ['a','b','c',...] (to build a multiple-choice question)"
        }
    ]
})
export class SpecialComputed implements QuestionGenInterface {     
    qFormulation: string;
    qAnswer: string;
    qDistractors: string[];
    name = "special/computed";
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const scope = qGenOpts.scope;
        const r = qGenOpts.question.interval || 10;
        this.qFormulation = qGenOpts.question.qFormulation || "";
        this.qAnswer = qGenOpts.question.qAnswer || "";
        try {
            this.qDistractors = JSON.parse(qGenOpts.question.qDistractors) || [];
        } catch(Ex){

        }

        // Eval every string in a scoped context   
        const context = {...scope, Math: Math};
        vm.createContext(context);             
        this.qFormulation = evalInContext(this.qFormulation, context);
        this.qAnswer = evalInContext(this.qAnswer, context);
        this.qDistractors = this.qDistractors.map( e => evalInContext(e, context));
    }

    async getFormulation(): Promise<string> {        
        return this.qFormulation;
    }

    async getAnswer(): Promise<string> {        
        return this.qAnswer;
    }
  
}