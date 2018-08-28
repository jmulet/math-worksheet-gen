import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Equation } from '../../../math/Equation';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';

@WsGenerator({
    category: "algebra/equations/rational",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "Complexity; number of indeterminates. From 1-2"
        }       
    ]
})
export class EquationsRational implements QuestionGenInterface {

   
    answer: string;
    question: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        let complexity = qGenOpts.question.complexity || 1;
      
        const eqn = new Equation(rnd);    
        eqn.rational(r, complexity);
         
        this.question = eqn.toTeX();
        this.answer = eqn.solutionsTeX();
    }

    async getFormulation(): Promise<string> {
        return "$" + this.question + "$";
    }

    async getAnswer(): Promise<string> {
        return this.answer;
    }

}