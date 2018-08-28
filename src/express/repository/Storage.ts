import { WsExportTypes } from "../../worksheet/wsExporter";

export interface Storage {     
    load(uid?: string): Promise<any>;
    delete(uid: string): Promise<any>;
    save(json: any, idUser?: number): Promise<string>;
    update(sid: string, json: any): Promise<number>;

    loadGenerated(uid: string, seed?: string, format?: WsExportTypes, keysType?: number): Promise<any>;
    saveGenerated(uid: string, seed: string, fullname: string, format: WsExportTypes, doc: string | Buffer, keysType: number): Promise<string>;
    emptyGenerated(uid: string, seed?: string): Promise<number>;
    userByUsername(username: string): Promise<any>;
    userByIdUser(idUser: string): Promise<any>;
    listTemplatesByUser(idUser: string): Promise<any>;
    
}