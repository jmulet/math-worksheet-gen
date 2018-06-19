
function generateSample2BAT() {
    var body = {

        worksheet: {
            includeKeys: true,
            title: "Feina recomanada pels alumnes que han de cursar MAT-II a 2n de Batxillerat",
            instructions: `INSTRUCCIONS: Imprimiu aquest dossier i realizeu les activitats proposades. Aquesta feina es presentarà al professor del proper curs dins la primera setmana de classe. La realització correcta d'aquesta tasca serà valorada com a nota de la 1a avaluació. \\n AJUDA: Si necessitau ajuda podeu consultar els apunts o el llibre de Matemàtiques I i els recursos penjats al curs online https://piworld.es.`,
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
                            formulation: `A vegades és possible simplificar l'arrel traient factors defora d'ella. Per això, tots els factors que estan elevats a l'índex de l'arrel surt multiplicant davant l'arrel sense l'exponent. Per exemple $\\\\sqrt[3]{2^3 \\\\cdot 5}=2 \\\\sqrt{3}{5}$`,
                            questions: []
                        },
                        {
                            formulation: "Treu factors i simplifica els radicals si és possible",
                            questions: [
                                { gen: "arithmetics/radicals/simplify", repeat: 4, options: { maxIndex: 5 } }
                            ]
                        },                       
                        {
                            formulation: "Opera els radicals (passa-los prèviament a forma de potència)",
                            questions: [
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: {useSingleBase: true} },
                                { gen: "arithmetics/radicals/operations", repeat: 4, options: { algebraic: true, useSingleBase: true } }
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
