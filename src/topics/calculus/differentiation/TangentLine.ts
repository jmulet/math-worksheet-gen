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
            name: "range",
            defaults: 10,
            description: "Range in which x=a is taken"
        }, 
        {
            name: "domain",
            defaults: 'Z',
            description: "Number domain"
        }, 
        {
            name: "askNormal",
            defaults: false,
            description: "Whether to ask also for normal instead of tangent line"
        }, 
        {
            name: "types",
            defaults: [0, 1, 2],
            description: "List of function types  Polynomical: 0, Rational: 1, Irrational: 2, Exponential: 3, Logarithm: 4, Trigonometric: 5"
        }, 
    ]
})
export class TangentLine implements QuestionGenInterface {
  
    fun: ElementalFunctionInterface;
    answer: string;
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const interval = qGenOpts.question.interval || 10;
        const range = qGenOpts.question.range || 10;
        const domain = qGenOpts.question.domain || 'Z';
        const askNormal = qGenOpts.question.askNormal || false;
        const types = qGenOpts.question.types || [0, 1, 2];
        
        
        this.fun = <ElementalFunctionInterface> rnd.elementalFunction(types, {range: interval, domain: domain});
        const a = rnd.intBetween(-range, range);
        // Must check that a is within the domain of the function!
        
        this.answer = Giac.evaluate('latex(equation(LineTan('+this.fun.toString()+','+ a +')))').replace("(", "").replace(")", "");
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