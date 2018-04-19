 
import { WsSection } from "./WsSection"; 
import  * as Random from 'random-seed'; 
import { FractionOpGen } from "../topics/arithmetics/FractionOpGen";
import { WsMathGenOpts, Worksheet } from "../interfaces/WsMathGenOpts";
import { PolyDivision } from "../topics/algebra/polynomials/PolyDivision";
import { Container } from "../util/WsGenerator";
import { PolyIdentities } from "../topics/algebra/polynomials/PolyIdentities";
import { PolyCommonFactor } from "../topics/algebra/polynomials/PolyCommonFactor";
import { PolyFactorize } from "../topics/algebra/polynomials/PolyFactorize";
import { ScalarProduct } from "../topics/geometry/vectors/ScalarProduct";
 

export enum WsExportFormats {
    LATEX = 0,
    HTML = 1,
    PDF = 2,    
}

export const WsTopics = {
    Algebra: {
        Polynomial: {
            Division: PolyDivision,
            Identitities: PolyIdentities,
            CommonFactor: PolyCommonFactor,
            Factorize: PolyFactorize
        }
    },
    Arithmetics: {
        FractionOp: FractionOpGen
    },
    Geometry: {
        Vectors: {
            ScalarProduct: ScalarProduct
        }
    }
};
 
export class WsMathGenerator { 
    rand: Random.RandomSeed;
    showKeys: boolean = false;
    sections: WsSection[] = [];
    wsGenOpts: WsMathGenOpts;

 
    constructor(wsGenOpts?: WsMathGenOpts) {
        this.wsGenOpts = wsGenOpts;
        if (!wsGenOpts.rand) {
            const seed = (wsGenOpts.seed || new Date().getTime()).toString(36);
            this.rand = Random.create(seed);
            wsGenOpts.rand = this.rand;
        }

        if (wsGenOpts.worksheet) {
            this.create(wsGenOpts.worksheet);
        }
    }

    create(worksheet: Worksheet) {
        console.log(worksheet);

        worksheet.sections.forEach( (section) => {
            const sec = this.addSection(section.name);
            section.activities.forEach( (activity) => {
                const act = sec.createActivity(activity.formulation, activity.scope);
                activity.questions.forEach( (question) => {
                    const clazz = (Container[question.gen] || {}).clazz;
                    if(clazz) {
                        act.use(clazz, question.options || {}).repeat(question.repeat || 1);
                    } else {
                        console.log("Error:: generator clazz ", question, " not found");
                    }
                });
            });
            this.includeKeys(worksheet.includeKeys);
        })
    }
    
    addSection(title: string): WsSection {
        const section = new WsSection(title, {rand: this.rand});
        this.sections.push(section);
        return section;
    }

    includeKeys(showKeys: boolean) {
        this.showKeys = showKeys;
        return this;
    }

    exportAs(format: WsExportFormats) {

        switch(format) {
            case(WsExportFormats.LATEX):
                return this.exportLatex();                
            case(WsExportFormats.HTML):
                return this.exportHtml();                
            default:
                console.log("Unknown exporter");
        }

    }

    private exportLatex(){
        const latex = [
            "\\documentclass[a4paper]{article}",
            "\\usepackage{geometry}",
            "\\geometry{a4paper, total={170mm,257mm}, left=20mm, top=20mm}",
            "\\usepackage{tasks}",
            "\\usepackage{enumitem}",
            "\\usepackage{amsmath}",
            "\\begin{document}",           
        ];
        this.sections.forEach((section) => {
            latex.push(...section.toLaTeX());
        })

        if (this.showKeys) {
            latex.push("  \\section*{Answers}");
            latex.push("  \\begin{enumerate}");
            this.sections.forEach((section) => {
                latex.push(...section.answersToLaTeX());
            });
            latex.push("  \\end{enumerate}"); 
        }        
        latex.push("\\end{document}");
        return latex.join("\n");
    }    

    private exportHtml(){
        const code = [
            "<!DOCTYPE html>",
            "<html>",
            "<head>",
            "<title>Math worksheet generator</title>",
            ' <meta charset="utf-8"',
            '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.9.0/dist/katex.min.css" crossorigin="anonymous">',
            '<script src="https://cdn.jsdelivr.net/npm/katex@0.9.0/dist/katex.min.js" crossorigin="anonymous"></script>',
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/contrib/auto-render.min.js" integrity="sha384-IiI65aU9ZYub2MY9zhtKd1H2ps7xxf+eb2YFG9lX6uRqpXCvBTOidPRCXCrQ++Uc" crossorigin="anonymous"></script>',
            '<style>',
           `
            .olalpha {
            counter-reset: list;
            margin: 10px; 
            font-size: 120%;
            }
            
            .olalpha > li {
            list-style: none;
            position: relative; }
            
            .olalpha > li:before {
            counter-increment: list;
            content: counter(list, lower-alpha) ") ";
            position: absolute;
            left: -1.4em; }
           `,
            '</style>',
            "</head>",
            "<body>"
        ];

        /*
        ol li:before {
  content: counter(level1) ") "; 
  counter-increment: level1;
    }*/
        this.sections.forEach((section) => {
            code.push(...section.toHtml());
        })

        if (this.showKeys) {
            code.push("  <h4><b>Answers</b></h4>");
            code.push("  <ol>");
            this.sections.forEach((section) => {
                code.push(...section.answersToHtml());
            });
            code.push("   </ol>");            
        }

        code.push("<script>");
        code.push(" var options = {delimiters: [");
        code.push('     {left: "$", right: "$", display: false}, ');
        code.push('     {left: "\\[", right: "\\]", display: true}, ');
        code.push('     {left: "\\(", right: "\\)", display: false} ');
        code.push(' ]};');
        code.push(' document.addEventListener("DOMContentLoaded", function() {');
        code.push("   renderMathInElement(document.body, options);")
        code.push(" });");
        code.push("</script>");
        code.push("</body>");
        code.push("</html>");

        return code.join("\n");
    }    
}