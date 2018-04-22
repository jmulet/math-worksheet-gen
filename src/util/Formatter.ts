import { Numeric } from "../math/Numeric";

export class Formatter {
    /**
     * Formats something like 1, x, 0, y, -1, z 
     * to produce a string x - z
     * @param args Numeric, string, Numeric, String, ...
     */
    static numericXstring(...args: (Numeric | string)[]): string {
        const n = args.length;
        if (n%2 !== 0) {
            throw "numericXstring: the number of arguments must be even.";
        }
        let str = [];
        for (let i=0; i < n; i+=2) {
            const numeric = <Numeric> args[i];
            const symbol = <string> args[i+1];
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
                    str.push(numeric.toTeX() + " " + symbol);                    
                }
            }
        }
        return str.join('');
    }
}