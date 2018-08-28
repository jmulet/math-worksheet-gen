import { AbstractDocumentTree } from "../interfaces/AbstractDocumentTree";
import { wsExporterHtml } from "./wsExporterHtml";
import { wsExporterLatex } from "./wsExporterLatex";
import { wsExporterMoodleXml } from "./wsExporterMoodleXml";

export type WsExportTypes = "html" | "latex" | "pdf" | "moodlexml" | "odt" | "docx" | "json";
    
const i18n_TRANSLATIONS = {
    "en": {
        "ANSWERS": "Answers",
        "REFERENCE": "Reference",
        "NAME": "Name and surname"
    },
    "es": {
        "ANSWERS": "Respuestas",
        "REFERENCE": "Referencia",
        "NAME": "Nombre y apellidos"
    }, 
    "ca": {
        "ANSWERS": "Respostes",
        "REFERENCE": "Reference",
        "NAME": "Nom i llinatges"
    }
};

export function i18n(key: string, lang: string): string {
    const dict = i18n_TRANSLATIONS[lang] || i18n_TRANSLATIONS["en"];
    return dict[key] || key || "";
}

/**
 * The purporse of this class is to export the AbstractDocumentTree to a human readable format
 * 
 * wsEditor ---> sheetDefinition ---> wsMathGenerator ---> ADT ---> wsExporter ---> output document
 */
export function wsExporter(adt: AbstractDocumentTree, type: WsExportTypes, options?: any): string {

            const opts = { lang: "ca", includeKeys: 0, keysPlacement: 0, ...options}; 

            if (type === "html") {
                return wsExporterHtml(adt, opts);               
            } else if (type === "moodlexml") {
                return wsExporterMoodleXml(adt, opts);
            } if (type === "json") {
                return JSON.stringify(adt, null, 2);
            } else {
                return wsExporterLatex(adt, opts);
            }    
};