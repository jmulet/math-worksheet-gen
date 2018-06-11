import { QuestionGenInterface } from '../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../interfaces/QuestionOptsInterface';
import { Random } from '../../util/Random';
import { WsGenerator } from '../../util/WsGenerator';

@WsGenerator({
    category: "arithmetics/power/value",
    description: "The student must express a given power in decimal form, e.g. 2^{-3} = 0.0125",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random bases are generated"
        }, 
        {
            name: "domain",
            defaults: "Z",
            description: "Type of coefficent number generated"
        }, 
        {
            name: "minExp",
            defaults: -4,
            description: "Range in which exponents are generated"
        },
        {
            name: "maxExp",
            defaults: 4,
            description: "Range in which exponents are generated"
        } 
    ]
})
export class PowerValue implements QuestionGenInterface {
    
    question: string; 
    answer: string;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const minExp = qGenOpts.question.minExp || -4;        
        const maxExp = qGenOpts.question.maxExp || 4; 
        const domain = qGenOpts.question.domain || 'Z';
         
        const base = rnd.numericBetweenNotZero(-r, r, domain);
        const exp = rnd.intBetween(minExp, maxExp);
        const decimal = Math.pow(base.toNumber(), exp); 
        
        if (base.isNegative() || !base.isInt()) {
            this.question = "\\left( " + base.toTeX() + "\\right)^{" + exp + "}";  
        } else {
            this.question = base.toTeX()+ "^{" + exp + "}";  
        }
        
        this.answer =  decimal + "";                
    }

    getFormulation(): string {        
       return "$" + this.question + "$";
    }

    getAnswer(): string {
        return "$" + this.answer + "$";
    }

    getDistractors(): string[] {
        return [];
    }
}