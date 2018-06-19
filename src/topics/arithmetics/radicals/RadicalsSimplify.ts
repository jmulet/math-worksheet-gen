import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';

@WsGenerator({
    category: "arithmetics/radicals/simplify",
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
        }        
    ]
})
export class RadicalsSimplify implements QuestionGenInterface {
    
    question: string;
    radicals: any[];
    answer: string;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;               
        const domain = qGenOpts.question.domain || 'Z';
         
        let radical = rnd.radical({domain: 'Z', range: r, maxIndex: maxIndex, simplificable: true});
        while(radical.radicand.isOne()) {
            radical = rnd.radical({domain: 'Z', range: r, maxIndex: maxIndex, simplificable: true});
        }
        this.question = radical.toTeX();  
        this.answer =  radical.simplify().toTeX();                
    }

    getFormulation(): string {        
       return "$" + this.question + "={}$";
    }

    getAnswer(): string {
        return "$" + this.answer + "$";
    }

    getDistractors(): string[] {
        return [];
    }
}