import { Numeric } from "./Numeric";
import { Monomial } from "./Monomial";
import { Power } from "./Power";

export function typed(args: IArguments, rules) {
    const types = Array.from(args).map(a => a.constructor? a.constructor.name : typeof(a)).join(", ");
    const fun = rules[types];
    if (fun) {
        return fun(args);
    } else {
        throw "Not found typed rule for " + types;
    }
}

export class WsMath {
    static add(a, b){
        typed(arguments, {
            "Numeric, Numeric": function(x: Numeric, y: Numeric) {
                return x.add(y);  
            }            
        });
    }
    static substract(a, b){
        typed(arguments, {
            "Numeric, Numeric": function(x: Numeric, y: Numeric) {
                return x.substract(y);  
            }            
        });
    }
    static multiply(a, b) {
        typed(arguments, {
            "Numeric, Numeric": function(x: Numeric, y: Numeric): Numeric {
                return <Numeric> x.multiply(y);  
            },
            "Numeric, Monomial": function(x: Numeric, y: Monomial): Monomial {
                return new Monomial(<Numeric> y.coef.multiply(x), y.literals);
            },
            "Monomial, Monomial": function(x: Monomial, y: Monomial): Monomial {
                return x.multiply(y);
            }             
        });
    }
    static divide(a, b){
        typed(arguments, {
            "Numeric, Numeric": function(x: Numeric, y: Numeric): Numeric {
                return <Numeric> x.divide(y);  
            },
            "Monomial, Numeric": function(x: Monomial, y: Numeric): Monomial {
                return new Monomial(<Numeric> x.coef.divide(y), x.literals);
            },
            "Monomial, Monomial": function(x: Monomial, y: Monomial): Monomial {
                return x.divide(y);
            }              
        });
    }
    static pow(a, n){
        typed(arguments, {
            "Numeric, number": function(x: Numeric, y: number): Numeric {
                return <Numeric> x.power(Numeric.fromNumber(y));  
            },
            "Numeric, Numeric": function(x: Numeric, y: Numeric): Numeric | Power {
                return x.power(y);  
            }             
        });
    }
    static root(a, n){

    }
}