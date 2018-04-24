import { Polynomial } from "./Polynomial";

/**
 * We define an algebraic fraction as the quotient of two Polynomials
 */
export class AlgebraicFraction {
    constructor(private polyNum: Polynomial, private polyDen: Polynomial) {        
    }
}