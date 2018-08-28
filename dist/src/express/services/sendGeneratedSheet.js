"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendGeneratedSheet(type, sheet, res) {
    if (sheet instanceof Buffer) {
        if (type === "pdf") {
            res.setHeader("Content-type", "application/pdf");
        }
        else if (type === 'odt') {
            res.setHeader("Content-type", "application/vnd.oasis.opendocument.text");
        }
        else if (type === 'docx') {
            //.doc      application/msword
            //.docx     application/vnd.openxmlformats-officedocument.wordprocessingml.document
            res.setHeader("Content-type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        }
        res.send(sheet);
    }
    else if (type === 'html') {
        res.setHeader("Content-type", "text/html");
        res.status(200).send(sheet);
    }
    else if (type === 'json') {
        res.setHeader("Content-type", "application/json");
        res.status(200).send(sheet);
    }
    else {
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(sheet);
    }
}
exports.sendGeneratedSheet = sendGeneratedSheet;
//# sourceMappingURL=sendGeneratedSheet.js.map