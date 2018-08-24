import * as mysql from 'mysql';
import * as shortid from 'shortid';
import { Storage } from './Storage';

const MConfig = require("../../../../micro-config.json");

const sqlListTemplate = "SELECT * FROM `wsmath` WHERE `idUser`=?";
const sqlDeleteTemplate1 = "DELETE FROM `wsmath` WHERE `uid`=? LIMIT 1;";
const sqlDeleteTemplate2 = "DELETE FROM `wsmath_generated` WHERE `uid`=?";
const sqlUpdateTemplate = "UPDATE `wsmath` SET `json`=? WHERE `uid`=?";

export class MysqlStorage implements Storage {

    async update(sid: string, json: any): Promise<number> {
        let connection;
        let nup = 0;
        try {
            connection = await this.getConnection();            
            const [err, results] = await this.queryAsync(connection, sqlUpdateTemplate, [JSON.stringify(json), sid]);  
            if (!err) {
                nup = results.affectedRows;
            } else {
                console.log(err);
            }
            
        } catch (Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
        return nup;
    }
    
    async delete(sid: string): Promise<any> { 
        const connection = await this.getConnection();
        let nup = 0;
        try{
            let [err, results] = await this.queryAsync(connection, sqlDeleteTemplate1, [sid]);
            nup += results.affectedRows;
            [err, results] = await this.queryAsync(connection, sqlDeleteTemplate2, [sid]);
            nup += results.affectedRows;
        } catch(Ex) {      
            console.log(Ex);      
        } finally {
            connection && connection.release();        
        }        
        return nup;
    }
    
    async listTemplatesByUser(idTeacher: string): Promise<any> {
        const connection = await this.getConnection();
        let list;
        try{
            const [err, results] = await this.queryAsync(connection, sqlListTemplate, [idTeacher]);
            if (err) {
                list = [];
            }
            list = results.map( e => {
                try {
                    e.json = JSON.parse(e.json);
                } catch(Ex){}
                return e;
            });
        } catch(Ex) {      
            console.log(Ex);      
        } finally {
            connection && connection.release();        
        }        
        return list;
    }

    async saveGenerated(uid: string, seed: string, format: "html" | "latex" | "pdf", doc: string | Buffer, docWithKeys: string | Buffer): Promise<string> {
        
        const found = await this.loadGenerated(uid, seed);
        let connection;
        try {
            connection = await this.getConnection();
            const post: any = {
                uid: uid,
                seed: seed,                
            };
            post[format] = doc;
            post[format+"_keys"] = docWithKeys;
            
            let sql;
            if (found) {
                sql = "UPDATE wsmath_generated SET ? WHERE id=" + found.id;
            } else {
                sql = "INSERT INTO wsmath_generated SET ?";
                post.created = new Date();
            }
            const [err, results, fields] = await this.queryAsync(connection, sql, post);
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
    /**
     * 
     * @param uid is the uid of the worksheet
     * @param seed is optional - if not set then generates the report of that worksheet
     */
    async loadGenerated(uid: string, seed: string): Promise<any> {
        let connection;
        try {
            connection = await this.getConnection();
            let sql, params;
            if (seed) {
                sql = "SELECT * FROM wsmath_generated WHERE uid=? AND seed=? ORDER BY id desc LIMIT 1 ";
                params = [uid, seed];
            } else {
                sql = "SELECT wsg.seed, max(wsg.created) as created, u.fullname, ws.json, ws.uid FROM wsmath_generated as wsg LEFT JOIN users as u ON u.username=wsg.seed INNER JOIN wsmath as ws ON ws.uid=wsg.uid WHERE wsg.uid=? group by u.id ORDER BY wsg.created, u.fullname";
                params = [uid];
            } 
            const [err, results] = await this.queryAsync(connection, sql, params);
            if (err) {
                console.log(err);
                return;
            }
            if (results.length) {
               if (seed) {                  
                    return results[0];
               } else {
                    return results;
                }
            } else {
                return null;
            }
        } catch(Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
        return seed? null: [];
    }
    

    pool: mysql.Pool;
    constructor()  {
        const config = {
            connectionLimit: MConfig.Pool.connectionLimit || 10,
            host: MConfig.Pool.host,
            user: MConfig.Pool.user,
            password: MConfig.Pool.password,
            database: MConfig.Pool.database
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
            let [err, results, fields]  = await this.queryAsync(connection, "SHOW TABLES LIKE 'wsmath'");
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
                            \`saved\` tinyint(11) NOT NULL DEFAULT '1',
                            \`opens\` datetime DEFAULT NULL,
                            \`keysOpens\` datetime DEFAULT NULL,
                            \`closes\` datetime DEFAULT NULL,
                            PRIMARY KEY (\`id\`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                    `;
                const [err, results, fields]  = await this.queryAsync(connection, sql);
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Created table wsmath");
            } else {
                console.log("OK table wsmath");
            }


            // Check if generated table has been created
            [err, results, fields]  = await this.queryAsync(connection, "SHOW TABLES LIKE 'wsmath_generated'");
            if (err) {
                console.log(err);
                return;
            }
            if (results.length === 0) {
                // Create a new table
                const sql = `
                        CREATE TABLE \`wsmath_generated\` (
                            \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
                            \`uid\` varchar(255) DEFAULT '',
                            \`seed\` varchar(255) DEFAULT '',
                            \`html\` longtext DEFAULT NULL,
                            \`html_keys\` longtext DEFAULT NULL,
                            \`latex\` longtext DEFAULT NULL,
                            \`latex_keys\` longtext DEFAULT NULL,
                            \`pdf\` longblob DEFAULT NULL,
                            \`pdf_keys\` longblob DEFAULT NULL,
                            \`created\` datetime DEFAULT NULL,                           
                            PRIMARY KEY (\`id\`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                    `;
                const [err, results, fields]  = await this.queryAsync(connection, sql);
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Created table wsmath_generated");
            } else {
                console.log("OK wsmath_generated table")
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
        let output = null;
        try {
            connection = await this.getConnection();
            const [err, results, fields] = await this.queryAsync(connection, "SELECT * FROM wsmath WHERE uid=? LIMIT 1", [uid]);
            if (err) {
                console.log(err); 
            } else if (results.length) {
                    results[0].json = JSON.parse(results[0].json);
                    output = results[0];                                    
            } else {
                return null;
            }
        } catch (Ex) {
            console.log(Ex);
        } finally {
            connection && connection.release();
        }
        return output;
    }

    async save(json: any, idUser = 0, save = 0): Promise<string> {
        let connection;
        try {
            connection = await this.getConnection();
            const uid = shortid.generate();  //sheet id
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