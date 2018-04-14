import { Productable } from "./Productable";
import { Numeric } from "./Numeric";

/**
 * Wrapper around expression language
 * Monomial
 * Monomial list
 * polynomial
 */
export abstract class Expression implements Productable {
    multiply(b: Expression | Numeric) {         
    }
}