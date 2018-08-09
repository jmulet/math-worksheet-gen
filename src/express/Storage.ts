export interface Storage {
    clear(): Promise<number>;
    load(uid: string): Promise<any>;
    save(json: any, idUser?: number, save?: number): Promise<string>;
    loadGenerated(uid: string, seed?: string): Promise<any>;
    saveGenerated(uid: string, seed: string, format: "html" | "latex", doc: string, docWithKeys: string): Promise<string>;
    userByUsername(username: string): Promise<any>;
    userByIdUser(idUser: string): Promise<any>;
}