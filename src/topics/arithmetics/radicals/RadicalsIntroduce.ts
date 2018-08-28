import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Formatter } from '../../../util/Formatter';

const BAR_NAMES = [['x', 'y'], ['a', 'b']]; 

@WsGenerator({
    category: "arithmetics/radicals/introduce",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        }, 
        {
            name: "algebraic",
            defaults: false,
            description: "Whether to use algebraic notation or not"
        },          
        {
            name: "maxIndex",
            defaults: 5,
            description: "Max radical index"
        },
        {
            name: "complexity",
            defaults: 2,
            description: "1= One root; n= N roots sandwitched"
        },      
    ]
})
export class RadicalsIntroduce implements QuestionGenInterface {
    
    question: string;
    radicals: any[];
    answer: string;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const maxIndex = qGenOpts.question.maxIndex || 5;               
        const complexity = qGenOpts.question.complexity || 2;
        const algebraic = qGenOpts.question.algebraic || false;
        const MyBAR_NAMES = rnd.pickOne(BAR_NAMES);
                
        if (complexity < 2) {
            let a, b;
            const ind1 = rnd.intBetween(2, 5); 
            const ea = rnd.intBetween(1, 5);
            const eb = rnd.intBetween(1, 5); 

            if (algebraic) {
                a = rnd.pickOne(MyBAR_NAMES);
                b = rnd.pickOne(MyBAR_NAMES); 
            } else {
                a = rnd.intBetween(2, 4);
                b = rnd.intBetween(2, 4); 
            } 
            let exponentA, exponentB, exponentC;
            exponentA = ind1*ea;
            exponentB = 0; 
            if (b === a) {
                exponentA += ind1*ea;
            } else {
                exponentB = eb; 
            } 
            this.question = Formatter.displayPower(a, ea) + Formatter.displayRoot(ind1, Formatter.displayPower(b, eb) );
            this.answer = Formatter.displayRoot(ind1, Formatter.displayPower(a, exponentA)+ "\\, " + Formatter.displayPower(b, exponentB));
        } else if (complexity >= 2) {
            let a, b, c;
            const ind1 = rnd.intBetween(2, 5);
            const ind2 = rnd.intBetween(2, 5);
            const ea = rnd.intBetween(0, 5);
            const eb = rnd.intBetween(1, 5);
            const ec = rnd.intBetween(1, 5);

            if (algebraic) {
                a = rnd.pickOne(MyBAR_NAMES);
                b = rnd.pickOne(MyBAR_NAMES);
                c = rnd.pickOne(MyBAR_NAMES);
            } else {
                a = rnd.intBetween(2, 4);
                b = rnd.intBetween(2, 4);
                c = rnd.intBetween(2, 5);
            } 
            let exponentA, exponentB, exponentC;
            exponentA = ind1*ind2*ea;
            exponentB = 0;
            exponentC = 0;
            if (b === a) {
                exponentA += ind1*ind2*ea;
                if (c === a) {
                    exponentA += ec;
                } else {
                    exponentC = ec;
                }
            } else {
                exponentB = ind2*eb;
                if (c === a) {
                    exponentA += ec;
                } else if (c === b) {
                    exponentB += ec;
                } else {
                    exponentC = ec;
                }
            }
            const index = ind1*ind2;

            this.question = Formatter.displayPower(a, ea) + Formatter.displayRoot(ind1, Formatter.displayPower(b, eb) + " " +
                 Formatter.displayRoot(ind2, Formatter.displayPower(c, ec) ));
            this.answer = Formatter.displayRoot(index, Formatter.displayPower(a, exponentA)+ "\\, " +
                 Formatter.displayPower(b, exponentB)+ "\\, " + Formatter.displayPower(c, exponentC));
        }  
    }

    async getFormulation(): Promise<string> {        
       return "$" + this.question + " = {}$";
    }

    async getAnswer(): Promise<string> {
        return "$" + this.answer + "$";
    }

}