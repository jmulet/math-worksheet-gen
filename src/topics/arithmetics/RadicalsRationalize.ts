import { QuestionGenInterface } from "../../interfaces/QuestionGenInterface";
import { Polynomial } from "../../math/Polynomial";
import { QuestionOptsInterface } from "../../interfaces/QuestionOptsInterface";
import { Random, BAR_NAMES } from "../../util/Random";
import { Radical } from "../../math/Radical";
import { Power } from "../../math/Power";
import { WsGenerator } from "../../util/WsGenerator";
import { PolyRadical } from "../../math/PolyRadical";
import { Monomial } from "../../math/Monomial";

@WsGenerator({
    category: "arithmetics/radicals/rationalize",
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
            name: "conjugate",
            defaults: false,
            description: "Allow conjugate +/- expression in denominador"
        }          
    ]
})
export class RadicalsRationalize implements QuestionGenInterface {
    
    question: string; 
    answer: string;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;               
        const domain = qGenOpts.question.domain || 'Z';
        const conjugate = qGenOpts.question.conjugate || false;
         
        if (conjugate) {
            //Only square-roots in conjugate mode
            let radical1 = rnd.radical({domain: 'Z', range: r, maxIndex: 2});
            let radical2 = rnd.radical({domain: 'Z', range: r, maxIndex: 2});
            while (!radical1.isRadical()) {
                radical1 = rnd.radical({domain: 'Z', range: r, maxIndex: 2});
            }
            while (!radical1.isRadical()) {
                radical2 = rnd.radical({domain: 'Z', range: r, maxIndex: 2});
            }
            const polyRad = new PolyRadical([radical1, radical2]);
            
            const radical3 = rnd.radical({domain: 'Z', range: r, maxIndex: 2}).simplify();            
            
            const radical1_2 = radical1.power(2).simplify();
            const radical2_2 = radical2.power(2).simplify();
            const denom = radical1_2.coefficient.coef.substract(radical2_2.coefficient.coef);
            const numerator = new PolyRadical([radical1.multiply(radical3), radical2.opposite().multiply(radical3)]);
            numerator.radicals.forEach( (r) => {
                r.coefficient.coef = r.coefficient.coef.divide(denom);
            });

            this.question = "\\dfrac{" + radical3.toTeX() + "}{" + polyRad.toTeX() + "}";  
            this.answer =  numerator.simplify().toTeX();                
        } else {
            let radical = rnd.radical({domain: 'Z', range: r, maxIndex: maxIndex, useCoeff: false});
            while (!radical.isRadical()) {
                radical = rnd.radical({domain: 'Z', range: r, maxIndex: maxIndex, useCoeff: false});
            }
            const topCoeff = rnd.intBetween(1, r);
            this.question = "\\dfrac{" + topCoeff + "}{" + radical.toTeX() + "}";  
            let radical2 = radical.power(radical.index - 1);
            radical2.coefficient = radical2.coefficient.multiply(Monomial.fromNumber(topCoeff)).divide(radical.radicand);
            this.answer =  radical2.simplify().toTeX();                
        }
                        
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