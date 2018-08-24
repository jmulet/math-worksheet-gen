import { Storage } from "../repository/Storage"; 
import { SheetStruct } from "./generateSheet";

/**
 * Types that can be stored in the database structure; all other will be generated every time
 */
const STORABLE_TYPES = ["latex", "html", "pdf"];

/**
 * This service is responsible for storing a given generated sheet into the database if the type is storable of course
 */
export async function storeGeneratedSheet(sheetInstance: SheetStruct, storage: Storage): Promise<string> {
    let nupdates: string;
    let type = (sheetInstance.workbook.type || "").toLowerCase().trim();
    if (type == "tex") {
        type = "latex";
    }
    const uid: string = sheetInstance.uid;
    const seed: string = sheetInstance.workbook.seed;

    if (STORABLE_TYPES.indexOf(type) >=0) {
        //uid: string, seed: string, format: "html" | "latex", doc: string, docWithKeys: string
        nupdates =  await storage.saveGenerated(uid, seed, type, sheetInstance.sheet, sheetInstance.sheetWithkeys);
    }
    return nupdates;
}
