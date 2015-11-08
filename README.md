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

### dynamo.access.getItemByKey(model, key[, options]);

Gets an item by hash key. Returns a promise!

Params:
- **model** (String) - model name;
- **key** (String|Number) - hash key;
- **options** (Object) - access options:
  - **params** (Object) - DynamoDB params.
  - **format** (String) - result format: `json`, or `model` - default `model`.

### dynamo.access.getItemByRangeKey(model, key, rangeKey [, options]);

Gets an item by hash key and range key. Returns a promise!

Params:
- **model** (String) - model name;
- **rangeKey** (String|Number) - range key;
  
### dynamo.access.getItems(model, keys [, options]);

Gets items by a list of keys. Returns a promise!

Params:
- **model** (String) - model name;
- **keys** (String[]|Number[]) - an array of keys;
