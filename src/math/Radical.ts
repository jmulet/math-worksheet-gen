import { Power } from "./Power"; 
import { Arithmetics } from "./Arithmetics";
import { Monomial } from "./Monomial";
import { Numeric } from "./Numeric";
import * as mathjs from "mathjs";
import { Literal } from "./Literal";
import { Giac } from "./Giac";
import { Formatter } from "../util/Formatter";

function factor2TeX(factors: any[]): string {
    let y = "";
    let sep = "";
    for (let i=0; i < factors.length; i+=2) {
        let expo = factors[i+1];
        if (expo.toTeX) {
            expo = expo.toTeX();
        }
        y += sep + factors[i] + "^{"+ expo +"} ";        
        sep = "\\cdot ";
    }
    return y || "1";
}

function factor2Number(factors: number[]): number {
    let y = 1;
    for (let i=0; i < factors.length; i+=2) {
        y *= Math.pow(factors[i], factors[i+1]);        
    }
    return y;
}

function factor2Numeric(num: number[], den: number[]): Numeric {
    return new Numeric(factor2Number(num), factor2Number(den));
}

// Monomial coefficent · Root[index]{ Monomial radicand }
export class Radical {
    
    public radicand: Monomial;
    public coefficient: Monomial;

    constructor(_radicand: number | Numeric | Monomial, public index = 2, _coefficient?: number | Numeric | Monomial) {
        if (typeof(_radicand) === 'number') {
            this.radicand = Monomial.fromNumber(_radicand);
        } else if (_radicand instanceof Numeric) {
            this.radicand = Monomial.fromNumeric(_radicand);
        } else {
            this.radicand = _radicand;
        }

        if (typeof(_coefficient) === 'number') {
            this.coefficient = Monomial.fromNumber(_coefficient);
        } else if (_coefficient instanceof Numeric) {
            this.coefficient = Monomial.fromNumeric(_coefficient);
        } else {
            this.coefficient = _coefficient || Monomial.fromNumber(1);
        }
    }

    copy(): Radical {
        return new Radical(this.radicand.copy(), this.index, this.coefficient.copy());
    }

    opposite(): Radical {
        const clone = this.copy();
        clone.coefficient.coef = clone.coefficient.coef.oposite();
        return clone;
    }

    multiply(r: Radical): Radical {
        const lcm = mathjs.lcm(r.index, this.index);
        const e1 = lcm/this.index;
        const e2 = lcm/r.index;
        const newCoefficent = this.coefficient.multiply(r.coefficient);
        const rad1 = this.radicand.power(e1);
        const rad2 = r.radicand.power(e2);
        return new Radical(rad1.multiply(rad2), lcm, newCoefficent);
    }

    divide(r: Radical): Radical {
        const lcm = mathjs.lcm(r.index, this.index);
        const e1 = lcm/this.index;
        const e2 = lcm/r.index;
        const newCoefficent = this.coefficient.divide(r.coefficient);
        const rad1 = this.radicand.power(e1);
        const rad2 = r.radicand.power(e2);
        return new Radical(rad1.divide(rad2), lcm, newCoefficent);
    }

    root(n: number): Radical {      
        const enterCoefficent = this.coefficient.power(this.index);       
        return new Radical(this.radicand.multiply(enterCoefficent), n*this.index);
    }

    power(n: number): Radical {
        return new Radical(this.radicand.power(n), this.index, this.coefficient.power(n));
    }

    // Enter coefficient
    enterCoefficient(): Radical {
        const coeff = this.coefficient.copy();
        const negative = coeff.coef.isNegative();
        coeff.coef.Re["s"] = 1;
        return new Radical(this.radicand.multiply(coeff.power(this.index)), this.index, negative? -1 : 1);
    }

