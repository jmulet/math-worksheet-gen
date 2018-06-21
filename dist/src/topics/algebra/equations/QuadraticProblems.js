"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const Random_1 = require("../../../util/Random");
const WsGenerator_1 = require("../../../util/WsGenerator");
const Numeric_1 = require("../../../math/Numeric");
const Util_1 = require("../../../util/Util");
const VARNAMES = ["x", "y", "z", "t", "w"];
const solve2ndDegreeEqn = function (a, b, c, condition) {
    const disc = b * b - 4 * a * c;
    if (disc >= 0) {
        const disc2 = Math.sqrt(disc);
        if (Math.floor(disc2) === disc2) {
            // We can provide fractional answers
            return [Numeric_1.Numeric.fromFraction((-b + disc2), 2 * a), Numeric_1.Numeric.fromFraction((-b - disc2), 2 * a)];
        }
        else {
            // We must provide decimal answers 
            return [(-b + disc2) / (2 * a), (-b - disc2) / (2 * a)];
        }
    }
    else {
        return [];
    }
};
// Only call this generator once
let QuadraticProblems = class QuadraticProblems {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        let dimension = qGenOpts.question.dimension || 2;
        const uniqueQuestionsMap = qGenOpts.question.uniqueQuestionsMap || {};
        let forbiddenIdentifiers = uniqueQuestionsMap["algebra/equations/quadraticproblems"];
        if (!forbiddenIdentifiers) {
            forbiddenIdentifiers = [];
            uniqueQuestionsMap["algebra/equations/quadraticproblems"] = forbiddenIdentifiers;
        }
        let problem;
        //Nomes cridar una vegada aquesta funció, d'aquesta forma multiples cridadades resultara en duplicitat de problemes.
        const maxLen = 5;
        let coin = rnd.intBetween(0, maxLen);
        if (forbiddenIdentifiers.length && forbiddenIdentifiers.length < maxLen) {
            while (forbiddenIdentifiers.indexOf(coin) >= 0) {
                coin = rnd.intBetween(0, maxLen);
            }
        }
        forbiddenIdentifiers.push(coin);
        if (coin === 0) {
            const mult = rnd.intBetween(1, r);
            const x = rnd.intBetween(10, 50);
            const units = x * x - mult * x;
            problem = {
                tags: "quadratic",
                formulation: `Quina és l'edat d'una persona si en multiplicar-la per ${mult} li falten ${units} unitats per completar el seu quadrat?`,
                answer: x + " anys"
            };
        }
        else if (coin === 1) {
            const factor = rnd.intBetween(2, r);
            const [a, b, c] = rnd.pickOne(Util_1.PythagoreanTriples);
            const sides = [factor * a, factor * b, factor * c];
            const hipotenusa = Math.max(...sides);
            const area = sides.filter(e => e !== hipotenusa).reduce((pv, nv) => pv * nv) / 2;
            problem = {
                tags: "quadratic",
                formulation: `Els tres costats d'un triangle rectangle són proporcionals als números ${a}, ${b}, ${c}. Calcula la longitud de cada costat sabent que l'àrea del triangle és ${area} m$^2$.`,
                answer: "Costats " + sides.join(" m, ")
            };
        }
        else if (coin === 2) {
            const x = rnd.intBetween(5, r);
            const y = rnd.intBetween(5, r);
            const area = x * y;
            const perimetre = 2 * (x + y);
            problem = {
                tags: "quadratic",
                formulation: `Per tancar una finca rectangular de ${area} m$^2$ d'àrea, s'han utilitzat ${perimetre} m de tanca. Calcula les dimensions de la finca.`,
                answer: `Les mides són ${x}, ${y} m`
            };
        }
        else if (coin === 3) {
            const area = rnd.intBetween(25, 800);
            const perimetre = (6 * Math.sqrt(area / Math.sqrt(3))).toFixed(2);
            problem = {
                tags: "quadratic,area",
                formulation: `Determinau el perímetre d'un triangle equilàter sabent que té una àrea de ${area} cm$^2$.`,
                answer: `El perímetre és ${perimetre} cm`
            };
        }
        else if (coin === 4) {
            const area = rnd.intBetween(25, 800);
            const x = (Math.sqrt(area / (4 - Math.PI))).toFixed(2);
            problem = {
                tags: "quadratic,area",
                formulation: `D'un panell metàl·lic que té forma de quadrat li retallam un cercle d'igual diàmetre. Sabent que l'àrea de la figura que en resulta és ${area}, trobau la mida del quadrat.`,
                answer: `El costat mesura ${x} cm`
            };
        }
        else if (coin === 5) {
            const x = rnd.intBetween(3, 150);
            const sumen = x * x + (x + 1) * (x + 1) + (x + 2) * (x + 2);
            problem = {
                tags: "quadratic",
                formulation: `Troba tres nombres consecutius tals que la suma dels seus quadrats sigui ${sumen}.`,
                answer: `Els nombres són ${x}, ${x + 1}, ${x + 2}`
            };
        }
        this.question = problem.formulation;
        this.answer = problem.answer;
    }
    getFormulation() {
        return this.question;
    }
    getAnswer() {
        return this.answer;
    }
    getDistractors() {
        return [];
    }
};
QuadraticProblems = __decorate([
    WsGenerator_1.WsGenerator({
        category: "algebra/equations/quadraticproblems",
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
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], QuadraticProblems);
exports.QuadraticProblems = QuadraticProblems;
//# sourceMappingURL=QuadraticProblems.js.map