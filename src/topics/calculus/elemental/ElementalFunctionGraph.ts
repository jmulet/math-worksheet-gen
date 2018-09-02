import { WsGenerator } from '../../../util/WsGenerator';
import { QuestionGenInterface } from '../../../interfaces/QuestionGenInterface';
import { QuestionOptsInterface } from '../../../interfaces/QuestionOptsInterface'; 
import { Random } from '../../../util/Random'; 
import { ElementalFunctionInterface } from '../../../math/ElementalFunction'; 
import { WsDynImg } from '../../../interfaces/WsDynImg';

@WsGenerator({
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
})
export class ElementalFunctionGraph implements QuestionGenInterface {
    fun: ElementalFunctionInterface;
    graphics: WsDynImg[] = [];

    constructor(private qGenOpts: QuestionOptsInterface) {
        const rnd = qGenOpts.rand || new Random();
        const r = qGenOpts.question.interval || 10;
        let domain = qGenOpts.question.domain || 'Z';
        const complexity = qGenOpts.question.complexity || 0;
        const types = qGenOpts.question.types || [0, 1];
        if (rnd.intBetween(0, 1) === 0) {
            domain = 'Z';
        }
        this.fun = <ElementalFunctionInterface>rnd.elementalFunction(types, { range: r, complexity: complexity, domain: domain });

    }

    async getFormulation(): Promise<string> {
        return "$y = " + this.fun.toTeX() + "$";
    }

    async getAnswer(): Promise<string> {
        const [xmin, ymin, xmax, ymax] = this.fun.getBoundingBox();

        //Generate a png from a gnuplot script
      
        /**
        const script = `
        set samples 400
        set grid front
        set xlabel "x"
        set ylabel "y" norotate
        plot [${xmin}:${xmax}] [${ymin}:${ymax}] ${this.fun.toString().replace(/\^/g,"**")}
        `;**/
   
 
        //Generate a geogebra script
        const script = `f=${this.fun.toString()}\nSetColor(f,blue)\nZoomIn(${xmin},${ymin},${xmax},${ymax})`;
 
        const graph = new WsDynImg(script, "ggb", [400, 300]);
        this.graphics.push(graph);        
        return "![]("+graph.id+")";
    }
}


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
 