    // Try to extract factors and simplify powers
    simplify(): Radical {

        //Literals that can be taken out of the radical
        const inLiterals = this.radicand.literals.map((e)=> e.copy());
        const powers = inLiterals.map( (e)  => e.exponent );

        const outLiterals = [];
        inLiterals.forEach( (literal) =>  {
            var div = Math.trunc(literal.exponent/this.index);
            var rem = literal.exponent % this.index;
            if (div > 0) {
                outLiterals.push(new Literal(literal.symbol, div));
                literal.exponent = rem;
            }
        });

                // Factorize the coefficients in array form [prime1, expo1, prime2, expo2, ....]
                
                let numFactors, denFactors;

                try {
                    numFactors = JSON.parse(Giac.ifactors(this.radicand.coef.Re['n']));                    
                } catch(Ex) {
                    console.log(Ex);
                    numFactors = [this.radicand.coef.Re['n'], 1]
                }

                try {
                    denFactors = JSON.parse(Giac.ifactors(this.radicand.coef.Re['d']));
                } catch(Ex) {
                    console.log(Ex);
                    denFactors = [this.radicand.coef.Re['d'], 1]
                }
        
                const outNumFactors = [];
                const outDenFactors = [];
        
                for (let i=0; i < numFactors.length; i+=2) {
                    const exponent = numFactors[i+1];
                    powers.push(exponent);
                    var div = Math.trunc(exponent/this.index);
                    var rem = exponent % this.index;
                    if (div > 0) {
                        outNumFactors.push(numFactors[i]);
                        outNumFactors.push(div);
                        numFactors[i+1] = rem;
                    }
                }
                for (let i=0; i < denFactors.length; i+=2) {
                    const exponent = denFactors[i+1];
                    powers.push(exponent);
                    var div = Math.trunc(exponent/this.index);
                    var rem = exponent % this.index;
                    if (div > 0) {
                        outDenFactors.push(denFactors[i]);
                        outDenFactors.push(div);
                        denFactors[i+1] = rem;
                    }
                }

        // Check the gcd of all exponents including coefs and literals
        let index = this.index;
        powers.push(index);
        const gcd = parseInt(Giac.gcd(powers));
        if (gcd > 1) {
            inLiterals.forEach( (literal) => literal.exponent /= gcd );
            for (let i=0; i < numFactors.length; i+=2) {
                numFactors[i+1] /= gcd;
            }
            for (let i=0; i < denFactors.length; i+=2) {
                denFactors[i+1] /= gcd;                
            }
            index /= gcd;
        }

        // Transform factorizations back into numerics
        const numericOut = factor2Numeric(outNumFactors, outDenFactors);
        const numericIn = factor2Numeric(numFactors, denFactors);


        // build simplified radical
        const radicand = new Monomial(numericIn, inLiterals);
        const coefficient = new Monomial(numericOut, outLiterals);
        return new Radical(radicand, index, coefficient.multiply(this.coefficient));
    } 

    isRadical(): boolean {
        const simplified = this.simplify();
        return simplified.index > 1;
    }
 

    toTeX(opts?: any): string {
        let str;
        opts = {coef: true, ...opts};
        
        if (this.index > 2) {     
            if (opts.coef) {       
                str = Formatter.numericXstringTeX(false, this.coefficient, " \\sqrt[" + this.index + "]{" + this.radicand.toTeX().trim() + "}" );
            } else {
                str = " \\sqrt[" + this.index + "]{" + this.radicand.toTeX().trim() + "}";
            }
        } else if (this.index === 2) {
            if (opts.coef) {       
                str = Formatter.numericXstringTeX(false, this.coefficient, " \\sqrt{" + this.radicand.toTeX().trim() + "}" );
            } else {
                str = " \\sqrt{" + this.radicand.toTeX().trim() + "}";
            }
        } else if (this.index === 1) {
            if (opts.coef) {
                str = this.coefficient.multiply(this.radicand).toTeX().trim();
            } else {
                str =  this.radicand.toTeX().trim();                 
            }
        }

        return str;
    }

    toString(opts?: any): string {
        let str;
        opts = {coef: true, ...opts};
       
        if (this.index > 2) {   
            if (opts.coef) {             
                str = Formatter.numericXstring( this.coefficient, "root(" + this.index + ", " + this.radicand.toString().trim() + ")" );
            } else {
                str = "root(" + this.index + ", " + this.radicand.toString().trim() + ")";
            }
        } else if (this.index === 2) {
            if (opts.coef) {    
                str = Formatter.numericXstring( this.coefficient, "sqrt(" + this.radicand.toString().trim() + ")" );
            } else {
                str = "sqrt(" + this.radicand.toString() + ")";
            }
        } else if (this.index === 1) {
            if (opts.coef) {    
                str = this.coefficient.multiply(this.radicand).toString().trim();
            } else {
                str = this.radicand.toString();
            }
        }

        return str;
    }


    /**
     * Displays the radical in power form
     */
    toPowerTeX(): string {
        let str = "";
        let numFactors, denFactors;

        try {
            numFactors = JSON.parse(Giac.ifactors(this.radicand.coef.Re['n']));                    
        } catch(Ex) {
            console.log(Ex);
            numFactors = [this.radicand.coef.Re['n'], 1]
        }

        try {
            denFactors = JSON.parse(Giac.ifactors(this.radicand.coef.Re['d']));
        } catch(Ex) {
            console.log(Ex);
            denFactors = [this.radicand.coef.Re['d'], 1]
        }

        // Add to num or den factors those from the literal part depending on sign
        this.radicand.literals.forEach( (literal) => {
            if (literal.exponent > 0) {
                numFactors.push(literal.symbol, literal.exponent);
            } else if (literal.exponent < 0) {
                denFactors.push(literal.symbol, Math.abs(literal.exponent));
            }
        });

        // Map all factors exponents from i ==> i/index fraction in simplified form
        for (let i=0; i < numFactors.length; i+=2) {
            numFactors[i+1] = new Numeric(numFactors[i+1], this.index);    
        }

        for (let i=0; i < denFactors.length; i+=2) {
            denFactors[i+1] = new Numeric(denFactors[i+1], this.index);    
        }

        const num = factor2TeX(numFactors).trim();
        const den = factor2TeX(denFactors).trim();

        if (den==='1') {
            str = num;
        } else {
            str = "\\frac{" + num + "}{" + den + "}";
        }

        str = Formatter.numericXstringTeX(true, this.coefficient, str);

        return str;
    }
}