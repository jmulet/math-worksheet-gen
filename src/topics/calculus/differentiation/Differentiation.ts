
import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { ElementalFunctionInterface } from '../../../math/ElementalFunction';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Giac } from '../../../math/Giac';

@WsGenerator({
    category: "calculus/differentiation/tangentline",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },  
        {
            name: "domain",
            defaults: 'Z',
            description: "Number domain"
        }, 
        {
            name: "degree",
            defaults: 1,
            description: "Degree of de derivative"
        }, 
        {
            name: "types",
            defaults: [0, 1, 2],
            description: "List of function types  Polynomical: 0, Rational: 1, Irrational: 2, Exponential: 3, Logarithm: 4, Trigonometric: 5"
        }, 
    ]
})
export class Differentiation implements QuestionGenInterface {
  
    fun: ElementalFunctionInterface;
    answer: string;
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const interval = qGenOpts.question.interval || 10; 
        const domain = qGenOpts.question.domain || 'Z';
        const degree = qGenOpts.question.degree || 1;
        const types = qGenOpts.question.types || [0, 1, 2];
        
        this.fun = <ElementalFunctionInterface> rnd.elementalFunction(types, {range: interval, domain: domain});
        
        // Must check that a is within the domain of the function!        
        this.answer = Giac.evaluate('latex(normal(simplify(diff(' + this.fun.toString() + ',x$' + degree + '))))').replace(/"/g, "");
    }

    getFormulation(): string {        
        return "$y = " + this.fun.toTeX() + "$";
    }

    getAnswer(): string {        
        return "$" + this.answer + "$";
    }
 
    getDistractors(): string[] {
        return [];
    }
}