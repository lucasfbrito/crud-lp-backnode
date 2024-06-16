const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Crear un cliente
app.post("/clientes", (req, res) => {
  const { nombre, vehiculo, precio } = req.body;

  // Validar que se reciben todos los campos necesarios
  if (!nombre || !vehiculo || !precio) {
    return res.status(400).send("Se requieren nombre, vehiculo y precio");
  }

  // Calcula el costo y beneficio basado en el precio
  const costo = precio * 0.55;
  const beneficio = precio * 0.45;
  const total = costo + beneficio; // Calcula el total

  pool.query('INSERT INTO clientes (nombre, vehiculo, precio, costo, beneficio, total) VALUES ($1, $2, $3, $4, $5, $6)', 
    [nombre, vehiculo, precio, costo, beneficio, total],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Ocurrió un error al cargar el cliente');
      } else {
        res.status(201).send("Cliente cargado con éxito");
      }
    }
  );
});

// Actualizar un cliente
app.put("/clientes/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, vehiculo, precio } = req.body;

  // Validar que se reciben todos los campos necesarios
  if (!nombre || !vehiculo || !precio) {
    return res.status(400).send("Se requieren nombre, vehiculo y precio");
  }

  // Calcula el costo y beneficio basado en el precio
  const costo = precio * 0.55;
  const beneficio = precio * 0.45;
  const total = costo + beneficio; // Calcula el total

  pool.query('UPDATE clientes SET nombre=$1, vehiculo=$2, precio=$3, costo=$4, beneficio=$5, total=$6 WHERE id=$7',
    [nombre, vehiculo, precio, costo, beneficio, total, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Ocurrió un error al actualizar el cliente');
      } else {
        res.send("Cliente actualizado con éxito");
      }
    }
  );
});

// Eliminar un cliente
app.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM clientes WHERE id=$1',
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Ocurrió un error al eliminar el cliente');
      } else {
        res.send("Cliente eliminado con éxito");
      }
    }
  );
});

// Obtener todos los clientes
app.get("/clientes", (req, res) => {
  pool.query('SELECT * FROM clientes',
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Ocurrió un error al obtener los clientes');
      } else {
        res.send(result.rows);
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Corriendo en el puerto ${PORT}`);
});
