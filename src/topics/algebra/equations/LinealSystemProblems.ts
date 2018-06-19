import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Numeric } from '../../../math/Numeric';

const VARNAMES = ["x", "y", "z", "t", "w"];

const solve2ndDegreeEqn = function(a: number, b: number, c: number, condition?: Function) {
    const disc = b*b - 4*a*c;
    if (disc >= 0) {
        const disc2 = Math.sqrt(disc);
        if ( Math.floor(disc2) === disc2 ) {
            // We can provide fractional answers
            return [Numeric.fromFraction((-b + disc2), 2*a), Numeric.fromFraction((-b - disc2), 2*a)];
        }  else {
            // We must provide decimal answers 
            return [(-b + disc2)/(2*a), (-b - disc2)/(2*a)];
        }
    } else {
        return [];
    }
};

// Only call this generator once
@WsGenerator({
    category: "algebra/system/linealproblems",
    parameters: [
        {
            name: "interval",
            defaults: 10,
            description: "Range in which random coefficients are generated"
        },
        {
            name: "complexity",
            defaults: 1,
            description: "Complexity; From 1-2"
        },
        {
            name: "dimension",
            defaults: 2,
            description: "From 2 to 3"
        }  
    ]
})
export class EquationsLinealSystem implements QuestionGenInterface {
 
    answer: string;
    question: any;
   
    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd: Random = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        let dimension = qGenOpts.question.dimension || 2; 
        
        const database = [];


        //Nomes cridar una vegada aquesta funció, d'aquesta forma multiples cridadades resultara en duplicitat de problemes.
        if (dimension < 3) {
            // Problemes 3x3
            console.log("Not implemented")
        } else {
            const mult = rnd.intBetween(1, r);
            const x = rnd.intBetween(10, 50);
            const units = x*x - mult*x;
            const a = 1,
            const b = -mult;
            const c = -units;
            
            const answer = solve2ndDegreeEqn(a, b, c);
            // Problemes 2x2
            database.push({
                tags: "quadratic",
                formulation: `Quina és l'edat d'una persona si en multiplicar-la per ${mult} li falten ${units} per completar el seu quadrat?`,
                answer: answer + " anys" 
            });
        }

        const choosen = rnd.pickOne(database)
 
        this.question = choosen.formulation;
        this.answer = choosen.answer;
    }

    getFormulation(): string {
        return "$" + this.question + "$";
    }

    getAnswer(): string {
        return "$ \\left(" + this.answer + " \\right)$" ;
    }

    getDistractors(): string[] {
        return [];
    }
}
*/