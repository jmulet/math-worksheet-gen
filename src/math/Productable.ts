import { Numeric } from "./Numeric"; 
import { Expression } from "./Expression";

export interface Productable {
    multiply(b: Numeric | Expression)
}