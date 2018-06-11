export interface Storage {
    clear(): Promise<number>;
    load(uid: string): Promise<any>;
    save(json: any, idUser?: number, save?: number): Promise<string>;
    userByUsername(username: string): Promise<any>;
    userByIdUser(idUser: string): Promise<any>;
}