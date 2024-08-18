const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const userController = require('./controllers/UserController'); // Importing the user controller
const productController = require('./controllers/ProductController'); // Importing the product controller
const saleController = require('./controllers/SaleController'); // Importing the sale controller


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads',express.static('uploads'));

app.use('/user',userController);
app.use('/product',productController);
app.use('/api/sale',saleController);

app.listen(3001);