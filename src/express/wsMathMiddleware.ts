import * as express from "express";
import { WsMathGenerator, WsExportFormats } from "../worksheet/WsMathGenerator";
import { latexToPdf } from '../util/latexToPdf';
import { Stream } from "stream";
import { Response } from "express-serve-static-core";
import { MysqlStorage } from "./MsqlStorage";
import { Storage } from "./Storage";
import { Container } from "../util/WsGenerator";
import * as httpRequest from 'request';

export interface wsMathMdwOptions {
    basePrefix: string;
    storage: Storage;
}

function generateMoodleSample() {
    var body = {

        worksheet: {
            includeKeys: true,
            title: "Moodle test",
            sections: [
                {
                    name: "Coniques", activities: [
                        {
                            formulation: "Calcula l'excentricitat",
                            questions: [
                                { gen: "geometry/conics/excentricity", repeat: 6, options: { interval: 5 } }
                            ]
                        } 
                    ]
                }
            ]
        }
    };
    
    return body;
};


function generateSample4ESO() {
    var body = {

        worksheet: {
            includeKeys: true,
            title: "Feina recomanada pels alumnes que han de cursar Matemàtiques Acadèmiques a 4t d'ESO",
            instructions: "Realitzeu aquesta tasca en el quadern de l'assignatura del proper curs i entregeu-la al professor que tingueu. Aquesta feina serà valorada com a nota de la 1a avaluació.",
            sections: [
                {
                    name: "Radicals", activities: [
                        {
                            formulation: "Escriu les potències en forma d'arrel i viceversa",
                            questions: [
                                { gen: "arithmetics/radicals/notation", repeat: 6, options: { maxIndex: 5 } }
                            ]
                        },
                        {
                            formulation: "Calcula el valor numèric de les potències",
                            questions: [
                                { gen: "arithmetics/power/value", repeat: 8, options: {} }
                            ]
                        },
                        {
                            formulation: "Redueix a una única potència",
                            questions: [
                                { gen: "arithmetics/power/operations", repeat: 4, options: {complexity: 1} },
                                { gen: "arithmetics/power/operations", repeat: 4, options: {complexity: 2} }
                            ]
                        },
                        {
                            formulation: "Treu factors i simplifica els radicals si és possible",
                            questions: [
                                { gen: "arithmetics/radicals/simplify", repeat: 4, options: { maxIndex: 5 } }
                            ]
                        },
                        {
                            formulation: `Això és un recordatori de com s'ha de fer $\\\\sqrt{6}{x}=x^{1/6}$`,
                            questions: []
                        },
                        {
                            formulation: "Opera els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: {} },
                                { gen: "arithmetics/radicals/operations", repeat: 2, options: { algebraic: true } }
                            ]
                        },
                        {
                            formulation: "Simplifica els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/gather", repeat: 2, options: { maxIndex: 2 } },
                                { gen: "arithmetics/radicals/gather", repeat: 2, options: { domain: 'Q' } }
                            ]
                        },
                        {
                            formulation: "Racionalitza els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/rationalize", repeat: 2, options: {} },
                                { gen: "arithmetics/radicals/rationalize", repeat: 2, options: { conjugate: true } }
                            ]
                        }
                    ]
                },
                {
                    name: "Polinomis", activities: [
                        {
                            formulation: "Divideix aquests polinomis utilitzant la regla de Ruffini", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { ruffini: true } }
                            ]
                        },
                        {
                            formulation: "Divideix els polinomis", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { fraction: false, maxDegree: 4, interval: 5 } }
                            ]
                        },
                        {
                            formulation: "Expandeix les identitats notables.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 2 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3 } }
                            ]
                        },
                        {
                            formulation: "Escriu, si és possible, aquests polinomis com una identitat notable.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1, indirect: true } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3, indirect: true } }
                            ]
                        },
                        {
                            formulation: "Extreu factor comú dels polinomis", questions: [
                                { gen: "algebra/polynomial/commonfactor", repeat: 3, options: { interval: 5, complexity: 1 } }
                            ]
                        },
                        {
                            formulation: "Factoritza els polinomis", questions: [
                                { gen: "algebra/polynomial/factorize", repeat: 4, options: { interval: 5, complexity: 0, maxDegree: 3, allowFractions: false } },
                                { gen: "algebra/polynomial/factorize", repeat: 4, options: { interval: 5, complexity: 1, maxDegree: 3, allowFractions: true } }
                            ]
                        },
                        {
                            formulation: "Simplifica les fraccions algebraiques", questions: [
                                { gen: "algebra/fractions/simplify", repeat: 4, options: { interval: 5, maxDegree: 3 } }
                            ]
                        }
                    ]
                },
                {
                    name: "Equacions", activities: [                        
                        {
                            formulation: "Resol aquestes equacions de segon grau", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, maxDegree:2, minDegree: 2 } },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, maxDegree:2, minDegree: 2 } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions biquadrades", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, specialType: 'biquadratic' } },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, specialType: 'biquadratic' } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions factoritzades", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 4, options: { interval: 5, complexity: 0, specialType: 'factorizable', minDegree: 2, maxDegree: 5 } } 
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions polinòmiques", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, minDegree: 3, maxDegree: 4} },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, minDegree: 3, maxDegree: 5} } 
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions racionals", questions: [
                                { gen: "algebra/equations/rational", repeat: 2, options: { interval: 5, complexity: 1 } },
                                { gen: "algebra/equations/rational", repeat: 2, options: { interval: 5, complexity: 2 } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions irracionals", questions: [
                                { gen: "algebra/equations/irrational", repeat: 2, options: { interval: 10, complexity: 1} },
                                { gen: "algebra/equations/irrational", repeat: 4, options: { interval: 10, complexity: 2} } 
                            ]
                        },
                        {
                            formulation: "Resol aquestes sistemes d'equacions", questions: [
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 10, dimension: 2, nequations: 2} },
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 5, dimension: 3, nequations: 3, allowIncompatible: true, allowIndeterminate: true} },
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 5, dimension: 3, nequations: 2} },
                                { gen: "algebra/system/nonlinear", repeat: 2, options: { interval: 10, complexity: 1} },
                                { gen: "algebra/system/nonlinear", repeat: 2, options: { interval: 10, complexity: 2} }    
                            ]
                        },
                        {
                            formulation: "En Miquel té ${a} euros i na Maria ${b} euros.", scope: {a: "rnd.decimal(10,40,2)", b: "rnd.decimal(10,40,2)"}, questions: [
                                { gen: "special/computed", repeat: 1, options: { 
                                    qFormulation: "Quants d'euros tenen en total?",
                                    qAnswer: "${(a+b).toFixed(2)} euros"
                                 } },
                                 { gen: "special/computed", repeat: 1, options: { 
                                    qFormulation: "Quants d'euros de diferència?",
                                    qAnswer: "${Math.abs(a-b).toFixed(2)} euros"
                                 } }  
                            ]
                        }
                    ]
                },
                {
                    name: "Logaritmes", activities: [
                        {
                            formulation: "Utilitza la definició de logaritme  per calcular el valor de de $x$ en les equacions següents", questions: [
                                { gen: "arithmetics/logarithm/definition", repeat: 6, options: { interval: 5 } }
                            ]
                        }
                    ]
                },
                {
                    name: "Funcions", activities: [
                        {
                            formulation: "Representa aquestes funcions lineals", questions: [
                                { gen: "calculus/elemental/graph", repeat: 4, options: { interval: 10, domain: 'Q', types: [0] } }
                            ]
                        },
                        {
                            formulation: "Calcula el vèrtex i representa aquestes paràboles", questions: [
                                { gen: "calculus/elemental/graph", repeat: 4, options: { interval: 10, types: [1] } }
                            ]
                        },
                        {
                            formulation: "Representa aquestes funcions elementals i calcula el seu domini", questions: [
                                { gen: "calculus/elemental/graph", repeat: 6, options: { interval: 10, types: [0, 1, 2, 3, 4, 5] } }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    return body;
}


function generateSample1BAT() {
    var body = {

        worksheet: {
            includeKeys: true,
            title: "Feina recomanada pels alumnes que han de cursar Matemàtiques a 1r de Batxillerat",
            instructions: `INSTRUCCIONS: Realitzau en un quadern ( pot ser el mateix que faceu servir per l'assignatura del proper curs ) les activitats proposades en aquest dossier. Aquesta feina es presentarà al professor del proper curs dins la primera setmana de classe. La realització correcta d'aquesta tasca serà valorada com a nota de la 1a avaluació. \\n AJUDA: Si necessitau ajuda podeu consultar els apunts o el llibre de 4t d'ESO Matemàtiques Acadèmiques i els recursos penjats a l'entorn Moodle del nostre centre.`,
            sections:  [
                {
                    name: "Radicals", activities: [
                        {
                            formulation: "Introdueix tots els factors dins l'arrel més interna i expressa com un sol radical:",
                            questions: [
                                { gen: "arithmetics/radicals/introduce", repeat: 2, options: { complexity: 1} },
                                { gen: "arithmetics/radicals/introduce", repeat: 2, options: { complexity: 2, algebraic: false } },
                                { gen: "arithmetics/radicals/introduce", repeat: 2, options: { complexity: 2, algebraic: true } }
                            ]
                        },
                        {
                            formulation: "Utilitza les propietats per expressar com un únic radical:",
                            questions: [
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: {} },
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: { algebraic: true } }
                            ]
                        },
                        {
                            formulation: "Treu factors i simplifica els radicals si és possible",
                            questions: [
                                { gen: "arithmetics/radicals/simplify", repeat: 8, options: { maxIndex: 8 } }
                            ]
                        }, 
                        {
                            formulation: "Simplifica els radicals (Recorda primer a descomposar els radicands i treure factors)",
                            questions: [
                                { gen: "arithmetics/radicals/gather", repeat: 3, options: { maxIndex: 2 } },
                                { gen: "arithmetics/radicals/gather", repeat: 3, options: { domain: 'Q' } }
                            ]
                        },
                        {
                            formulation: "Racionalitza els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/rationalize", repeat: 3, options: {} },
                                { gen: "arithmetics/radicals/rationalize", repeat: 3, options: { conjugate: true } }
                            ]
                        },
                        {
                            formulation: "Opera, racionalitza i simplifica",
                            questions: [ 
                                { gen: "arithmetics/radicals/operations", repeat: 6, options: {miscellania: true} },
                            ]
                        }
                    ]
                },
                {
                    name: "Polinomis", activities: [
                        {
                            formulation: "Divideix aquests polinomis utilitzant la regla de Ruffini", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { ruffini: true } }
                            ]
                        },
                        {
                            formulation: "Divideix els polinomis", questions: [
                                { gen: "algebra/polynomial/division", repeat: 5, options: { fraction: false, maxDegree: 4, interval: 5 } }
                            ]
                        },
                        {
                            formulation: "Expandeix les identitats notables.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 4, options: { interval: 5, complexity: 3 } }
                            ]
                        },
                        {
                            formulation: "Escriu, si és possible, aquests polinomis com una identitat notable.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 4, options: { interval: 5, complexity: 1, indirect: true } }                                
                            ]
                        }, 
                        {
                            formulation: "Factoritza els polinomis. Ajuda't traient factor comú i identificant possibles identitats notables", questions: [
                                { gen: "algebra/polynomial/factorize", repeat: 8, options: { interval: 5, complexity: 0, maxDegree: 3, allowFractions: false } }
                            ]
                        },
                        {
                            formulation: "Factoritza els polinomis fent servir la regla de Ruffini. (Pensa a treure factor comú quan sigui necessari)", questions: [
                                { gen: "algebra/polynomial/factorize", repeat: 8, options: { interval: 5, complexity: 1, maxDegree: 4, allowFractions: true } }
                            ]
                        }
                    ]
                },
                {
                    name: "Fraccions algebraiques", activities: [                      
                        {
                            formulation: "Recorda que per simplificar una fracció algebraica, el primer que feim és factoritzar el numerador i el denominador i després tatxam factors repetits", questions: []
                        },         
                        {
                            formulation: "Simplifica les fraccions algebraiques", questions: [
                                { gen: "algebra/fractions/simplify", repeat: 4, options: { interval: 5, maxDegree: 3 } }
                            ]
                        },
                        {
                            formulation: "Opera i simplifica les fraccions algebraiques", questions: [
                            
                            ]
                        },
                        {
                            formulation: "Efectua les operacions amb fraccions algebraiques", questions: [
                            
                            ]
                        },
    
                        {
                            formulation: "Efectua les operacions amb fraccions algebraiques", questions: [
                            
                            ]
                        }
                    ],
                    
                },
                {
                    name: "Equacions i sistemes", activities: [                                         
                        {
                            formulation: "Resol aquestes equacions polinòmiques (treu factor comú i factoritza el polinomi)", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, minDegree: 3, maxDegree: 4} },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, minDegree: 3, maxDegree: 5} } 
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions racionals", questions: [
                                { gen: "algebra/equations/rational", repeat: 2, options: { interval: 5, complexity: 1 } },
                                { gen: "algebra/equations/rational", repeat: 2, options: { interval: 5, complexity: 2 } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions irracionals", questions: [
                                { gen: "algebra/equations/irrational", repeat: 2, options: { interval: 10, complexity: 1} },
                                { gen: "algebra/equations/irrational", repeat: 4, options: { interval: 10, complexity: 2} } 
                            ]
                        },
                        {
                            formulation: "Resol aquestes sistemes d'equacions lineals", questions: [
                                { gen: "algebra/system/lineal", repeat: 4, options: { interval: 10, dimension: 2, nequations: 2} }               
                            ]
                        },
                        {
                            formulation: "Resol aquestes sistemes d'equacions no lineals", questions: [
                                { gen: "algebra/system/nonlinear", repeat: 3, options: { interval: 10, complexity: 1} },
                                { gen: "algebra/system/nonlinear", repeat: 3, options: { interval: 10, complexity: 2} }                
                            ]
                        } 
                    ]
                },
                {
                    name: "Funcions i Logaritmes", activities: [
                        {
                            formulation: "Recorda que el logaritme en base $b$ compleix que  $\\\\log_b a = x$  si  $b^x = a$"
                        },
                        {
                            formulation: "Utilitza la definició de logaritme per calcular el valor de de $x$ en les equacions següents", questions: [
                                { gen: "arithmetics/logarithm/definition", repeat: 6, options: { interval: 5 } }
                            ]
                        },                                            
                        {
                            formulation: "Calcula el vèrtex i representa aquestes paràboles", questions: [
                                { gen: "calculus/elemental/graph", repeat: 4, options: { interval: 10, types: [1] } }
                            ]
                        },
                        {
                            formulation: "Representa aquestes funcions elementals i calcula el seu domini", questions: [
                                { gen: "calculus/elemental/graph", repeat: 6, options: { interval: 10, types: [0, 1, 2, 3, 4, 5] } }
                            ]
                        },
                        {
                            formulation: "RESOLUCIÓ GRÀFICA D'UN SISTEMA D'EQUACIONS: Per resoldre un sistema gràficament aïllam la variable $y$ de cadascuna de les equacions. Feim una taula de valors i representam les dues funcions obtingudes. Els punts de tall entre les dues corbes són les solucions del sistema. Fixat quantes solucions obtens.", questions: []
                        },
                        {
                            formulation: "Resol aquests sistemes gràficament", questions: [ 
                            ]
                        }
                    ]
                }
            ]
        }
    };

    return body;
}




