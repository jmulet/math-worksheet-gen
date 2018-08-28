 

import { latexToPdf } from "../../util/latexToPdf"; 
import { latexToOOO } from "../../util/latexToOOO";
import { Worksheet } from "../../interfaces/WsMathGenOpts";
import { AbstractDocumentTree } from "../../interfaces/AbstractDocumentTree";
import { wsExporter, WsExportTypes } from "../../worksheet/wsExporter";
import { WsMathGenerator } from "../../worksheet/WsMathGenerator";

/**
 * A workbook is the definition of rules which will generate many Sheets
 */
 
const LATEX_FORMATS = ["tex", "latex", "pdf", "odt", "docx"];

export async function generateSheet(workbook: Worksheet, adt?: AbstractDocumentTree): Promise<{[k in WsExportTypes]: string | Buffer}> {     
    const type = workbook.type;

    const exporterOpts = {includeKeys: workbook.includeKeys, 
        keysPlacement: workbook.keysPlacement, sectionless: workbook.sectionless};

    let sheet = <{[k in WsExportTypes]: string | Buffer}> {};
 
    if (!adt) { 
        // Create abstract document tree
        const gen = new WsMathGenerator({seed: workbook.seed});
        adt = await gen.create(workbook);         
        //Add it to the generated types in order to be stored in database
        sheet["json"] = wsExporter(adt, "json", exporterOpts); 
    }

    if ( LATEX_FORMATS.indexOf(type) >= 0) {
        
        sheet["latex"] = wsExporter(adt, "latex", exporterOpts);

        if (type === "pdf") {
            try {
                sheet[type] = await latexToPdf(<string> sheet["latex"]);
            } catch(Ex) {
                console.log(Ex);
            }
        } else if (type === "odt" || type === "docx" ) {                            
                sheet[type] = await latexToOOO(<string> sheet["latex"], {type: type});                   
        }
    } else if (type !== 'json') {
        sheet[type] = wsExporter(adt, type, exporterOpts);
    }     

    return sheet;
}
