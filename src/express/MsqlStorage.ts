import * as mysql from 'mysql';
import * as uniqid from 'uniqid';
import { Storage } from './Storage';

export class MysqlStorage implements Storage {

    pool: mysql.Pool;
    constructor()  {
        const config = {
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'piworld'
        }
        this.pool = mysql.createPool(config);

        this.synchronizeDB();
    }

    async getConnection(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(function (err, connection) {
                if (err)  {
                    reject(err);
                    return;
                }
                resolve(connection);
            });
        });
    }

    async queryAsync(connection: mysql.Connection, sql: string, obj?: any): Promise<any> {
        return new Promise((resolve) => {
            connection.query(sql, obj, function (err, results, fields) {
                resolve([err, results, fields]);
            });
        });
    }


    async synchronizeDB() {
        let connection;
        try {
            connection = await this.getConnection();
            const [err, results, fields]  = await this.queryAsync(connection, "SHOW TABLES LIKE 'wsmath'");
            if (err) {
                console.log(err);
                return;
            }
            if (results.length === 0) {
                // Create a new table
                const sql = `
                        CREATE TABLE \`wsmath\` (
                            \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
                            \`uid\` varchar(255) DEFAULT '',
                            \`json\` json DEFAULT NULL,
                            \`idUser\` int(11) DEFAULT NULL,
                            \`created\` datetime DEFAULT NULL,
                            \`saved\` tinyint(11) NOT NULL DEFAULT '0',
                            PRIMARY KEY (\`id\`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                    `;
                const [err, results, fields]  = await this.queryAsync(connection, sql);
                if (err) {
                    console.log(err);
                    return;
                }
            }
        } catch (Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
    }

    async clear(): Promise<number> {
        let connection;
        try {
            connection = await this.getConnection();
            const [err, results, fields] = await this.queryAsync(connection, "DELETE FROM wsmath WHERE saved=0 AND created");
            if (err) {
                console.log(err);
                return;
            }
            return results.affectedRows;
        } catch (Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
    }

    async load(uid: string): Promise<any> {
        let connection;
        try {
            connection = await this.getConnection();
            const [err, results, fields] = await this.queryAsync(connection, "SELECT * FROM wsmath WHERE uid=? LIMIT 1", [uid]);
            
            if (err) {
                console.log(err);
                return;
            }
            if (results.length) {
                try{
                    const obj = JSON.parse(results[0].json);
                    return obj;
                } catch(Ex2) {
                    console.log(Ex2);
                    return null;
                }
            } else {
                return null;
            }
        } catch (Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
    }

    async save(json: any, idUser = 0, save = 0): Promise<string> {
        let connection;
        try {
            connection = await this.getConnection();
            const uid = uniqid();
            const post = {
                uid: uid,
                json: JSON.stringify(json),
                idUser: idUser,
                saved: save,
                created: new Date()
            };
            const [err, results, fields] = await this.queryAsync(connection, "INSERT INTO wsmath SET ?", post);
            if (err) {
                console.log(err);
                return;
            }
            if (results.affectedRows) {
                return uid;
            } else {
                return null;
            }
        } catch (Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
    }

    async userByUsername(username: string): Promise<any> {
        let connection;
        try {
            connection = await this.getConnection();
            const [err, results, fields] = await this.queryAsync(connection, "SELECT * FROM users WHERE username='"+username.trim()+"'");
            if (err) {
                console.log(err);
                return;
            }
            if (results.length) {
                return results[0];
            }
        } catch (Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
        return {};
    }

    async userByIdUser(idUser: string): Promise<any> {
        let connection;
        try {
            connection = await this.getConnection();
            const [err, results, fields] = await this.queryAsync(connection, "SELECT * FROM users WHERE id='"+idUser+"'");
            if (err) {
                console.log(err);
                return;
            }
            if (results.length) {
                return results[0];
            }
        } catch (Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
        return {};
    }
}