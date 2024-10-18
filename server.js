const express = require('express');
const app = express();
const usersRoutes = require('./routes/users');
const accountsRoutes = require('./routes/accounts');
const transactionsRoutes = require('./routes/transactions');

const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/accounts', accountsRoutes);
app.use('/api/v1/transactions', transactionsRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));