import { QuestionGenInterface } from "../../../interfaces/QuestionGenInterface";
import { Polynomial } from "../../../math/Polynomial";
import { QuestionOptsInterface } from "../../../interfaces/QuestionOptsInterface";
import { Random, BAR_NAMES } from "../../../util/Random";
import { Radical } from "../../../math/Radical";
import { Power } from "../../../math/Power";
import { WsGenerator } from "../../../util/WsGenerator";
import { PolyRadical } from "../../../math/PolyRadical";

@WsGenerator({
    category: "arithmetics/radicals/notation",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        }, 
        {
            name: "domain",
            defaults: "Z",
            description: "Type of coefficent number generated"
        },          
        {
            name: "maxIndex",
            defaults: 5,
            description: "Max radical index"
        },
        {
            name: "representation",
            defaults: "root",
            description: "root or decimal: root activities transforming from root to power; decimal: activities determining decimal value of a root"
        },       
    ]
})
export class RadicalsNotation implements QuestionGenInterface {
    
    question: string;
    radicals: any[];
    answer: string;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;               
        const domain = qGenOpts.question.domain || 'Z';
        const representation = qGenOpts.question.representation || 'root';

        let radical = rnd.radical({domain: 'Z', range: r, maxIndex: maxIndex, useCoeff: false});
        while(!radical.isRadical()) {
            radical = rnd.radical({domain: 'Z', range: r, maxIndex: maxIndex, useCoeff: false});
        }
        
        if (representation === "root") {
            if (rnd.intBetween(0, 1) === 0) {
                this.question = radical.toTeX() + "={}";  
                this.answer =  radical.toPowerTeX();                
            } else {
                this.answer = radical.toTeX();  
                this.question =  radical.toPowerTeX() + "={}";                
            }
        } else {
            this.question = radical.toTeX() + "={}";  
            this.answer = radical.toDecimal();    
        }
    }

    async getFormulation(): Promise<string> {        
       return "$" + this.question + "$";
    }

    async getAnswer(): Promise<string> {
        return "$" + this.answer + "$";
    }

}