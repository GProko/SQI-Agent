const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqiRoutes = require('./routes/sqiRoutes');
const app = express();
const PORT = 5000;



// Test
app.get('/', (req, res) => {
    res.send('Intucate SQI Engine is Running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});