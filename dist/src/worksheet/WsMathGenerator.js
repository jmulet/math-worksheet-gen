"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WsGenerator_1 = require("../util/WsGenerator");
const WsSection_1 = require("./WsSection");
const path = require("path");
const importClassesFromDirectories_1 = require("../util/importClassesFromDirectories");
const Random_1 = require("../util/Random");
const xmlBuilder = require("xmlbuilder");
// Load all generators
const topics = path.resolve('src/topics/');
const genClasses = importClassesFromDirectories_1.importClassesFromDirectories([path.join(topics, '/algebra/**/*.ts'),
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
    path.join(topics, '/statistics/**/*.js'),
    path.join(topics, '/special/**/*.ts'),
    path.join(topics, '/special/**/*.js')
]);
console.log("WsMathGenerator:: Loaded generator classes ...");
console.log(genClasses.map((clazz) => clazz.name).join(", "));
var WsExportFormats;
(function (WsExportFormats) {
    WsExportFormats[WsExportFormats["LATEX"] = 0] = "LATEX";
    WsExportFormats[WsExportFormats["HTML"] = 1] = "HTML";
    WsExportFormats[WsExportFormats["PDF"] = 2] = "PDF";
    WsExportFormats[WsExportFormats["MOODLEXML"] = 3] = "MOODLEXML";
})(WsExportFormats = exports.WsExportFormats || (exports.WsExportFormats = {}));
/**
 * <question type="multichoice|truefalse|shortanswer|matching|cloze|essay|numerical|description">
 <name>
     <text>Name of question</text>
 </name>
 <questiontext format="html">
     <text>What is the answer to this question?</text>
 </questiontext>
 .
 .
 .
</question>
 * @param quiz
 * @param formulation
 * @param type
 */
