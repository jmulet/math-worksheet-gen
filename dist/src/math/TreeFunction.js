"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mathjs = require("mathjs");
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
class TreeFunction {
    constructor(rnd) {
        this.rnd = rnd;
        const customFunctions = {
            root: function (n, x) {
                return Math.pow(x, 1 / n);
            },
            logb: function (x, b) {
                return Math.log(x) / Math.log(b);
            }
        };
        customFunctions.root.toTex = function (node, options) {
            return "\\sqrt[" + node.args[0].toTex(options) + "]{" + node.args[1].toTex(options) + "}";
        };
        customFunctions.logb.toTex = function (node, options) {
            return "\\log_{" + node.args[1].toTex(options) + "} {" + node.args[0].toTex(options) + "}";
        };
        mathjs['import'](customFunctions);
    }
    /**
     *
     * @param depth Maxium depth of the tree
     * @param opts can be a common object for all depths or an array to fine tune every depth
     */
    randomNode(depth, parentNode, opts, currentDepth) {
        const mathjsNode = mathjs.expression["node"];
        let userOpts = opts;
        if (opts && Array.isArray(opts)) {
            userOpts = opts[opts.length - currentDepth || 0];
            if (!userOpts) {
                userOpts = opts[0];
            }
        }
        const options = Object.assign({ range: 10, operationNodes: ['+', '*', '/', '^'], functionNodes: ['sqrt', 'ln', 'log10', 'cos', 'sin', 'tan'], constantNodes: ['pi', 'e'], symbolNodes: ['x'] }, userOpts);
        parentNode = parentNode || new mathjsNode.SymbolNode(this.rnd.pickOne(options.symbolNodes));
        /*
                const kindOfNode = this.rnd.pickOne([0, 1, 2, 3]);
                if (kindOfNode === 0 && currentDepth < depth) {
                    // operation
                    const op = this.rnd.pickOne(options.operationNodes);
                    const opName = OP_NAMES[op];
                    const node3 = new mathjsNode.OperatorNode(op, opName, [node1, node2]);
                } else if (kindOfNode === 1) {
                    // function
                    
                } else if (kindOfNode === 2) {
                    // constant
                    
                } else {
                    // symbol
                    const node2 = new mathjsNode.SymbolNode(this.rnd.pickOne(options.symbolNodes));
                }
        */
        const node1 = new mathjsNode.ConstantNode(this.rnd.intBetweenNotZero(-options.range, options.range));
        const node2 = new mathjsNode.SymbolNode(this.rnd.pickOne(options.symbolNodes));
        const op = this.rnd.pickOne(options.operationNodes);
        const opName = OP_NAMES[op];
        const node3 = new mathjsNode.OperatorNode(op, opName, [node1, node2]);
        return new mathjsNode.FunctionNode(this.rnd.pickOne(options.functionNodes), [node3]);
    }
    monomialNode(degree, coeff, xnode) {
        const mathjsNode = mathjs.expression["node"];
        const coeffNode = new mathjsNode.ConstantNode(coeff);
        if (degree > 1) {
            const degreeNode = new mathjsNode.ConstantNode(degree);
            const pNode = this.powerNode(xnode, degreeNode);
            if (coeff === 1) {
                return pNode;
            }
            else {
                const node = new mathjsNode.OperatorNode("*", "multiply", [coeffNode, pNode]);
                node.implicit = true;
                return node;
            }
        }
        else if (degree === 1) {
            if (coeff === 1) {
                return xnode;
            }
            else {
                const node = new mathjsNode.OperatorNode("*", "multiply", [coeffNode, xnode], { implicit: true });
                node.implicit = true;
                return node;
            }
        }
        else if (degree === 0) {
            return coeffNode;
        }
    }
    polynomialNode(degree = 2, range = 10, xnode) {
        const ops = ['+', '-'];
        const mathjsNode = mathjs.expression["node"];
        xnode = xnode || new mathjsNode.SymbolNode('x');
        const coefs = this.rnd.intList(degree + 1, 0, range);
        coefs[0] = this.rnd.intBetweenNotZero(1, range);
        const monomials = coefs.map((coef, i) => this.monomialNode(degree - i, Math.abs(coef), xnode));
        let poly = monomials[0];
        monomials.forEach((m, i) => {
            if (i > 0 && coefs[i] !== 0) {
                const op = this.rnd.pickOne(ops);
                poly = new mathjsNode.OperatorNode(op, OP_NAMES[op], [poly, m]);
            }
        });
        return poly;
    }
    powerNode(baseNode, expNode, range = 10) {
        const mathjsNode = mathjs.expression["node"];
        baseNode = baseNode["cloneDeep"]() || new mathjsNode.SymbolNode('x');
        expNode = expNode["cloneDeep"]() || new mathjsNode.ConstantNode(this.rnd.intBetween(2, range));
        return new mathjsNode.OperatorNode("^", "pow", [baseNode, expNode]);
    }
    divisionNode(numNode, denNode) {
        const mathjsNode = mathjs.expression["node"];
        return new mathjsNode.OperatorNode("/", "divide", [numNode, denNode]);
    }
    rationalNode(degreeNum = 2, degreeDen = 2, range = 10) {
        const mathjsNode = mathjs.expression["node"];
        return this.divisionNode(this.polynomialNode(degreeNum, range), this.polynomialNode(degreeNum, range));
    }
    irrationalNode(index = 2, exponent = 1, xnode) {
        const mathjsNode = mathjs.expression["node"];
        const indexNode = new mathjsNode.ConstantNode(index);
        xnode = xnode || new mathjsNode.SymbolNode('x');
        if (exponent !== 1) {
            const exponentNode = new mathjsNode.ConstantNode(exponent);
            xnode = new mathjsNode.OperatorNode("^", "pow", [xnode, exponentNode]);
        }
        return new mathjsNode.FunctionNode("root", [indexNode, xnode]);
    }
    logNode(base = 'e', xnode) {
        const mathjsNode = mathjs.expression["node"];
        const baseNode = new mathjsNode.ConstantNode(base);
        xnode = xnode || new mathjsNode.SymbolNode('x');
        if (base === 'e') {
            return new mathjsNode.FunctionNode("ln", [xnode]);
        }
        else if (base === 10) {
            return new mathjsNode.FunctionNode("log10", [xnode]);
        }
        else {
            return new mathjsNode.FunctionNode("logb", [xnode, baseNode]);
        }
    }
    toString(node) {
        return node.toString();
    }
    toTeX(node) {
        return node.toTex().replace(/\\tan/g, "\\mathrm{tg}\\, ");
    }
}
exports.TreeFunction = TreeFunction;
//# sourceMappingURL=TreeFunction.js.map