function generateSample2BAT() {
    var body = {

        worksheet: {
            includeKeys: true,
            title: "Feina recomanada pels alumnes que han de cursar MAT-II a 2n de Batxillerat",
            instructions: "Realitzeu aquesta tasca en el quadern de l'assignatura del proper curs i entregeu-la al professor que tingueu. Aquesta feina serà valorada com a nota de la 1a avaluació.",
            sections: [
                {
                    name: "Radicals", activities: [
                        {
                            formulation: "Escriu les potències en forma d'arrel i viceversa",
                            questions: [
                                { gen: "arithmetics/radicals/notation", repeat: 6, options: { maxIndex: 5 } }
                            ]
                        },
                        {
                            formulation: "Calcula el valor numèric de les potències",
                            questions: [
                                { gen: "arithmetics/power/value", repeat: 8, options: {} }
                            ]
                        },
                        {
                            formulation: "Redueix a una única potència",
                            questions: [
                                { gen: "arithmetics/power/operations", repeat: 4, options: {complexity: 1} },
                                { gen: "arithmetics/power/operations", repeat: 4, options: {complexity: 2} }
                            ]
                        },
                        {
                            formulation: "Treu factors i simplifica els radicals si és possible",
                            questions: [
                                { gen: "arithmetics/radicals/simplify", repeat: 4, options: { maxIndex: 5 } }
                            ]
                        },
                        {
                            formulation: `Això és un recordatori de com s'ha de fer $\\\\sqrt{6}{x}=x^{1/6}$`,
                            questions: []
                        },
                        {
                            formulation: "Opera els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: {} },
                                { gen: "arithmetics/radicals/operations", repeat: 2, options: { algebraic: true } }
                            ]
                        },
                        {
                            formulation: "Simplifica els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/gather", repeat: 2, options: { maxIndex: 2 } },
                                { gen: "arithmetics/radicals/gather", repeat: 2, options: { domain: 'Q' } }
                            ]
                        },
                        {
                            formulation: "Racionalitza els radicals",
                            questions: [
                                { gen: "arithmetics/radicals/rationalize", repeat: 2, options: {} },
                                { gen: "arithmetics/radicals/rationalize", repeat: 2, options: { conjugate: true } }
                            ]
                        }
                    ]
                },
                {
                    name: "Polinomis", activities: [
                        {
                            formulation: "Divideix aquests polinomis utilitzant la regla de Ruffini", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { ruffini: true } }
                            ]
                        },
                        {
                            formulation: "Divideix els polinomis", questions: [
                                { gen: "algebra/polynomial/division", repeat: 4, options: { fraction: false, maxDegree: 4, interval: 5 } }
                            ]
                        },
                        {
                            formulation: "Expandeix les identitats notables.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 2 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3 } }
                            ]
                        },
                        {
                            formulation: "Escriu, si és possible, aquests polinomis com una identitat notable.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1, indirect: true } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3, indirect: true } }
                            ]
                        },
                        {
                            formulation: "Extreu factor comú dels polinomis", questions: [
                                { gen: "algebra/polynomial/commonfactor", repeat: 3, options: { interval: 5, complexity: 1 } }
                            ]
                        },
                        {
                            formulation: "Factoritza els polinomis", questions: [
                                { gen: "algebra/polynomial/factorize", repeat: 4, options: { interval: 5, complexity: 0, maxDegree: 3, allowFractions: false } },
                                { gen: "algebra/polynomial/factorize", repeat: 4, options: { interval: 5, complexity: 1, maxDegree: 3, allowFractions: true } }
                            ]
                        },
                        {
                            formulation: "Simplifica les fraccions algebraiques", questions: [
                                { gen: "algebra/fractions/simplify", repeat: 4, options: { interval: 5, maxDegree: 3 } }
                            ]
                        }
                    ]
                },
                {
                    name: "Equacions", activities: [                        
                        {
                            formulation: "Resol aquestes equacions de segon grau", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, maxDegree:2, minDegree: 2 } },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, maxDegree:2, minDegree: 2 } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions biquadrades", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, specialType: 'biquadratic' } },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, specialType: 'biquadratic' } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions factoritzades", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 4, options: { interval: 5, complexity: 0, specialType: 'factorizable', minDegree: 2, maxDegree: 5 } } 
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions polinòmiques", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, minDegree: 3, maxDegree: 4} },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, minDegree: 3, maxDegree: 5} } 
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions racionals", questions: [
                                { gen: "algebra/equations/rational", repeat: 2, options: { interval: 5, complexity: 1 } },
                                { gen: "algebra/equations/rational", repeat: 2, options: { interval: 5, complexity: 2 } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions irracionals", questions: [
                                { gen: "algebra/equations/irrational", repeat: 2, options: { interval: 10, complexity: 1} },
                                { gen: "algebra/equations/irrational", repeat: 4, options: { interval: 10, complexity: 2} } 
                            ]
                        },
                        {
                            formulation: "Resol aquestes sistemes d'equacions", questions: [
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 10, dimension: 2, nequations: 2} },
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 5, dimension: 3, nequations: 3, allowIncompatible: true, allowIndeterminate: true} },
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 5, dimension: 3, nequations: 2} },
                                { gen: "algebra/system/nonlinear", repeat: 2, options: { interval: 10, complexity: 1} },
                                { gen: "algebra/system/nonlinear", repeat: 2, options: { interval: 10, complexity: 2} }    
                            ]
                        },
                        {
                            formulation: "En Miquel té ${a} euros i na Maria ${b} euros.", scope: {a: "rnd.decimal(10,40,2)", b: "rnd.decimal(10,40,2)"}, questions: [
                                { gen: "special/computed", repeat: 1, options: { 
                                    qFormulation: "Quants d'euros tenen en total?",
                                    qAnswer: "${(a+b).toFixed(2)} euros"
                                 } },
                                 { gen: "special/computed", repeat: 1, options: { 
                                    qFormulation: "Quants d'euros de diferència?",
                                    qAnswer: "${Math.abs(a-b).toFixed(2)} euros"
                                 } }  
                            ]
                        }
                    ]
                },
                {
                    name: "Logaritmes", activities: [
                        {
                            formulation: "Utilitza la definició de logaritme  per calcular el valor de de $x$ en les equacions següents", questions: [
                                { gen: "arithmetics/logarithm/definition", repeat: 6, options: { interval: 5 } }
                            ]
                        }
                    ]
                },
                {
                    name: "Funcions", activities: [
                        {
                            formulation: "Representa aquestes funcions lineals", questions: [
                                { gen: "calculus/elemental/graph", repeat: 4, options: { interval: 10, domain: 'Q', types: [0] } }
                            ]
                        },
                        {
                            formulation: "Calcula el vèrtex i representa aquestes paràboles", questions: [
                                { gen: "calculus/elemental/graph", repeat: 4, options: { interval: 10, types: [1] } }
                            ]
                        },
                        {
                            formulation: "Representa aquestes funcions elementals i calcula el seu domini", questions: [
                                { gen: "calculus/elemental/graph", repeat: 6, options: { interval: 10, types: [0, 1, 2, 3, 4, 5] } }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    return body;
}

//Mysql - Cache is cleared after 5 minutes
const deltaTime = 5 * 60 * 1000;

function generateDocument(doc: any, res: Response) {
    const generator = new WsMathGenerator(doc);
    generator.create(doc);
    if (doc.type === 'html') {
        const htmlPage = generator.exportAs(WsExportFormats.HTML);
        res.setHeader("Content-type", "text/html");
        res.status(200).send(htmlPage);
    } else if (doc.type === 'tex' || doc.type === 'latex') {
        const tex = generator.exportAs(WsExportFormats.LATEX);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);
    } else if (doc.type === 'moodlexml') {
        const tex = generator.exportAs(WsExportFormats.MOODLEXML);
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(tex);
    } else {
        const tex = generator.exportAs(WsExportFormats.LATEX);
        
            const outputStream = latexToPdf(tex);
            outputStream.on("error", function(err){
                res.status(400).send("Error producing pdf:: "+ err);
                return;
            });
            res.setHeader("Content-type", "application/pdf");
            outputStream.pipe(res);
        
    }
}


export function wsMathMiddleware(options?: wsMathMdwOptions) {
    options = { basePrefix: '', ...options };
    if (!options.storage) {
        options.storage = new MysqlStorage();
    }

    setInterval(function () {
        options.storage.clear();
    }, deltaTime);

    const router = express.Router();


    /**
     * Posts the document structure in json format and returns the stored document id
     */
    const base = (options.basePrefix || '') + '/wsmath';
    let url = base + '/store';
    router.post(url, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const seed = req.query.seed;
        let body = req.body;
        if (!body) {
            body = {};
        }
        if (typeof (body) === 'string') {
            body = JSON.parse(body);
        }

        body.type = req.query.type || 'html';
        body.seed = (seed == 0 ? '' : seed);
        body.baseURL = base;

        const uid = await options.storage.save(body, req.query.idUser, req.query.persist);
        res.send({ id: uid });
    });

    /***
     * Gets a document by its id
     * optional query params type, seed
     */

    url = base + '/';
    router.get(url, async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const id = req.query.id;
        let doc = await options.storage.load(id);

        if (!doc) {
            res.render('notfound', {
                id: id
            });
        } else { 
            // Pass extra information from query params
            if (req.query.seed) {
                doc.seed = req.query.seed;
            }
            if (req.query.type) {
                doc.type = req.query.type;
            }
            if (req.query.fullname) {
                doc.fullname = req.query.fullname;
            }
            if (req.query.seed && !req.query.username && !req.query.idUser) {
                req.query.username = req.query.seed + "b";
            }
            if (req.query.username) {
                // get fullname of this username
                doc.seed = req.query.username;
                const user = await options.storage.userByUsername(req.query.username);
                if (user) {
                    doc.fullname = user["fullname"];
                    if (user["idRole"] < 200) {
                        doc.includeKeys = true;
                    }
                }
            }
            if (req.query.idUser) {
                // get fullname of this idUser
                doc.seed = req.query.idUser;
                const user = await options.storage.userByIdUser(req.query.idUser);
                if (user) {
                    doc.fullname = user["fullname"];
                    if (user["idRole"] < 200) {
                        doc.includeKeys = true;
                    }
                }
            }
            // Generate document
            try  {
                generateDocument(doc, res);
            } catch (Ex) {
                console.log("An error occurred while generating the document::", Ex);
            }
        }
    });


    url = (options.basePrefix || '') + '/wsmath/editor';
    router.get(url, function (req: express.Request, res: express.Response, next: express.NextFunction) {
 
            const textarea: string = JSON.stringify(generateSample1BAT(), null, 2)
                .replace(/"/g, "\\\"").replace(/\n/g, "\\n");
 
            const uri = (options.basePrefix || '') + '/wsmath';
            res.render("editor", {
                textarea: textarea,
                url: uri,
                questionTypesList: Object.keys(Container).sort(),
                questionTypesMeta: Container,
                user: {id: 0, fullname: "Admin", username:"admin"}
            });
        });

 
    return router;
}



 