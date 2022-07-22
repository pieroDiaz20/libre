const queryString= require('querystring');
const connection = require('../connection');

module.exports.findAll =(event,context,callback)=>{
    context.callbackWaitsForEmptyEventLoop = false;//Esto es necesario si estamos trabajando en una lambda
                                                   //utilizando mysql ya que si no lo hacemos tendremos un timeOp,
                                                   //la peticion nunca va terminar porque no sabra cuando mysql ha 
                                                   //retornado la informacion
    const sql= 'select * from usuario';
    connection.query(sql,(error,rows)=>{
        if(error){
            callback({
                statusCode:500,
                body:JSON.stringify(error)
            })
        } else{
            callback(
                null,{
                    statusCode:200,
                    body:JSON.stringify({
                        usuario:rows})
                    });
        }
    });
};
module.exports.findOne =(event,context,callback)=>{
    context.callbackWaitsForEmptyEventLoop = false;
    const sql = 'select * from usuario where id = ?';
    connection.query(sql,[event.pathParameters.id],(error,row)=>{
        if(error){
            callback({
                statusCode:500,
                body: JSON.stringify(error)
            });
        }else{
            callback(null,
                {
                statusCode:200,
                body: JSON.stringify({id:row})
                });
        }
    })
};
module.exports.create = (event,context,callback)=>{
    context.callbackWaitsForEmptyEventLoop = false;
    console.log(event['body']);
    const body = queryString.parse(event['body']);
    const data ={ nombre: body.nombre };
    const sql ='insert into usuario (nombre) values (?)';
    //connection.query(sql,[data],(error,result)=>{
    connection.query(sql,[ data ],(error,result)=>{
        if(error){
            callback({
                statusCode:500,
                body: JSON.stringify(error),
                msg:'Error al registar al usuario'
            });
        }else{
            callback(null,{
                statusCode:200,
                body:JSON.stringify({msg:`el usuario ${result.insertId} se ha registrado `})
            });
        }
    });
}

module.exports.update =(event,context,callback)=>{
    context.callbackWaitsForEmptyEventLoop = false;

    const body = queryString.parse(event['body']);
    const sql = 'update usuario set nombre= ? where id=?';
    connection.query(sql,[body.nombre,event.pathParameters.id],(error,res)=>{
        if (error) {
            callback({statusCode:400,body:JSON.stringify({msg:'No se pudo actualizar el usuario'})});
        } else {
            callback(null,{statusCode:200,body: JSON.stringify({msg:`El usuario ${body.nombre} ha sido actualizado`})});
        }
    });
}

module.exports.delete =(event,context,callback)=>{
    context.callbackWaitsForEmptyEventLoop = false;
    const sql = 'delete from usuario where id = ?';
    //const {id}=event.pathParameters;
    //connection.query(sql,[id],(error,result)=>{
    connection.query(sql,[event.pathParameter.id],(error,result)=>{
        if(error){
            callback({statusCode:400,body:JSON.stringify({msg:'No se pudo eliminar el usuario'})});
        }else{
            callback(null,{statusCode:200,body:JSON.stringify({msg:`El usuario ${''} se ha eliminado`})});

        }
    });

};