const mysql = require('mysql');

//Configurar datos de acceso
const configDB={
    host:'curso-sls-rds-mysql.crrhqbb5dmdm.us-east-2.rds.amazonaws.com',
    user:'root',
    password:'12345678',
    port: '3306',
    database: 'db_curso_sls_rds_mysql',
    debug : true
};
const iniciarConeccion=(config)=>{
    const addDesconecionHandler=(connection)=>{
        connection.on('error',error=>{
            if(error instanceof Error){
                if(error.code === "PROTOCOL_CONNECTION_LOST"){
                    console.log(error.stack);
                    console.log('Lost connection. Reconnecting...');

                    iniciarConeccion(connection.config);
                }else if(error.fatal) {
                    throw error;
                }
            }
        });
    }
    const connection =mysql.createConnection(config);

    addDesconecionHandler(connection);
    connection.connect();
    return connection;
}
const connection= iniciarConeccion(configDB);
module.exports= connection;
