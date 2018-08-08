"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const uniqid = require("uniqid");
class MysqlStorage {
    saveGenerated(uid, seed, format, doc, docWithKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield this.loadGenerated(uid, seed);
            let connection;
            try {
                connection = yield this.getConnection();
                const post = {
                    uid: uid,
                    seed: seed,
                };
                post[format] = doc;
                post[format + "_keys"] = docWithKeys;
                let sql;
                if (found) {
                    sql = "UPDATE wsmath_generated SET ? WHERE id=" + found.id;
                }
                else {
                    sql = "INSERT INTO wsmath_generated SET ?";
                    post.created = new Date();
                }
                const [err, results, fields] = yield this.queryAsync(connection, sql, post);
                if (err) {
                    console.log(err);
                    return;
                }
                if (results.affectedRows) {
                    return uid;
                }
                else {
                    return null;
                }
            }
            catch (Ex) {
                console.log(Ex);
            }
            finally {
                connection && connection.release();
            }
        });
    }
    loadGenerated(uid, seed) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield this.getConnection();
                const [err, results, fields] = yield this.queryAsync(connection, "SELECT * FROM wsmath_generated WHERE uid=? AND seed=? ORDER BY id desc LIMIT 1 ", [uid, seed]);
                if (err) {
                    console.log(err);
                    return;
                }
                if (results.length) {
                    try {
                        return results[0];
                    }
                    catch (Ex2) {
                        console.log(Ex2);
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
            catch (Ex) {
                console.log(Ex);
            }
            finally {
                connection && connection.release();
            }
            return null;
        });
    }
    constructor() {
        const config = {
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'imaths'
        };
        this.pool = mysql.createPool(config);
        this.synchronizeDB();
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.pool.getConnection(function (err, connection) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(connection);
                });
            });
        });
    }
    queryAsync(connection, sql, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                connection.query(sql, obj, function (err, results, fields) {
                    resolve([err, results, fields]);
                });
            });
        });
    }
    synchronizeDB() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield this.getConnection();
                let [err, results, fields] = yield this.queryAsync(connection, "SHOW TABLES LIKE 'wsmath'");
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
                    const [err, results, fields] = yield this.queryAsync(connection, sql);
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Created table wsmath");
                }
                else {
                    console.log("OK table wsmath");
                }
                // Check if generated table has been created
                [err, results, fields] = yield this.queryAsync(connection, "SHOW TABLES LIKE 'wsmath_generated'");
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
                            \`created\` datetime DEFAULT NULL,                           
                            PRIMARY KEY (\`id\`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
                    `;
                    const [err, results, fields] = yield this.queryAsync(connection, sql);
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log("Created table wsmath_generated");
                }
                else {
                    console.log("OK wsmath_generated table");
                }
            }
            catch (Ex) {
                console.log(Ex);
            }
            finally {
                connection && connection.release();
            }
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield this.getConnection();
                const [err, results, fields] = yield this.queryAsync(connection, "DELETE FROM wsmath WHERE saved=0 AND created");
                if (err) {
                    console.log(err);
                    return;
                }
                return results.affectedRows;
            }
            catch (Ex) {
                console.log(Ex);
            }
            finally {
                connection && connection.release();
            }
        });
    }
    load(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield this.getConnection();
                const [err, results, fields] = yield this.queryAsync(connection, "SELECT * FROM wsmath WHERE uid=? LIMIT 1", [uid]);
                if (err) {
                    console.log(err);
                    return;
                }
                if (results.length) {
                    try {
                        results[0].json = JSON.parse(results[0].json);
                        const obj = results[0];
                        return obj;
                    }
                    catch (Ex2) {
                        console.log(Ex2);
                        return null;
                    }
                }
                else {
                    return null;
                }
            }
            catch (Ex) {
                console.log(Ex);
            }
            finally {
                connection && connection.release();
            }
        });
    }
    save(json, idUser = 0, save = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield this.getConnection();
                const uid = uniqid();
                const post = {
                    uid: uid,
                    json: JSON.stringify(json),
                    idUser: idUser,
                    saved: save,
                    created: new Date()
                };
                const [err, results, fields] = yield this.queryAsync(connection, "INSERT INTO wsmath SET ?", post);
                if (err) {
                    console.log(err);
                    return;
                }
                if (results.affectedRows) {
                    return uid;
                }
                else {
                    return null;
                }
            }
            catch (Ex) {
                console.log(Ex);
            }
            finally {
                connection && connection.release();
            }
        });
    }
    userByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield this.getConnection();
                const [err, results, fields] = yield this.queryAsync(connection, "SELECT * FROM users WHERE username='" + username.trim() + "'");
                if (err) {
                    console.log(err);
                    return;
                }
                if (results.length) {
                    return results[0];
                }
            }
            catch (Ex) {
                console.log(Ex);
            }
            finally {
                connection && connection.release();
            }
            return {};
        });
    }
    userByIdUser(idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection;
            try {
                connection = yield this.getConnection();
                const [err, results, fields] = yield this.queryAsync(connection, "SELECT * FROM users WHERE id='" + idUser + "'");
                if (err) {
                    console.log(err);
                    return;
                }
                if (results.length) {
                    return results[0];
                }
            }
            catch (Ex) {
                console.log(Ex);
            }
            finally {
                connection && connection.release();
            }
            return {};
        });
    }
}
exports.MysqlStorage = MysqlStorage;
//# sourceMappingURL=MsqlStorage.js.map