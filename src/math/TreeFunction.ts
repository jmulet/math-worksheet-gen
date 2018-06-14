import { Random } from "../util/Random";
import * as mathjs from "mathjs";
import { POINT_CONVERSION_HYBRID } from "constants";

const OP_NAMES = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '^': 'pow'
};

/**
 * Generates a function through a tree
 * Specifies the depth of the tree (number of iterations)
 * OperationNodes ['+', '*', '/', '^']
 * FunctionNodes ['sqrt', 'log', 'ln', 'cos', 'sin', 'tg']
 * ConstantNodes ['pi', 'e']
 * SymbolNodes ['x']
 */
export class TreeFunction {
 
    constructor (private rnd: Random) {
        const customFunctions: any = {
            root: function (n, x) {
              return Math.pow(x, 1/n);
            },
            logb: function (x, b) {
                return Math.log(x)/Math.log(b);
            }
        };

        customFunctions.root.toTex = function (node, options) { //handler function
            return "\\sqrt[" +  node.args[0].toTex(options) + "]{"+ node.args[1].toTex(options) + "}";
        };
        
        customFunctions.logb.toTex = function (node, options) { //handler function
            return "\\log_{" +  node.args[1].toTex(options) + "} {"+ node.args[0].toTex(options) + "}";
        };

        mathjs['import'](customFunctions);
  
    }

    randomNode(opts) {
        const options = { range: 10, 
            operationNodes:  ['+', '*', '/', '^'], 
            functionNodes: ['sqrt', 'ln', 'log10', 'cos', 'sin', 'tan'],
            constantNodes: ['pi', 'e'], 
            symbolNodes: ['x'],  
            ...opts };  

        const mathjsNode = mathjs.expression["node"];        
        const node1 = new mathjsNode.ConstantNode(this.rnd.intBetweenNotZero(-options.range, options.range));
        const node2 = new mathjsNode.SymbolNode(this.rnd.pickOne(options.symbolNodes));
        const op = this.rnd.pickOne(options.operationNodes);
        const opName = OP_NAMES[op];
        const node3 = new mathjsNode.OperatorNode(op, opName, [node1, node2]);
        return new mathjsNode.FunctionNode(this.rnd.pickOne(options.functionNodes), [node3]);
    }

    monomialNode(degree: number, coeff: Number, xnode?: mathjs.MathNode): mathjs.MathNode {
        const mathjsNode = mathjs.expression["node"];
        const coeffNode = new mathjsNode.ConstantNode(coeff);
        if (degree > 1) {
            const degreeNode = new mathjsNode.ConstantNode(degree);
            const pNode = this.powerNode(xnode, degreeNode);        
            if (coeff === 1) {
                return pNode;
            } else {
                const node = new mathjsNode.OperatorNode("*", "multiply", [coeffNode, pNode]);
                node.implicit = true; 
                return node;
            }
            
        } else if (degree === 1) {
            if (coeff === 1) {
                return xnode;
            } else {
                const node = new mathjsNode.OperatorNode("*", "multiply", [coeffNode, xnode], {implicit: true});
                node.implicit = true;
                return node;   
            }
        } else if (degree === 0) {
            return coeffNode;
        }
    }

    polynomialNode(degree=2, range=10, xnode?: mathjs.MathNode): mathjs.MathNode {
        const ops = ['+', '-'];
        const mathjsNode = mathjs.expression["node"]; 
        xnode = xnode || new mathjsNode.SymbolNode('x');
        const coefs = this.rnd.intList(degree + 1, 0, range);
        coefs[0] = this.rnd.intBetweenNotZero(1, range);
        const monomials = coefs.map( (coef, i) => this.monomialNode(degree-i, Math.abs(coef), xnode));
        console.log(monomials);
        let poly = monomials[0];
        monomials.forEach((m, i) => {
            if ( i > 0 && coefs[i] !== 0) {
                const op = this.rnd.pickOne(ops);
                poly = new mathjsNode.OperatorNode(op, OP_NAMES[op], [poly, m]);
            }
        })
        return poly;
    }

    powerNode(baseNode?: mathjs.MathNode | number | string, expNode?: mathjs.MathNode | number | string, range = 10): mathjs.MathNode {
        const mathjsNode = mathjs.expression["node"]; 
        baseNode = baseNode["cloneDeep"]() || new mathjsNode.SymbolNode('x');
        expNode = expNode["cloneDeep"]() || new mathjsNode.ConstantNode(this.rnd.intBetween(2, range));
        return new mathjsNode.OperatorNode("^", "pow", [baseNode, expNode]);
    }

    divisionNode(numNode?: mathjs.MathNode, denNode?: mathjs.MathNode): mathjs.MathNode {
        const mathjsNode = mathjs.expression["node"]; 
        return new mathjsNode.OperatorNode("/", "divide", [numNode, denNode]);
    }

    rationalNode(degreeNum=2, degreeDen=2, range=10): mathjs.MathNode {
        const mathjsNode = mathjs.expression["node"]; 
        return this.divisionNode(this.polynomialNode(degreeNum, range), this.polynomialNode(degreeNum, range));
    }

    irrationalNode(index=2, exponent=1, xnode?: mathjs.MathNode): mathjs.MathNode {
        const mathjsNode = mathjs.expression["node"]; 
        const indexNode = new mathjsNode.ConstantNode(index);
        xnode = xnode || new mathjsNode.SymbolNode('x');
        if (exponent !== 1) {
            const exponentNode = new mathjsNode.ConstantNode(exponent);
            xnode = new mathjsNode.OperatorNode("^", "pow", [xnode, exponentNode]);
        }
        return new mathjsNode.FunctionNode("root", [indexNode, xnode]);
    }

    logNode(base: string | number ='e', xnode?: mathjs.MathNode): mathjs.MathNode {
        const mathjsNode = mathjs.expression["node"]; 
        const baseNode = new mathjsNode.ConstantNode(base);
        xnode = xnode || new mathjsNode.SymbolNode('x');        
        if (base==='e') {
            return new mathjsNode.FunctionNode("ln", [xnode]);
        } else if (base === 10) {
            return new mathjsNode.FunctionNode("log10", [xnode]);
        } else {
            return new mathjsNode.FunctionNode("logb", [xnode, baseNode]);
        }        
    }
 
    toString(node: any): string {
        return node.toString();
    }
    
    toTeX(node: any): string {
        return node.toTex().replace(/\\tan/g, "\\mathrm{tg}\\, ");
    }
}