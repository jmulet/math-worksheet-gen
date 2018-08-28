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
        const dimension = qGenOpts.question.dimension || 2; 
        const uniqueQuestionsMap = qGenOpts.question.uniqueQuestionsMap || {};
        let forbiddenIdentifiers = uniqueQuestionsMap["algebra/system/linealproblems"];
        if (!forbiddenIdentifiers) {
            forbiddenIdentifiers = [];
            uniqueQuestionsMap["algebra/system/linealproblems"] = forbiddenIdentifiers;
        }  
        
        let problem;

        //Nomes cridar una vegada aquesta funció, d'aquesta forma multiples cridadades resultara en duplicitat de problemes.
        //S'ha arreglat mitjnaçant el mapa uniqueQuestionsMap["algebra/system/linealproblems"]
        if (dimension > 2) {
            // Problemes 3x3
            const maxLen = 5;
            let coin = rnd.intBetween(0, maxLen);
            
            if (forbiddenIdentifiers.length && forbiddenIdentifiers.length < maxLen) {
                while (forbiddenIdentifiers.indexOf(coin) >=0 ) {
                    coin = rnd.intBetween(0, maxLen);
                }
            }
            forbiddenIdentifiers.push(coin);

            throw new Error("Problems 3x3 not implemented yet");
          

        } else {
            // Problemes 2x2
            const maxLen = 5;
            let coin = rnd.intBetween(0, maxLen);
            
            if (forbiddenIdentifiers.length && forbiddenIdentifiers.length < maxLen) {
                while (forbiddenIdentifiers.indexOf(coin) >=0 ) {
                    coin = rnd.intBetween(0, maxLen);
                }
            } 
            forbiddenIdentifiers.push(coin);

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
                    va fabricar ${bones + dolentes} bombetes va obtenir ${tipus} de ${benefici.toFixed(2)} €. Quantes bombetes bones
                    va fabricar aquest dia?`,
                    answer: `Va fabricar ${bones} bombetes bones.`  
                };
            } else if (coin === 2) {
                const grOr = rnd.intBetween(20, 140)*10;
                const grPlata = rnd.intBetween(20, 140)*10;
                const euroOr = rnd.intBetween(50, 100)/10;
                const euroPlata = rnd.intBetween(2, 49)/10;
                const despesa = euroOr*grOr + euroPlata*grPlata;
                problem = {
                    tags: "system",
                    formulation: `Un orfebre rep l'encàrrec de confeccionar un trofeu, en or i en plata, per a un
                    campionat esportiu. Una vegada realitzat, resulta un pes de ${grOr + grPlata} grams, i un cost de ${despesa} €.
                    Quina quantitat ha utilitzat de cada preciós de metall, si l'or es ven ${euroOr.toFixed(2)} €/gram i la plata
                    per ${euroPlata.toFixed(2)} €/gram?`,
                    answer: `${grOr} g d'or i ${grPlata} g de plata` 
                };
            } else if (coin === 3) {
                const alpha = rnd.intBetween(2, 10); 
                problem = {
                    tags: "system",
                    formulation: ` Un pastor diu a un altre pastor: Dóna’m ${alpha} ovelles, i així en tindré el doble que tu. I
                    l’altre li contesta: Dóna-me’n tú ${alpha} ovelles, i així en tindrem tots dos igual. Quantes ovelles
                    té cada pastor?`,
                    answer: `El primer té ${7*alpha} i el segon ${5*alpha} ovelles.` 
                };
            } else if (coin === 4) {
                const x = rnd.intBetween(20, 100);                 
                const y = rnd.intBetween(2, 19);
                const result = x/(1.0*y);
                const quotient = Math.floor(result);
                const remainder = x - quotient*y;
                problem = {
                    tags: "system",
                    formulation: `En dividir un nombre entre un altre el quocient és ${quotient} i el residu és ${remainder}. 
                    Si la diferència entre el dividend i el divisor és ${x-y}, quins són aquests nombres? (Recorda: $D = d\\cdot q + R$)`,
                    answer: `Els nombres són ${x} i ${y}` 
                };
            } else if (coin === 5) {
                const x = rnd.intBetween(6, 50);
                const y = rnd.intBetween(6, 50);
                const dx1 = rnd.intBetween(1, 5);
                const dx2 = rnd.intBetween(1, 5);
                const dy1 = rnd.intBetween(1, 5);
                const dy2 = rnd.intBetween(1, 5);
                const dA1 = (x+dx1)*(y+dy1) - x*y;
                const dA2 = (x+dx2)*(y+dy2) - x*y;
                const case1 = dA1>0? "augmenta" : "disminueix";
                const case2 = dA2>0? "augmenta" : "disminueix";
                problem = {
                    tags: "system",
                    formulation: `Si la llargària d’un rectangle s’augmenta ${dx1} centímetres i l’amplària ${dy1} centímetres, l’àrea ${case1} ${dA1}
                    centímetres quadrats. Si, en canvi, la llargària s’augmenta ${dx2} centímetre i l’amplària ${dy2} centímetres, l’àrea
                    ${case2} ${dA2} centímetres quadrats. Calcula la llargària i l’amplària del rectangle.`,
                    answer: `Les dimensions són ${x} i ${y} cm` 
                };
            }
        } 
        this.question = problem.formulation;
        this.answer = problem.answer;
    }

    async getFormulation(): Promise<string> {
        return  this.question ;
    }

    async getAnswer(): Promise<string> {
        return  this.answer;
    }
 
} 