const createQuestion = function (quiz, formulation, type, answer, distractors) {
    type = type || "shortanswer";
    const questionNode = quiz.ele("question", { type: type });
    questionNode.ele("name").ele("text", {}, formulation + " [" + Math.random().toString(32).substring(2) + "] ");
    questionNode.ele("questiontext", { format: "html" }).ele("text").dat(formulation);
    let answerNode;
    switch (type) {
        case ("numerical"):
            answerNode = questionNode.ele("answer", { fraction: "100", format: "moodle_auto_format" });
            answerNode.ele("text", {}).dat(answer);
            answerNode.ele("feedback", { format: "html" }).ele("text", {}).dat("Correcte!");
            questionNode.ele("defaultgrade", {}, 1.0000000);
            questionNode.ele("penalty", {}, 0.3333333);
            questionNode.ele("hidden", {}, 0);
            questionNode.ele("tolerance", {}, 0.1);
            questionNode.ele("tolerancetype", {}, 1);
            break;
        case ("shortanswer"):
            answerNode = questionNode.ele("answer", { fraction: "100", format: "html" });
            answerNode.ele("text", {}).dat(answer);
            answerNode.ele("feedback", { format: "html" }).ele("text", {}).dat("Correcte!");
            break;
        case ("multiplechoice"):
            // Correct answer
            answerNode = questionNode.ele("answer", { fraction: "100", format: "html" });
            answerNode.ele("text", {}).dat(answer);
            answerNode.ele("feedback", { format: "html" }).ele("text", {}).dat("Correcte!");
            // Add distractors
            distractors.forEach((distract) => {
                answerNode = questionNode.ele("answer", { fraction: "-33.33333", format: "html" });
                answerNode.ele("text", {}).dat(distract);
                answerNode.ele("feedback", { format: "html" }).ele("text", {}).dat("Incorrecte!");
            });
            questionNode.ele("shuffleanswers", {}, 1);
            questionNode.ele("single", {}, "true");
            questionNode.ele("answernumbering", {}, "abc");
            break;
    }
};
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
class WsMathGenerator {
    constructor(wsGenOpts) {
        this.showKeys = false;
        this.sections = [];
        this.wsGenOpts = wsGenOpts;
        if (!wsGenOpts.rand) {
            const seed = (wsGenOpts.seed || new Date().getTime()).toString(36);
            this.rand = new Random_1.Random(seed);
            wsGenOpts.rand = this.rand;
        }
        wsGenOpts.uniqueQuestionsMap = {};
        // if (wsGenOpts.worksheet) {
        //     this.create(wsGenOpts.worksheet);
        // }
    }
    create(worksheet) {
        this.worksheet = worksheet;
        worksheet.sections.forEach((section) => {
            const sec = this.addSection(section.name);
            section.activities.forEach((activity) => {
                let clazz = null;
                if (activity.gen) {
                    clazz = (WsGenerator_1.Container[activity.gen] || {}).clazz;
                }
                activity.options = activity.options || {};
                activity.options.showFirstQuestionAnswer = worksheet.showFirstQuestionAnswer;
                const act = sec.createActivity(activity.formulation, activity.scope, clazz, activity.options);
                activity.questions.forEach((question) => {
                    let clazz = (WsGenerator_1.Container[question.gen] || {}).clazz;
                    // Special generators only allow for one repetition
                    if (question.gen.indexOf("special/") === 0) {
                        question.repeat = 1;
                    }
                    if (clazz) {
                        question.options.uniqueQuestionsMap = this.wsGenOpts.uniqueQuestionsMap;
                        act.useRepeat(clazz, question.options || {}, question.repeat || 1, question.type, activity.scope && Object.keys(activity.scope).length > 0);
                    }
                    else {
                        console.log("Error:: generator clazz ", question, " not found");
                    }
                });
            });
            this.includeKeys(worksheet.includeKeys);
        });
    }
    addSection(title) {
        const section = new WsSection_1.WsSection(title, { rand: this.rand });
        this.sections.push(section);
        return section;
    }
    includeKeys(showKeys) {
        this.showKeys = showKeys;
        return this;
    }
    exportAs(format) {
        switch (format) {
            case (WsExportFormats.LATEX):
                return this.exportLatex();
            case (WsExportFormats.HTML):
                return this.exportHtml();
            case (WsExportFormats.MOODLEXML):
                return this.exportMoodleXml();
            default:
                console.log("Unknown exporter");
        }
    }
    exportLatex() {
        const latex = [
            "\\documentclass[a4paper]{article}",
            "\\usepackage{geometry}",
            "\\geometry{a4paper, total={170mm,257mm}, left=20mm, top=20mm}",
            "\\usepackage{tasks}",
            "\\usepackage[utf8]{inputenc}",
            "\\usepackage[T1]{fontenc}",
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
            latex.push("\n \\textbf{Referència:} " + this.rand.seed + ". \\textbf{Nom i llinatges:} " +
                (this.worksheet.fullname ? this.worksheet.fullname :
                    "........................................................... \n"));
        }
        this.sections.forEach((section) => {
            latex.push(...section.toLaTeX());
        });
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
    exportHtml() {
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
            '<script type="text/javascript" charset="UTF-8" src="//cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.99.3/jsxgraphcore.js"></script>',
            `
            
            `,
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
           .olactivity > li { counter-increment: activitycounter; list-style-type: none; font-weight: 'bold' }       
           .olactivity > li:before { content: counter(activitycounter) ". "; }

            .olalpha {
                counter-reset: alphacounter;
                margin: 10px; 
                font-size: 110%;
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
            .activity-formulation {
                font-size: 120%;
            }
            .instructions {                
                border: 2px solid blue;
                border-radius: 5px;
                background-color: rgb(220,250,255);
                width: 90%;
                padding: 10px;
                font-size: 110%;
            }
            @media print {               
                .instructions {
                    font-size: 12px;
                }
                p {
                    font-size: 100%;
                }
                h2 {
                    font-size: 100%;
                } 
                h3 {
                    font-size: 100%;
                }  
                h4 {
                    font-size: 100%;
                } 
                @page {
                    margin: 1.5cm 1.5cm;
                }
                .activity-formulation {
                    font-size: 13px;
                }
                .arial-large {
                    font-size: 18px;
                }
                .question-formulation {
                    font-size: 12px;
                }
             }
             
           `,
            '</style>',
            "</head>",
            "<body>"
        ];
        if (this.worksheet) {
            if (this.worksheet.title) {
                code.push("<h2 class=\"arial arial-large\" style=\"color:blue;text-align:center;\"><b>" + this.worksheet.title + "</b></h2>");
            }
            if (this.worksheet.instructions) {
                code.push('<div class=\"instructions\"><p>' + this.worksheet.instructions.replace(/\n/g, "<br/>") + "</p></div>");
            }
            code.push("<p class=\"arial\"><b>Referència:</b> " + this.rand.seed + ". <b>Nom i llinatges:</b> " +
                (this.worksheet.fullname ? this.worksheet.fullname : "..........................................................</p>"));
        }
        let activityCounter = 1;
        this.sections.forEach((section) => {
            code.push(...section.toHtml(activityCounter));
            activityCounter += section.activities.length;
        });
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
        // code.push('     {left: "\\(", right: "\\)", display: false} ');
        code.push(' ]};');
        code.push(' document.addEventListener("DOMContentLoaded", function() {');
        code.push("   renderMathInElement(document.body, options);");
        code.push(" });");
        code.push("</script>");
        code.push("</body>");
        code.push("</html>");
        return code.join("\n");
    }
    exportMoodleXml() {
        var quiz = xmlBuilder.create('quiz', { encoding: 'utf-8' });
        this.sections.forEach((section) => {
            // Add a category           
            quiz.ele("question", { type: "category" }).ele("category").ele("text", {}, "$course$/" + section.title);
            section.activities.forEach((activity) => {
                activity.questions.forEach((question) => {
                    let formulation = activity.formulation.replace("\n", "<br/>");
                    formulation += ". " + question.toHtml();
                    const type = question.type;
                    createQuestion(quiz, formulation, type, question.answerToHtml(), question.distractorsHtml());
                });
            });
        });
        return quiz.end({ pretty: true });
    }
}
exports.WsMathGenerator = WsMathGenerator;
//# sourceMappingURL=WsMathGenerator.js.map