"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateSample4ESO() {
    var body = {
        worksheet: {
            includeKeys: true,
            title: "Feina recomanada pels alumnes que han de cursar Matemàtiques Acadèmiques a 4t d'ESO",
            instructions: `INSTRUCCIONS: Imprimiu aquest dossier i realizeu les activitats proposades. Aquesta feina es presentarà al professor del proper curs dins la primera setmana de classe. La realització correcta d'aquesta tasca serà valorada com a nota de la 1a avaluació. \\n AJUDA: Si necessitau ajuda podeu consultar els apunts o el llibre de 3r d'ESO Matemàtiques i els recursos penjats al curs https://piworld.es`,
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
                                { gen: "arithmetics/power/operations", repeat: 4, options: { complexity: 1 } },
                                { gen: "arithmetics/power/operations", repeat: 4, options: { complexity: 2 } }
                            ]
                        },
                        {
                            formulation: "A vegades és possible simplificar una arrel traient factors defora d'ella. Per això, cal descomposar el radicand en factors primers. Després, tot els factors que estan elevants a l'índex poden sortir davant l'arrel. Exemple: $\\\\sqrt[3]{250}  = \\\\sqrt[3]{5^3 \\\\cdot 2} = 5 \\\\sqrt[3]{2}$", questions: []
                        },
                        {
                            formulation: "Treu factors i simplifica els radicals si és possible",
                            questions: [
                                { gen: "arithmetics/radicals/simplify", repeat: 4, options: { maxIndex: 5 } }
                            ]
                        },
                        {
                            formulation: "Opera els radicals (expressant-los prèviament en forma de potència i operant les potències)",
                            questions: [
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: { useSingleBase: true, forceDifferentIndex: true } },
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: { algebraic: true, useSingleBase: true, forceDifferentIndex: true } }
                            ]
                        }
                    ] //
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
                            formulation: "Desenvolupa les identitats notables.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 2 } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 3 } }
                            ]
                        },
                        {
                            formulation: "Escriu, si és possible, aquests polinomis com una identitat notable.", questions: [
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 1, indirect: true } },
                                { gen: "algebra/polynomial/identities", repeat: 2, options: { interval: 5, complexity: 2, indirect: true } }
                            ]
                        },
                        {
                            formulation: "Extreu factor comú dels polinomis", questions: [
                                { gen: "algebra/polynomial/commonfactor", repeat: 4, options: { interval: 5, complexity: 1 } }
                            ]
                        }
                    ]
                },
                {
                    name: "Equacions", activities: [
                        {
                            formulation: "Resol aquestes equacions de segon grau", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, maxDegree: 2, minDegree: 2 } },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, maxDegree: 2, minDegree: 2 } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes equacions biquadrades (Recorda a aplicar el canvi $t=x^2$)", questions: [
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
                            formulation: "Per resoldre una equació polinòmica (de grau superior a 2): 1r) Intentam treure factor comú, 2n) Miram si identificam alguna identitat notable, 3r) Si el grau és 3 o més, caldrà fer Ruffini. VIDEO 52: Equacions polinòmiques",
                            questions: []
                        },
                        {
                            formulation: "Resol aquestes equacions polinòmiques", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, minDegree: 2, maxDegree: 3 } },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, minDegree: 2, maxDegree: 3 } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes sistemes d'equacions", questions: [
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 10, dimension: 2, nequations: 2 } },
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 10, dimension: 2, nequations: 2, extraComplexity: true } }
                            ]
                        },
                        {
                            formulation: "", questions: [
                                { gen: "algebra/equations/quadraticproblems", repeat: 1, options: {} }
                            ]
                        },
                        {
                            formulation: "", questions: [
                                { gen: "algebra/equations/quadraticproblems", repeat: 1, options: {} }
                            ]
                        },
                        {
                            formulation: "", questions: [
                                { gen: "algebra/equations/quadraticproblems", repeat: 1, options: {} }
                            ]
                        },
                        {
                            formulation: "", questions: [
                                { gen: "algebra/system/linealproblems", repeat: 1, options: { dimension: 2 } }
                            ]
                        },
                        {
                            formulation: "", questions: [
                                { gen: "algebra/system/linealproblems", repeat: 1, options: { dimension: 2 } }
                            ]
                        },
                        {
                            formulation: "", questions: [
                                { gen: "algebra/system/linealproblems", repeat: 1, options: { dimension: 2 } }
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
                                { gen: "calculus/elemental/graph", repeat: 4, options: { interval: 10, types: [1], complexity: 0 } }
                            ]
                        }
                    ]
                }
            ]
        }
    };
    return body;
}
exports.generateSample4ESO = generateSample4ESO;
//# sourceMappingURL=generateSample4ESO.js.map