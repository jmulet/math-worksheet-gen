import { WsGenerator } from "../../../util/WsGenerator";
import { QuestionGenInterface } from "../../../interfaces/QuestionGenInterface";
import { Random } from "../../../util/Random";
import { QuestionOptsInterface } from "../../../interfaces/QuestionOptsInterface";
import { Numeric } from "../../../math/Numeric";

    
function displayLog(base: Numeric | string): string {
    if(typeof(base) === 'string') {
        if (base === "e") {
            return "\\ln ";
        }
    } else {
        if (base.toNumber() === 10) {
            return "\\log_{} ";
        }  else {
            return "\\log_{" + base.toTeX() + "} ";
        }
    }
}

function displayStrOrNumeric(a: Numeric | string): string {
    let base2: string;
    if (typeof(a) === "string") {
        base2 = a;
    } else {
        base2 = a.toTeX();
    }
    return base2;
}

@WsGenerator({
    category: "arithmetics/logarithm/definition",
    parameters: [
        {
            name: "interval",
            defaults: 5,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "domain",
            defaults: "Z",
            description: "Set of numbers"
        }            
    ]
})
export class RadicalsGather implements QuestionGenInterface {
    
    question: string;
    radicals: any[];
    answer: string;

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 5;
        const domain = qGenOpts.question.domain || 'Z';
        
        let base: Numeric | string; 
        // Use with same probability 10, e, any other
        const baseType = rnd.intBetween(0, 2);
        
        switch(baseType) {
            case 0:
                base = Numeric.fromNumber(10);
                break;
            case 1:
                base = "e";
                break;
            case 2:
                base = rnd.numericBetween(2, r, domain);
                break;
        }
         
        let result = rnd.intBetween(-r, r);
        let a;
        if (typeof(base) === 'string') {
            a = base + "^{" + result + "}";  
        } else {
            a = base.power(result);  
        }
        
        const type = rnd.intBetween(0, 2);

        switch(type) {
            case 0:
                this.question = displayLog(base) + displayStrOrNumeric(a) + " = x ";  
                this.answer =  "x=" + result ;             
                break;
            case 1:
                this.question = displayLog(base) + " x = " + result;  
                this.answer =  "x=" + displayStrOrNumeric(a) ;     
                break;
            case 2:
                this.question = "\\log_{x} " +displayStrOrNumeric(a) + " = " + result;  
              
                this.answer =  "x=" + displayStrOrNumeric(base) ;     
                break;
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
