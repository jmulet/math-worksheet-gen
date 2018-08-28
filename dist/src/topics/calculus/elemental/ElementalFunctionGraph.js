"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WsGenerator_1 = require("../../../util/WsGenerator");
const Random_1 = require("../../../util/Random");
let ElementalFunctionGraph = class ElementalFunctionGraph {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        let domain = qGenOpts.question.domain || 'Z';
        const complexity = qGenOpts.question.complexity || 0;
        const types = qGenOpts.question.types || [0, 1];
        if (rnd.intBetween(0, 1) === 0) {
            domain = 'Z';
        }
        this.fun = rnd.elementalFunction(types, { range: r, complexity: complexity, domain: domain });
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            return "$y = " + this.fun.toTeX() + "$";
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                const uid = "box" + Math.random().toString(32).substr(2);
                const [xmin, ymin, xmax, ymax] = this.fun.getBoundingBox();
                return `<div id="${uid}" class="jxgbox" style="width:400px; height:400px; display: inline-block"></div>
                <script>
                    var board = JXG.JSXGraph.initBoard("${uid}",
                                {axis:true, boundingbox:[${xmin}, ${ymax}, ${xmax}, ${ymin}], showCopyright: false});
     
                    var f = board.jc.snippet("${this.fun.toString()}", true, 'x', true);
                    var curve = board.create('functiongraph',[f,
                                              function(){
                                                var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[0,0],board);
                                                return c.usrCoords[1];
                                              },
                                              function(){
                                                var c = new JXG.Coords(JXG.COORDS_BY_SCREEN,[board.canvasWidth,0],board);
                                                return c.usrCoords[1];
                                              }
                                            ]);
                    var q = board.create('glider', [2, 1, curve], {withLabel:false});
                </script>`;
            */
            return null;
        });
    }
};
ElementalFunctionGraph = __decorate([
    WsGenerator_1.WsGenerator({
        category: "calculus/elemental/graph",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "domain",
                defaults: 'Z',
                description: "Number domain"
            },
            {
                name: "types",
                defaults: [0, 1],
                description: "List of type names of the desired types  Lineal: 0, Quadratic: 1, Radical: 2, Hyperbole: 3, Exponential: 4, Logarithm: 5, Trigonometric: 6 "
            },
            {
                name: "complexity",
                defaults: 0,
                description: "When set to 0 parabolas have a simpler vertex form"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], ElementalFunctionGraph);
exports.ElementalFunctionGraph = ElementalFunctionGraph;
//# sourceMappingURL=ElementalFunctionGraph.js.map