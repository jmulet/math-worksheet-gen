import { AbstractDocumentTree } from "../interfaces/AbstractDocumentTree";


export function wsExporterHtml (adt: AbstractDocumentTree, opts: any): string {

const PREAMBLE = `
<!DOCTYPE html>
<html>
<head>
<title>${adt.title || 'wsMath' }</title>
<meta charset="utf-8">
<meta author="${adt.author}">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.9.0/dist/katex.min.css" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/katex@0.9.0/dist/katex.min.js" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.9.0/contrib/auto-render.min.js" integrity="sha384-IiI65aU9ZYub2MY9zhtKd1H2ps7xxf+eb2YFG9lX6uRqpXCvBTOidPRCXCrQ++Uc" crossorigin="anonymous"></script>
<script type="text/javascript" charset="UTF-8" src="//cdnjs.cloudflare.com/ajax/libs/jsxgraph/0.99.3/jsxgraphcore.js"></script>
<style>
.olsection:first-of-type { counter-reset: sectioncounter }           
.olsection > li { counter-increment: sectioncounter; list-style-type: none; }
.olsection > li:before { 
   margin-left: -30px;
   font-size: 120%;
   font-weight: bold;
   content: counter(sectioncounter) ". "; 
}
.olactivity:first-of-type { 
   counter-reset: activitycounter;
   margin-left: -10px; }           
.olactivity > li { counter-increment: activitycounter; list-style-type: none; font-weight: 'bold' }       
.olactivity > li:before { 
   content: counter(activitycounter) ". "; 
}
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
    margin-left: -10px;
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
        font-size: 90%;
    }
    h2 {
        font-size: 90%;
    } 
    h3 {
        font-size: 90%;
    }  
    h4 {
        font-size: 90%;
    } 
    @page {
        margin: 1.5cm 1cm;
    }
    .activity-formulation {
        font-size: 12px;
    }
    .arial-large {
        font-size: 16px;
    }
    .question-formulation {
        font-size: 12px;
    }
 }
</style>
</head>
<body>
`;


 const builder = [PREAMBLE];


 builder.push("</body>\n</html>");
 return builder.join("\n");

}