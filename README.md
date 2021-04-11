# How to Duplicate Project

### Initial Setup
- Create a directory for the project
- Run `npm init -y`
- Add knex-cli globally with `npm i -g knex`
- `cd <<directory-name>>`
- Run `npm i knex mysql bookshelf`
- Run `knex init` to generate a `knexfile.js`
- Replace contents of `knexfile.js` with:

```js
module.exports = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "<YOUR_DB_USER_NAME>",
    password: "<YOUR_DB_PASSWORD>",
    database: "<YOUR_SCHEMA_IN_DB>",
    charset: "utf8"
  }
};
```

### Setting up Knex connection
- Create a `bookshelf.js` in the root directory
- Add the following code to `bookshelf.js`:

```js
const knex = require("knex")(require("./knexfile"));
const bookshelf = require("bookshelf")(knex);
 
module.exports = bookshelf;
```
- In your terminal, run `mysql`
- In the mysql console, run `CREATE DATABASE <<database-name-in-knexfile.js>>`


### Tables & Migrations


#### Warehouses Table
To generate a new table, in the terminal run:
`knex migrate:make create_warehouse_table.js`

This will auto-populate a `migrations` folder with a file that contains two functions: `exports.up` and `exports.down`

In the `exports.up` function add:
```js
exports.up = knex => {
  return knex.schema.createTable("warehouses", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table
      .string("position")
      .notNullable()
      .defaultTo("Store Manager");
    table.string("manager").notNullable();
    table.string("address").notNullable();
    table.string("phone").notNullable();
    table.string("email").notNullable();
    table.json("categories").notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};
```

In the `exports.down` function add: 
```js
exports.down = knex => {
  return knex.schema.dropTable("inventories");
};
```
#### Inventories Table
To create a new table run the migration command again:
- `knex migrate:make create_inventories_table.js`
- In the `exports.up` file add:

```js
exports.up = knex => {
  return knex.schema.createTable("inventories", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
    table
      .integer("warehouse_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("warehouses")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("quantity")
      .notNullable()
      .defaultTo(0);
    table.string("status").notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};
```
- In the `exports.down` function add:
```js
exports.down = knex => {
  return knex.schema.dropTable("inventories");
};
```

### Running Migrations
- Add the following script to your package.json:
```js
"scripts": {
  "migrate": "knex migrate:latest",
}
```
- Run the command `npm run migrate` to run the migration files.


### Seeding
- To generate a `seeds` directory and file, run the `knex seed:make index.js`
- In the seeds directory, create a subdirectory called `seed_data` and include two files: a `warehouses.js` and `inventories.js`
- In the `warehouses.js` add:
```js
module.exports = [
  {
    name: 'Warehouse One',
    position: 'Store Owner',
    manager: 'John Doe',
    address: '456 Granville St, Toronto, ON',
    phone: '123-456-7890',
    email: 'john.doe@gmail.com',
    categories: JSON.stringify(['electronics', 'cellphones', 'cameras'])
  },
  {
    name: 'Warehouse Two',
    manager: 'Alex Green',
    address: '789 Wood St, Vancouver, BC',
    phone: '123-456-7890',
    email: 'alex.green@gmail.com',
    categories: JSON.stringify([
      'electricals',
      'construction',
      'building materials'
    ])
  }
];
```
- In the `inventories.js` add:
```js
module.exports = [
  {
    name: 'Product One',
    description: 'one awesome product for photographers',
    quantity: 400,
    status: 'In Stock'
  },
  {
    name: 'Product Two',
    description: 'one awesome product for chefs',
    quantity: 800,
    status: 'In Stock'
  },
  {
    name: 'Product Three',
    description: 'one awesome product for musicians',
    quantity: 90,
    status: 'Out Of Stock'
  }
];
```
- In the `seeds/index.js` file add the following:
```js
const inventoryData = require('./seed_data/inventories');
const warehouseData = require('./seed_data/warehouses');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('warehouses')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('warehouses').insert(warehouseData);
    })
    .then(() => {
      return knex('inventories').del();
    })
    .then(() => {
      // Inserts seed entries
      return knex('warehouses')
        .pluck('id')
        .then((warehouseIds) => {
          return warehouseIds;
        });
    })
    .then((warehouseIds) => {
      const inventoryDataWithWarehouseIds = inventoryData.map((inventory) => {
        inventory.warehouse_id =
          warehouseIds[Math.floor(Math.random() * warehouseIds.length)];
        return inventory;
      });
      return knex('inventories').insert(inventoryDataWithWarehouseIds);
    });
};
```
- In your `scripts` in the package.json, add the following script: `"seed": "knex seed:run"`
- In your terminal run, `npm run seed`
  

### Checking MySQL
- In your terminal, run `mysql`
- In the mysql console, run `USE <<database-in-knexfile.js>>`
- Now that the DB has been selected, query the tables.
- `SELECT * FROM warehouses`
- `SELECT * FROM inventories`
  