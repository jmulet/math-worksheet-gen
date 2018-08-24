import { QuestionGenInterface } from '../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../interfaces/QuestionOptsInterface';
import { Random } from '../../util/Random';
import { WsGenerator } from '../../util/WsGenerator';
import { Numeric } from '../../math/Numeric';

const BAR_NAMES = ['x', 'y', 'z', 'a', 'b', 'c'];

function displayPower(base: string, n: number): string {
    if (n === 0) {
        return "1";
    } else if (n===1) {
        return base.replace("\\left(","").replace("\\right)", "");
    } else {
        if (n % 2 === 0) {
            base = base.replace("-","");
        }
        if (n < 0) {
            // Check if the base is already a fraction
            if (base.indexOf("frac{") >= 0) {
                base + "^{" + n + "}";
            } else {
                return base + "^{" + n + "} = \\dfrac{1}{" + base + "^{" + Math.abs(n) + "}}";
            }
        } else {
            return base + "^{" + n + "}";
        }
    }  
    return base + "^{" + n + "}";
}

// Display exponent; no exponent printed if one
function dExp(e: number){
    if (e===1) {
        return "";
    } else {
        return "^{" + e + "}";
    }
};

@WsGenerator({
    category: "arithmetics/power/operations",
    description: "Reduce an operation of powers to a single power applying properties",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random bases are generated"
        }, 
        {
            name: "domain",
            defaults: "Z",
            description: "Type of coefficient number generated"
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
        },
        {
            name: "useSymbolicBases",
            defaults: false,
            description: "Whether to use numeric or symbolic bases"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "1 or 2"
        }  
    ]
})
export class PowerOperations implements QuestionGenInterface {
    
    question: string; 
    answer: string;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const minExp = qGenOpts.question.minExp || -4;        
        const maxExp = qGenOpts.question.maxExp || 4; 
        const complexity = qGenOpts.question.complexity || 1; 
        const domain = qGenOpts.question.domain || 'Z';
        const useSymbolicBases = qGenOpts.question.useSymbolicBases || false; 
         
        const condition = function (x) {
            return x!==0 && x!==1 && x!==-1;
        };

        let base: string;
        let base2: string;
        let base3: string;
        const f2 = rnd.intBetween(0, 3);
        const f3 = rnd.intBetween(0, 3);

        if (useSymbolicBases) {
            base = rnd.pickOne(BAR_NAMES);
            base2 = "\\left( " + base + "^{" + f2 + "}\\right)";
            base3 = "\\left( " + base + "^{" + f3 + "}\\right)";
        } else {
            let nbase = rnd.intBetween(-r, r, condition);
    
            if (nbase < 0) {
                base = "\\left(" + nbase + "\\right)";              
            } else {
                base = nbase + "";
            }
            base2 = "\\left( " + Math.pow(nbase, f2) + " \\right)";
            base3 = "\\left( " + Math.pow(nbase, f3) + " \\right)";
        }

        const coin = rnd.intBetween(0, 4);

        if (complexity < 2) {
            let [e1, e2, e3, e4, e5] = rnd.intList(5, minExp, maxExp);
            if (coin === 0) {
                this.question = base + dExp(e1) + " \\cdot " + base + dExp(e2) + "\\cdot " + base + dExp(e3) + " : " + base + dExp(e4);  
                this.answer =  displayPower( base, e1 + e2 + e3 - e4 );   
            } else if (coin === 1) {
                this.question =   "\\left[" + base + dExp(e2) + " \\right]" + dExp(e1) + " \\cdot " + base + dExp(e3) + " : " + base + dExp(e4);  
                this.answer =  displayPower( base, e1*e2 + e3 - e4 );
            } else if (coin === 2) {
                this.question =   "\\left[" + base + dExp(e1) + " : " + base + dExp(e2) + " \\right]" + dExp(e3) + " \\cdot " + base + dExp(e4);  
                this.answer =  displayPower( base, (e1-e2)*e3 + e4 );
            } else if (coin === 3) {
                this.question =   "\\dfrac{ \\left[ " + base + dExp(e1) + "\\right] " + dExp(e2) + " \\cdot "+ base + dExp(e3) + " : "+ base + dExp(e4) + "}{"+ base + dExp(e5) +"}";  
                this.answer =  displayPower( base, e1*e2 + e3 - e4 - e5 );
            } else if (coin === 4) {
                // The same exponent               
                const b1 = rnd.intBetween(2, r, condition);
                const b2 = rnd.intBetween(2, r, condition);
                const b3 = rnd.intBetween(2, r, condition);
                this.question =  "\\dfrac{ "+b1+"^{"+e1+"} \\cdot "+b2+"^{"+e1+"} }{"+ b3 + "^{" + e1 + "}}";  
                const baseOp = Numeric.fromNumber(b1).multiply(Numeric.fromNumber(b2)).divide(Numeric.fromNumber(b3)).toTeX();
                this.answer =  displayPower( baseOp, e1 );  // "\\left(" +  "\\right)"
            }
                         
        } else {
            // Use dissimilar bases which counts as a power of the original one
            let [e1, e2, e3, e4, e5] = rnd.intList(5, minExp, maxExp);
            if (coin === 0) {
                this.question = base + "^{" + e1 + "} \\cdot " + base2 + "^{" + e2 + "} \\cdot " + base + "^{" + e3 + "} : " + base3 + "^{" + e4 + "}";  
                this.answer =  displayPower( base, e1 + f2*e2 + e3 - e4*f3 );   
            } else if (coin === 1) {
                this.question =   "\\left(" + base2 + "^{" + e2 + "} \\right)^{" + e1 + "} \\cdot " + base + "^{" + e3 + "} : " + base3 + "^{" + e4 + "}";  
                this.answer =  displayPower( base, f2*e1*e2 + e3 - e4*f3 );
            } else if (coin === 2) {
                this.question =   "\\left[" + base + "^{" + e1 + "} : " + base2 + "^{" + e2 + "} \\right]^{" + e3 + "} \\cdot " + base3 + "^{" + e4 + "} ";  
                this.answer =  displayPower( base, (e1-e2*f2)*e3 + e4*f3);
            } else if (coin === 3) {
                this.question =   "\\dfrac{ \\left(" + base2 + "^{" + e1 + "}\\right)^{" + e2 + "} \\cdot "+ base3 + "^{" + e3 + "} : "+ base + "^{" + e4+ " }}{"+ base + "^{" + e5 + "}}";  
                this.answer =  displayPower( base, f2*e1*e2 + f3*e3 - e4 - e5 );
            } else if (coin === 4) {
                e3 = rnd.intBetween(2, maxExp);
                this.question =   "\\left[ \\dfrac{" + base  + "^{" + e1 +"}\\cdot " + base2 +"^{" + e1 + "}}{" + base3 + "^{" + e2 + "}} \\right]^{" + e3 + "}";  
                this.answer =  displayPower( base, e3*(e1 + f2*e1 - f3*e2) );
            }
                         
        }
        
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