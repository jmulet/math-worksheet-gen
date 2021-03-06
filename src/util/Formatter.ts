import { Numeric } from "../math/Numeric";
import { Monomial } from "../math/Monomial";
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from "constants";

export class Formatter {
    /**
     * Formats something like 1, x, 0, y, -1, z 
     * to produce a string x - z
     * @param args Numeric, string, Numeric, String, ...
     */
    static numericXstringTeX(useCdot: boolean, ...args: (Numeric | Monomial | string)[]): string {
        const n = args.length;
        if (n%2 !== 0) {
            throw "numericXstring: the number of arguments must be even.";
        }
        let str = [];
        for (let i=0; i < n; i+=2) {
            let numeric;
            let literal = '';
            if (args[i] instanceof Numeric) {
                numeric = <Numeric> args[i];
            } else if (args[i] instanceof Monomial) {
                const monomial = <Monomial> args[i];
                numeric = monomial.coef;
                literal = monomial.literals.map((e)=> e.toTeX()).join(" \\cdot ") || '';
            }
            let cdot = " ";
            if (useCdot) {
                cdot = " \\cdot ";
            }            
            let symbol = <string> args[i+1];
            if (literal) {
                symbol = literal + (symbol? (cdot + symbol) : '');
            }
            if (!numeric.isZero()) {
                if (numeric.is(1)) {   
                    if (i > 0) {
                        str.push(" + ");
                    }                 
                    str.push(symbol? symbol: ' 1 '); 
                } else if (numeric.is(-1)) {   
                    str.push(symbol? (' -' + symbol): ' -1 '); 
                } else  {
                    if (!numeric.isNegative() && i > 0) {
                        str.push(" + ");
                    } 
                    let nn = numeric.toTeX().trim();
                    if(nn && symbol.trim()!=='1') {
                        nn += cdot + symbol;
                    }
                    str.push(nn);                    
                }
            }
        }
        return str.join('');
    }


    static numericXstring(...args: (Numeric | Monomial | string)[]): string {
        const n = args.length;
        if (n%2 !== 0) {
            throw "numericXstring: the number of arguments must be even.";
        }
        let str = [];
        for (let i=0; i < n; i+=2) {
            let numeric;
            let literal = '';
            if (args[i] instanceof Numeric) {
                numeric = <Numeric> args[i];
            } else if (args[i] instanceof Monomial) {
                const monomial = <Monomial> args[i];
                numeric = monomial.coef;
                literal = monomial.literals.map((e)=> e.toString()).join("*") || '';
            }
                        
            let symbol = <string> args[i+1];
            if (literal) {
                symbol = literal + (symbol? ("*" + symbol) : '');
            }
            if (!numeric.isZero()) {
                if (numeric.is(1)) {   
                    if (i > 0) {
                        str.push(" + ");
                    }                 
                    str.push(symbol? symbol: ' 1 '); 
                } else if (numeric.is(-1)) {   
                    str.push(symbol? (' -' + symbol): ' -1 '); 
                } else  {
                    if (!numeric.isNegative() && i > 0) {
                        str.push(" + ");
                    } 
                    str.push(numeric.toString() + "*" + symbol);                    
                }
            }
        }
        return str.join('');
    }

    static append(a: number | Numeric) {
        if (a instanceof Numeric) {
            if (a.isZero()) {
                return "";
            }
            if (!a.isNegative()) {
                return "+" + a.toTeX()
            }
            return a.toTeX();
        } else {
            if (a===0) {
                return "";
            }
            if (a > 0) {
                return "+" + a
            }
            return a + "";
        }
    }

    static displayPower(base, exponent, inverse?): string {
        if (base === 1 || exponent === 0) {
            return "";
        }
        if (exponent === 1) {
            return base;
        }
        if (inverse) {
            return base + "^{\\frac{1}{" + exponent + "}}";
        } 
        return base + "^{" + exponent + "}";
    }
    
    static displayRoot(index, radicand): string {
        if (index === 2) {
            return "\\sqrt{"+ radicand +"}";
        }
        return "\\sqrt[" + index + "]{" + radicand + "}";
    }
}