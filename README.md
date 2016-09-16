# vogels-helpers

## Usage

```
var dynamo = require('vogels-helpers');
var Account = dynamo.define('Account', config, recordConfig);
```

## API

### dynamo.vogels
### dynamo.Joi

### dynamo.define(name, config, recordConfig)

### dynamo.access.getItem(model, key[, options]);

Gets an item by hash key. Returns a promise!

Params:
- **model** (String) - model name;
- **key** (String|Number|Object) - record key;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, `items`, `first`, or `model` - default `json`.
  
### dynamo.access.getItems(model, keys [, options]);

Gets items by a list of keys. Returns a promise!

Params:
- **keys** (String[]|Number[]|Object[]) - an array of keys;

### dynamo.control.create(model, data[, options]);

Creates a new record. Returns a promise! Builds ConditionExpression if not set.

Params:
- **model** (String) - model name;
- **data** (Object) - record data;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, `items`, `first`, or `model` - default `json`.

### dynamo.control.put(model, data[, options]);

Create or replace a record. Returns a promise!

Params:
- **model** (String) - model name;
- **data** (Object) - record data;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, `items`, `first`, or `model` - default `json`.

### dynamo.control.update(model, data[, options]);

Update an existing record. Returns a promise! Builds ConditionExpression if not set.

Params:
- **model** (String) - model name;
- **data** (Object) - record data;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, `items`, `first`, or `model` - default `json`.

### dynamo.control.destroy(model, key[, options]);

Destroy an item by key.
