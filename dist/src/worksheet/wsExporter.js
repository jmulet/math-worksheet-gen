"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wsExporterHtml_1 = require("./wsExporterHtml");
const wsExporterLatex_1 = require("./wsExporterLatex");
const wsExporterMoodleXml_1 = require("./wsExporterMoodleXml");
const i18n_TRANSLATIONS = {
    "en": {
        "ANSWERS": "Answers",
        "REFERENCE": "Reference",
        "NAME": "Name and surname",
        "NO_ANSWER": "Manual correction"
    },
    "es": {
        "ANSWERS": "Respuestas",
        "REFERENCE": "Referencia",
        "NAME": "Nombre y apellidos",
        "NO_ANSWER": "Correción manual"
    },
    "ca": {
        "ANSWERS": "Respostes",
        "REFERENCE": "Reference",
        "NAME": "Nom i llinatges",
        "NO_ANSWER": "Correció manual"
    }
};
function i18n(key, lang) {
    const dict = i18n_TRANSLATIONS[lang] || i18n_TRANSLATIONS["en"];
    return dict[key] || key || "";
}
exports.i18n = i18n;
/**
 * The purporse of this class is to export the AbstractDocumentTree to a human readable format
 *
 * wsEditor ---> sheetDefinition ---> wsMathGenerator ---> ADT ---> wsExporter ---> output document
 */
function wsExporter(adt, type, options) {
    const opts = Object.assign({ lang: "ca", includeKeys: 0, keysPlacement: 0 }, options);
    if (type === "html") {
        return wsExporterHtml_1.wsExporterHtml(adt, opts);
    }
    else if (type === "moodlexml") {
        return wsExporterMoodleXml_1.wsExporterMoodleXml(adt, opts);
    }
    if (type === "json") {
        return JSON.stringify(adt, null, 2);
    }
    else {
        return wsExporterLatex_1.wsExporterLatex(adt, opts);
    }
}
exports.wsExporter = wsExporter;
;
//# sourceMappingURL=wsExporter.js.map