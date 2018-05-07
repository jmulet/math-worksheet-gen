import { Worksheet, WsMathGenOpts } from '../interfaces/WsMathGenOpts';
import { Container } from '../util/WsGenerator';
import { WsSection } from './WsSection';
import * as path from 'path';
import { importClassesFromDirectories } from '../util/importClassesFromDirectories';
import { Random } from '../util/Random';
 
 
 // Load all generators
const topics = path.resolve('src//topics/');
const genClasses = importClassesFromDirectories([path.join(topics,'/algebra/**/*.ts'), 
                                                 path.join(topics, '/algebra/**/*.js'),
                                                 path.join(topics, '/arithmetics/**/*.ts'),
                                                 path.join(topics, '/arithmetics/**/*.js'),
                                                 path.join(topics, '/calculus/**/*.ts'),
                                                 path.join(topics, '/calculus/**/*.js'),
                                                 path.join(topics, '/geometry/**/*.ts'),
                                                 path.join(topics, '/geometry/**/*.js'),
                                                 path.join(topics, '/probability/**/*.ts'),
                                                 path.join(topics, '/probability/**/*.js'),
                                                 path.join(topics, '/statistics/**/*.ts'),
                                                 path.join(topics, '/statistics/**/*.js')
                                                ]);
console.log("WsMathGenerator:: Loaded generator classes ...");
console.log(genClasses.map( (clazz) => clazz.name ).join(", "));

export enum WsExportFormats {
    LATEX = 0,
    HTML = 1,
    PDF = 2,    
}

/*
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
*/
 
export class WsMathGenerator { 
    worksheet: Worksheet;
    rand: Random;
    showKeys: boolean = false;
    sections: WsSection[] = [];
    wsGenOpts: WsMathGenOpts;

 
    constructor(wsGenOpts?: WsMathGenOpts) {
        this.wsGenOpts = wsGenOpts;
        if (!wsGenOpts.rand) {
            const seed = (wsGenOpts.seed || new Date().getTime()).toString(36);
            this.rand = new Random(seed);
            wsGenOpts.rand = this.rand;
        }

        if (wsGenOpts.worksheet) {
            this.create(wsGenOpts.worksheet);
        }
    }

    create(worksheet: Worksheet) {
        this.worksheet = worksheet;
        worksheet.sections.forEach( (section) => {
            const sec = this.addSection(section.name);
            section.activities.forEach( (activity) => {               
                let clazz = null;
                if (activity.gen) {
                    clazz = (Container[activity.gen] || {}).clazz;
                } 
                const act = sec.createActivity(activity.formulation, activity.scope, clazz, activity.options);
                activity.questions.forEach( (question) => {
                        let clazz = (Container[question.gen] || {}).clazz;
                        if(clazz) {
                            act.useRepeat(clazz, question.options || {}, question.repeat || 1, activity.scope!=null);
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

        if (this.worksheet) {
            if (this.worksheet.title) {
                latex.push("\\begin{center}\\large \\textbf{" + this.worksheet.title + "} \\end{center}\n");
            }
            if (this.worksheet.instructions) {
                latex.push("" + this.worksheet.instructions + "");
            }

            latex.push("\n \\textbf{Referència:} " + this.rand.seed + ". \\textbf{Nom i llinatges:} ........................................................ \n");
        }


        this.sections.forEach((section) => {
            latex.push(...section.toLaTeX());
        })

        if (this.showKeys) {
            latex.push("  \\section*{Respostes}");
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
           .olsection:first-of-type { counter-reset: sectioncounter }           
           .olsection > li { counter-increment: sectioncounter; list-style-type: none; }
           .olsection > li:before { 
               font-size: 120%;
               font-weight: bold;
               content: counter(sectioncounter) ". "; 
            }

           .olactivity:first-of-type { counter-reset: activitycounter }           
           .olactivity > li { counter-increment: activitycounter; list-style-type: none; }       
           .olactivity > li:before { content: counter(activitycounter) ". "; }

            .olalpha {
                counter-reset: alphacounter;
                margin: 10px; 
                font-size: 120%;
            }
            
            .olalpha > li {
                list-style: none;
                position: relative;
                margin-bottom: 15px;
            }
            
            .olalpha > li:before {
                counter-increment: alphacounter;
                content: counter(alphacounter, lower-alpha) ") ";
                position: absolute;
                left: -1.4em; 
            }
            
            .arial {
                font-family: Arial, Helvetica, sans-serif;
            }

            .instructions {                
                border: 2px solid blue;
                border-radius: 5px;
                background-color: rgb(220,250,255);
                width: 90%;
                padding: 10px;
                font-size: 110%;
            }
           `,
            '</style>',
            "</head>",
            "<body>"
        ];

        if (this.worksheet) {
            if (this.worksheet.title) {
                code.push("<h2 class=\"arial\" style=\"color:blue;text-align:center;\"><b>" + this.worksheet.title + "</b></h2>")
            }
            if (this.worksheet.instructions) {
                code.push("<center><div class=\"arial instructions\">" + this.worksheet.instructions + "</div></center>")
            }

            code.push("<p class=\"arial\"><b>Referència:</b> " + this.rand.seed + ". <b>Nom i llinatges:</b> ........................................................</p>")
        }

        let activityCounter = 1;
        this.sections.forEach((section) => {
            code.push(...section.toHtml(activityCounter));
            activityCounter += section.activities.length;
        })

        if (this.showKeys) {
            activityCounter = 1;
            code.push("<hr/><h4><b>Respostes</b></h4>");
            code.push("  <ol>");
            this.sections.forEach((section) => {
                code.push(...section.answersToHtml(activityCounter));
                activityCounter += section.activities.length;
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