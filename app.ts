import {Database} from 'sqlite3';
import { Request,Response } from 'express';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const db = new Database('biblioteca.db');

const app = express()
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 10104

app.get('/biblioteca/libros-autores',function(request:Request,response:Response){
    db.all("SELECT * FROM libros INNER JOIN autores USING(id_autor)",
        (err,rows)=>{
            if(err){
                console.log(err.message);
                response.status(500).json({error:' No se encontraron libros.'})
            }else{
                response.status(200).json(rows);
            }
        });
});

app.get('/biblioteca/libros',function(request:Request,response:Response){
    const id_libro = request.query.id_libro;
    db.all("SELECT * FROM libros WHERE id_Libro = ?",
        [id_libro],
        (err,rows)=>{
            if(err){
                console.log(err.message);
                response.status(500).json({error:' No se encontraron libros.'})
            }else{
                response.json(rows);
            }
        });
});

app.post('/biblioteca/agregar-Libro',function(request:Request,response:Response){
    const {nombre_libro,categoria,id_autor} =request.body;
    db.run("INSERT INTO libros (nombre_libro,categoria, id_autor) VALUES (?,?,?)",
        [nombre_libro,categoria,id_autor],
        (err)=>{
            if(err){
                console.log(err.message);
                response.status(500).json({error:' No se pudo agregar el libro.'})
            }else{
                response.status(201).json({message:'Libro agregado con éxito.'});
            }
        });
});
app.put('/biblioteca/actualizar-Libro/:id_libro', function(request:Request,response:Response){
    const id_libro = request.params.id_libro;
    const {nombre_libro,categoria,id_autor} = request.body;
    db.run("UPDATE libros SET nombre_libro = ?, categoria = ?, id_autor = ? WHERE id_libro=?",
        [nombre_libro,categoria,id_autor,id_libro],
        (err)=>{
            if(err){
                console.log(err.message);
                response.status(500).json({error:' No se pudo actualizar el libro.'})
            }else{
                response.status(200).json({message:'Libro actualizado con éxito.'});
            }
        });
});
app.delete('/biblioteca/eliminar-Libro', function(request: Request, response: Response) {
    const categoria = request.header("Authorization");
    const id_libro = request.query.id_libro;
    if (!id_libro) {
        return response.status(400).json({ error: 'Falta el parámetro id_libro.' });
    }
    if (!categoria) {
        return response.status(400).json({ error: 'Falta el encabezado Authorization.' });
    }
    db.run("DELETE FROM libros WHERE id_libro = ? AND categoria = ?", [id_libro, categoria],
        (err) => {
        if (err) {
            console.log(err.message);
            response.status(500).json({ error: 'No se pudo eliminar el libro.' });
        } else {
            response.status(200).json({ message: 'Libro eliminado con éxito.' });
        }
    });
});


app.listen(PORT,()=>{
    console.log(`Escuchando en el puerto ${PORT}` );
}).on("error",(error:any)=>{
    throw new Error(error.message
    )
});
