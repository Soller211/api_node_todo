const express = require('express');
const app = express();
const routes = require('./routes');

// Configurar las rutas de la API
app.use('/api', routes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor API en funcionamiento en el puerto ${PORT}`);
});
