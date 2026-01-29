# Claims IA Decimal Money type

This module provides a field type, Money. You can set the precision, and optionally, the currency for each field.

The value is stored as an integer, depending on precision.

## Example

If the plugin is configured with

- currency = "EUR"
- precision = 2

If you enter 12,34 then

- value will be displayed as 12,34€
- in database, stored value will be 1234
