import { WsGenerator } from '../../../util/WsGenerator';
import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Vector } from '../../../math/Vector';
import { Random } from '../../../util/Random';
import { Formatter } from '../../../util/Formatter';
import { ElementalFunction, ElementalFunctionInterface } from '../../../math/ElementalFunction';

@WsGenerator({
    category: "calculus/elemental/graph",
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
            name: "types",
            defaults: [0, 1],
            description: "List of type names of the desired types  Lineal: 0, Quadratic: 1, Radical: 2, Hyperbole: 3, Exponential: 4, Logarithm: 5, Trigonometric: 6 "
        }, 
    ]
})
export class ElementalFunctionGraph implements QuestionGenInterface {
  
    fun: ElementalFunctionInterface;
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        const domain = qGenOpts.question.domain || 'Z';
        const types = qGenOpts.question.types || [0, 1];
        
        this.fun = <ElementalFunctionInterface> rnd.elementalFunction(types, {range: r, domain: domain});
        
    }

    getFormulation(): string {        
        return "$y = " + this.fun.toTeX() + "$";
    }

    getAnswer(): string {        
        return "Correcció manual";
    }
 
    getDistractors(): string[] {
        return [];
    }
}