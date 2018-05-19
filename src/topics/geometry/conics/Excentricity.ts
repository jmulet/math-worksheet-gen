import { WsGenerator } from '../../../util/WsGenerator';
import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Vector } from '../../../math/Vector';
import { Random } from '../../../util/Random';
import { Formatter } from '../../../util/Formatter';
import { Conics, Circumference } from '../../../math/Conics';

@WsGenerator({
    category: "geometry/conics/excentricity",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        } 
    ]
})
export class Excentricity implements QuestionGenInterface {
    
    conica: Conics;
    e: number;
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        this.conica = rnd.conic({range: r});
        this.e = this.conica.excentricity();
    }

    getFormulation(): string {        
        return "\\( " + this.conica.toTeX() + " \\)";
    }

    getAnswer(): string {        
        return this.e.toFixed(3);
    }

    getDistractors(): string[] {
        let distractors = [0, 1, this.conica.a / this.conica.b, this.conica.c/this.conica.b, Math.random(), 1+Math.random(), 1/this.e];
        distractors = distractors.filter( (v, i) => {
            if (v === this.e) {
                return false;
            }
            if(distractors.indexOf(v) !== i) {
                return false;
            }
            return true;
        });
        // Filter all different distractors
        return distractors.map( d => d.toFixed(3)).slice(0, Math.min(3, distractors.length));
    }
}