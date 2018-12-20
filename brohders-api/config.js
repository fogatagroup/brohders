const serverUrl = "127.0.0.1";
const pgConfig = {
    user: 'postgres',
    host: serverUrl,
    database: 'brohders',
    password: 'rootio',
    port: 5432,
}; 

module.exports = {
    serverUrl: serverUrl,
    pgConfig: pgConfig
}