module.exports = function generateSample1BAT() {
    var body = {
        worksheet: {
            includeKeys: true,
            title: "Feina recomanada pels alumnes que han de cursar Matemàtiques a 1r de Batxillerat",
            instructions: `INSTRUCCIONS: Imprimiu aquest dossier i realizeu les activitats proposades. Aquesta feina es presentarà al professor del proper curs dins la primera setmana de classe. La realització correcta d'aquesta tasca serà valorada com a nota de la 1a avaluació. \\n AJUDA: Si necessitau ajuda podeu consultar els apunts o el llibre de 4t d'ESO Matemàtiques Acadèmiques i els recursos penjats a l'entorn Moodle del nostre centre.`,
            sections: [
                {
                    name: "Radicals", activities: [
                        {
                            formulation: "Introdueix tots els factors dins l'arrel més interna i expressa com un sol radical:",
                            questions: [
                                { gen: "arithmetics/radicals/introduce", repeat: 2, options: { complexity: 1 } },
                                { gen: "arithmetics/radicals/introduce", repeat: 2, options: { complexity: 2, algebraic: false } },
                                { gen: "arithmetics/radicals/introduce", repeat: 2, options: { complexity: 2, algebraic: true } }
                            ]
                        },
                        {
                            formulation: "Utilitza les propietats per expressar com un únic radical:",
                            questions: [
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: { forceDifferentIndex: true } },
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: { algebraic: true, forceDifferentIndex: true } }
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
                                { gen: "arithmetics/radicals/operations", repeat: 6, options: { miscellania: true } },
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
                                { gen: "algebra/fractions/simplify", repeat: 3, options: { complexity: 1, interval: 5, maxDegree: 3 } },
                                { gen: "algebra/fractions/simplify", repeat: 3, options: { complexity: 2, interval: 5, maxDegree: 3 } }
                            ]
                        },
                        {
                            formulation: "Opera i simplifica les fraccions algebraiques", questions: [
                                { gen: "algebra/fractions/simplify", repeat: 6, options: { complexity: 3, interval: 5, maxDegree: 3 } }
                            ]
                        },
                        {
                            formulation: "Efectua les operacions amb fraccions algebraiques (factoritzar els denominadors i troba el min.c.m)", questions: [
                                { gen: "algebra/fractions/operations", repeat: 4, options: { interval: 5, complexity: 1 } }
                            ]
                        },
                        {
                            formulation: "Efectua les operacions amb fraccions algebraiques", questions: [
                                { gen: "algebra/fractions/operations", repeat: 4, options: { interval: 5, complexity: 2 } }
                            ]
                        }
                    ],
                },
                {
                    name: "Equacions i sistemes", activities: [
                        {
                            formulation: "Resol aquestes equacions polinòmiques (treu factor comú i factoritza el polinomi)", questions: [
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 1, minDegree: 3, maxDegree: 4 } },
                                { gen: "algebra/equations/polynomial", repeat: 2, options: { interval: 5, complexity: 2, minDegree: 3, maxDegree: 5 } }
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
                                { gen: "algebra/equations/irrational", repeat: 2, options: { interval: 10, complexity: 1 } },
                                { gen: "algebra/equations/irrational", repeat: 4, options: { interval: 10, complexity: 2 } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes sistemes d'equacions lineals", questions: [
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 10, dimension: 2, nequations: 2 } },
                                { gen: "algebra/system/lineal", repeat: 2, options: { interval: 10, dimension: 2, nequations: 2, extraComplexity: true } }
                            ]
                        },
                        {
                            formulation: "Resol aquestes sistemes d'equacions no lineals", questions: [
                                { gen: "algebra/system/nonlinear", repeat: 3, options: { interval: 10, complexity: 1 } },
                                { gen: "algebra/system/nonlinear", repeat: 3, options: { interval: 10, complexity: 2 } }
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
                                { gen: "algebra/system/nonlinear", repeat: 4, options: { interval: 10, graphical: true } }
                            ]
                        }
                    ]
                }
            ]
        }
    };
    return body;
};
//# sourceMappingURL=generateSample1BAT.js.map