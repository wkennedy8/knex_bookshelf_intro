const express = require('express');
const warehouseRoutes = require('./routes/warehouse');
const inventoryRoutes = require('./routes/inventory');

const app = express();
const PORT = process.env.PORT || 8080;

app.use('/warehouse', warehouseRoutes);
app.use('/inventory', inventoryRoutes);

app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}`);
});
