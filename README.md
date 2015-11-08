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
- **key** (String|Number|Object) - hash key;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, or `model` - default `model`.
  
### dynamo.access.getItems(model, keys [, options]);

Gets items by a list of keys. Returns a promise!

Params:
- **keys** (String[]|Number[]|Object[]) - an array of keys;

### dynamo.control.create(model, data[, options]);

Creates a new record. Returns a promise!

Params:
- **model** (String) - model name;
- **data** (Object) - record data;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, or `model` - default `model`.

### dynamo.control.put(model, data[, options]);

Creates on replaces a record. Returns a promise!

Params:
- **model** (String) - model name;
- **data** (Object) - record data;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, or `model` - default `model`.

### dynamo.control.update(model, data[, options]);

Updates an existing record. Returns a promise!

Params:
- **model** (String) - model name;
- **data** (Object) - record data;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, or `model` - default `model`.
