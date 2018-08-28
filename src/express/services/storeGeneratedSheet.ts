import { Storage } from "../repository/Storage";  
import { Worksheet } from "../../interfaces/WsMathGenOpts";
import { WsExportTypes } from "../../worksheet/wsExporter";

/**
 * Types that can be stored in the database structure; all other will be generated every time
 */
const STORABLE_TYPES = ["json", "latex", "html", "pdf"]; 

/**
 * This service is responsible for storing a given generated sheet into the database if the type is storable of course
 */
export async function storeGeneratedSheets(workbook: Worksheet, sheets: {[s in WsExportTypes]?: string | Buffer}, storage: Storage): Promise<string> {
    const uid: string = workbook.sid;
    const seed: string = workbook.seed;
    const fullname: string = workbook.fullname;

    const promises = [];

    Object.keys(sheets).forEach( (type: WsExportTypes) => {
        if (STORABLE_TYPES.indexOf(type) >= 0) {            
            const sheet = sheets[type];
            promises.push(storage.saveGenerated(uid, seed, fullname, type, sheet, workbook.includeKeys));
        }    
    });

    
    const [errs, updates] = await Promise.all(promises);

    return updates.reduce( (a, b) => a + b, 0 );
}
