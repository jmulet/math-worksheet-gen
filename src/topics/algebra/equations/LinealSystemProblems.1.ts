import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface';
import { Random } from '../../../util/Random';
import { WsGenerator } from '../../../util/WsGenerator';
import { Numeric } from '../../../math/Numeric';
import {PythagoreanTriples} from '../../../util/Util';

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
        
        let problem;
        //Nomes cridar una vegada aquesta funció, d'aquesta forma multiples cridadades resultara en duplicitat de problemes.
        if (dimension < 3) {
            // Problemes 3x3
            throw new Error("Problems 3x3 not implemented yet");

        } else {
            // Problemes 2x2
            const coin = rnd.intBetween(0, 5);

            if (coin === 0) {

                problem = {
                    tags: "system",
                    formulation: `Si es suma 7 al numerador i al denominador d'una determinada fracció, s'obté la fracció
                    $\\frac{2}{3}$. Si en lloc de sumar 7 es resta 3 al numerador i al denominador, s'obté la fracció
                    $\\frac{1}{4}$. Trobeu aquesta fracció.`,
                    answer: "La fracció és 5/11" 
                };
            } else if (coin === 1) {
                const guany = rnd.intBetween(1,20) / 10.;
                const perdua = rnd.intBetween(1,9) / 10.;
                const bones = rnd.intBetween(500, 2000);
                const dolentes = rnd.intBetween(500, 2000);
                const benefici = guany*bones - perdua*dolentes;
                let tipus;
                if (benefici >= 0) {
                    tipus = "un benefici";
                } else {
                    tipus = "unes pèrdues";
                }
                problem = {
                    tags: "system",
                    formulation: `Un fabricant de bombetes guanya ${guany.toFixed(2)} € per cada bombeta que surt de fàbrica, però
                    perd ${perdua.toFixed(2)} € per cada una defectuosa. Un determinat dia en què
                    va fabricar ${bones + dolentes} bombetes va obtenir ${tipus} de ${benefici} €. Quantes bombetes bones
                    va fabricar aquest dia?`,
                    answer: `Va fabricar ${bones} bombetes bones.`  
                };
            } else if (coin === 2) {
              
                problem = {
                    tags: "system",
                    formulation: `Un orfebre rep l'encàrrec de confeccionar un trofeu, en or i en plata, per a un
                    campionat esportiu. Una vegada realitzat, resulta un pes de 1.300 grams, i un cost de 2,840 €.
                    Quina quantitat ha utilitzat de cada preciós de metall, si l'or es ven 8 €/gram i la plata
                    per 1,7 €/gram?`,
                    answer: `${grOr} g d'or i ${grPlata} g de plata` 
                };
            } else if (coin === 3) {
                 
                problem = {
                    tags: "system",
                    formulation: `Determinau el perímetre d'un triangle equilàter sabent que té una àrea de ${area} cm$^2$.`,
                    answer: `El perímetre és ${perimetre} cm` 
                };
            } else if (coin === 4) {
                 
                problem = {
                    tags: "system",
                    formulation: `D'un panell metàl·lic que té forma de quadrat li retallam un cercle d'igual diàmetre. Sabent que l'àrea de la figura que en resulta és ${area}, trobau la mida del quadrat.`,
                    answer: `El costat mesura ${x} cm` 
                };
            } else if (coin === 5) {
                const delta = rnd.intBetween(3, r);                        
                const x = rnd.intBetween(3, 100);
                const y = x + delta;
                problem = {
                    tags: "system",
                    formulation: `Calcula les dimensions d'un rectangle, sabent que mesura ${delta} m més de llarg que d'ample i que el perímetre mesura ${perimetre} m.`,
                    answer: `Les dimensions són ${x} i ${y} m` 
                };
            }
        } 
 
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