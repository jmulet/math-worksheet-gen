export interface Storage {
    clear(): Promise<number>;
    load(uid: string): Promise<any>;
    delete(uid: string): Promise<any>;
    save(json: any, idUser?: number, save?: number): Promise<string>;
    update(sid: string, json: any): Promise<number>;

    loadGenerated(uid: string, seed?: string): Promise<any>;
    saveGenerated(uid: string, seed: string, format: "html" | "latex" | "pdf", doc: string | Buffer, docWithKeys: string | Buffer): Promise<string>;
    userByUsername(username: string): Promise<any>;
    userByIdUser(idUser: string): Promise<any>;
    listTemplatesByUser(idUser: string): Promise<any>;
    
}