import {Response} from 'express' 

export function sendGeneratedSheet(type: string, sheet: string | Buffer, res: Response) {
    if (sheet instanceof Buffer) {
        res.setHeader("Content-type", "application/pdf");
        res.send(sheet);
    } else if (type === 'html') {
        res.setHeader("Content-type", "text/html");
        res.status(200).send(sheet);
    } else {
        res.setHeader("Content-type", "text/plain");
        res.status(200).send(sheet);
    }
}