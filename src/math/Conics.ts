import { HandleFunction } from "connect";
import { Point } from "./Point";
import { Numeric } from "./Numeric";
import { Line } from "./Line";

 

export class Conics {
    O = new Point([0, 0]);
    a = 1;
    b = 1;
    c = 0;
    constructor(O: Point, a, b, c) {
        this.O = O;
        this.a = a;
        this.b = b;
        this.c = c;
    }

    excentricity(): number {
        return this.c/this.a;
    }

    toTeX(): string {
        return "";
    }

    static Circumference(O: Point, R: number): Circumference {
        return new Circumference(O, R);
    }

    static Elipse(O: Point, a: number, b: number): Elipse {
        return new Elipse(O, a, b);
    }

    static Hiperbola(O: Point, a: number, b: number): Hiperbola {
        return new Hiperbola(O, a, b);
    }

    static Parabola(O: Point, d: Line): Parabola {
        return new Parabola(O, d);
    }
}

export class Circumference extends Conics {
    
    R: number;
    static fromThreePoints(A: Point, B: Point, C: Point): Circumference {
        return new Circumference(new Point([0, 0]), 1);
    }
    
    constructor(O: Point, R: number) {
        super(O, R, R, 0);
        this.R = R;
    }

    toTeX(general?: boolean): string {
        if (general) {
            const x0 = this.O.components[0].toNumber();
            const y0 = this.O.components[1].toNumber();
            const D = -2*x0;
            const E = -2*y0;
            const F = x0*x0+y0*y0-this.R*this.R
            let str = "x^2 + y^2";
            if (D) {
                if(D > 0) {
                    str += " + ";
                }
                str += D + "x ";
            }
            if (E) {
                if(E > 0) {
                    str += " + ";
                }
                str += E + "y ";
            }
            if (F) {
                if(F > 0) {
                    str += " + ";
                }
                str += F ;
            }
            return str + " = 0";
        } else {
            const x0 = this.O.components[0].oposite();
            const y0 = this.O.components[1].oposite();
            let str;
            if (!x0.isZero()) {
                str = "\\left( x ";
                if (!x0.isNegative()) {
                    str += " + ";
                }                
                str += x0.toTeX() + " \\right)^2 + "; 
            } else {
                str = "x^2 + ";
            }   
            if (!y0.isZero()) {
                str += "\\left( y ";
                if (!y0.isNegative()) {
                    str += " + ";
                }                
                str += y0.toTeX() + " \\right)^2"; 
            } else {
                str += "y^2";
            }   
            return str + "=" + this.R*this.R;
        }
    }

}

export class Elipse extends Conics {
    constructor(O: Point, a: number, b: number) {
        super(O, a, b, Math.sqrt(Math.abs(a*a-b*b)));
    }

    toTeX(): string {
        const x0 = this.O.components[0].oposite();
        const y0 = this.O.components[1].oposite();
        let str;
        if (!x0.isZero()) {
            str = "\\left( x ";
            if (!x0.isNegative()) {
                str += " + ";
            }                
            str += x0.toTeX() + " \\right)^2 " 
        } else {
            str = "x^2";
        }   
        if (this.a !== 1) {
            const a2 = this.a * this.a;
            str = "\\frac{" + str + "}{" + a2 + "}";
        }

        let str2;
        if (!y0.isZero()) {
            str2 = "\\left( y ";
            if (!y0.isNegative()) {
                str2 += " + ";
            }                
            str2 += y0.toTeX() + " \\right)^2" 
        } else {
            str2 = "y^2";
        }   
        if (this.b !== 1) {
            const b2 = this.b * this.b;
            str2 = "\\frac{" + str2 + "}{" + b2 + "}";
        }
        return str + "+" + str2 + "=1";
    }
}

export class Hiperbola extends Conics {
    constructor(O: Point, a: number, b: number) {
        super(O, a, b, Math.sqrt(a*a+b*b));
    }

    toTeX(): string {
        const x0 = this.O.components[0].oposite();
        const y0 = this.O.components[1].oposite();
        let str;
        if (!x0.isZero()) {
            str = "\\left( x ";
            if (!x0.isNegative()) {
                str += " + ";
            }                
            str += x0.toTeX() + " \\right)^2 +" 
        } else {
            str = "x^2";
        }   
        if (this.a !== 1) {
            const a2 = this.a * this.a;
            str = "\\frac{" + str + "}{" + a2 + "}";
        }

        let str2;
        if (!y0.isZero()) {
            str2 = "\\left( y ";
            if (!y0.isNegative()) {
                str2 += " + ";
            }                
            str2 += y0.toTeX() + " \\right)^2" 
        } else {
            str2 = "y^2";
        }   
        if (this.b !== 1) {
            const b2 = this.b * this.b;
            str2 = "\\frac{" + str2 + "}{" + b2 + "}";
        }
        return str + "-" + str2 + "=1";
    }
}

export class Parabola extends Conics {
    d: Line;
    constructor(O: Point, d: Line) {
        super(O, 1, 1, 1);
        this.d = d;
    }
 
    toTeX(): string {
        return "Not implemented";
    }
}
 
