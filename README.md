# babel-plugin-glodash

## Example

Transforms
```js
glodash.get()
```

roughly to
```js
import _get from 'lodash/get'

_get()
```

For more examples, please see the catalog test

## Limitations
- Chain sequences aren’t supported.
- Destructuring assignment aren’t supported.