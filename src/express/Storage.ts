export interface Storage {
    clear(): Promise<number>;
    load(uid: string): Promise<any>;
    save(json: any, idUser?: number, save?: number): Promise<string>;
}