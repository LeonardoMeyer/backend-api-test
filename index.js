const express = require('express');
const app = express();
const contaRoutes = require('./routes/contaRoutes');

// Middlewares
app.use(express.json());

// Routes
app.use('/contas', contaRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});