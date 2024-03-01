# Manual de Back-end

Este manual es una guía para añadir añadir nuevos controladores para la
aplicación PideCola 3.0. Para saber cómo hacer modificaciones sobre los
modelos y esquemas de la base de datos revisar el Manual de Base de Datos de
la aplicación.

##Para agregar un nuevo controlador

1. Genere el archivo `xController.js` en el directorio `/controllers`, donde
   `x` es un nombre descriptivo de su controlador. Por ejemplo:

`userController.js` es el controlador de todas aquellas funciones relacionadas con los usuarios de la aplicación.

2. Dentro de su archivo importe, usando la función `require` aquellos módulos
   que le sean de utilidad, cuidando importar solo aquellas clases, métodos y
   funciones que sean indispensables para el desarrollo de su controlador. Si
   requiere funciones para acceder a la base de datos, consulte el manual de
   la base de datos, asimismo, es muy probable que las funciones que usted
   requiere ya hayan sido implementadas en otro controlador y sean
   importables usando `require`.

3. En caso de que no haya ninguna función que haga lo que requiere, escríbala
   y **documéntela** dentro del código fuente de su controlador utilizando el
   **formato de jsdoc**. Incluya dentro de su documentación la forma de hacer
   modificaciones sobre su código.

No exporte funciones que accedan directamente a base de datos o a variables
globales de la aplicación a no ser que sea estrictamente necesario. Exporte
solo funciones que manejen el acceso a elementos privados de la aplicación
con un uso específico. Por ejemplo: no exporte un modelo ni un esquema de
la base de datos a múltiples controladores para usar los métodos de la API
`Mongoose` de JavaScript, en su lugar, escriba una función que haga uso de
tales métodos y exporte esa función.

Por cada controlador, si desea generar un archivo de pruebas, genérelo en
el directorio `/__test__`

## Para agregar un archivo de pruebas del nuevo controlador `xController.js`

1. Genere el archivo `xController.test.js` en el directorio `/__test__`, donde
   `x` es el nombre descriptivo de su controlador. Por ejemplo:

`userController.js` tiene asociado su archivo de pruebas en el archivo
`userController.test.js`

2. Dentro de su archivo importe los controladores necesarios de la siguiente
   forma:

```JavaScript
const x = require('../controllers/xController.js')
```

Por ejemplo, en `rideController.test.js`

```JavaScript
const user = require('../controllers/userController.js')
const ride = require('../controllers/rideController.js')
```

Puede importar cualquier otro módulo que requiera, incluso modelos de la base de datos si es imperativo, en tal caso, no hay convención sobre el nombre a dar a la constante, en el mismo `rideController.test.js` se encuentra

```JavaScript
const usr = require('../models/userModel.js')
const httpMocks = require('node-mocks-http')
```

Este último módulo es utilizado para simular las llamadas y respuestas HTTP dentro de la app.

3. Para cada función que desee probar, genere su suite de pruebas de la
   siguiente forma:

```JavaScript
describe("function to prove", () => {
  beforeEach(() => {
    //code
  })
  afterEach(() => {
    //code
  })
  test("This is the first test", () => {
    //code
  })
  ...
  test("This is the last test", () => {
    //code
  })
})
```

Las funciones `beforeEach()` y `afterEach()` son opcionales cuando requiera
generar por cada prueba un estado en la aplicación para que su prueba pueda
ejecutarse exitosamente.

El motor de pruebas de la app es `JEST`. Es recomendable leer la
documentación de `JEST` si se desea mejorar el desempeño de las pruebas.

Para ejecutar las pruebas basta con ejecutar vía interfaz de línea de
comandos (CLI): `npm run test`

## Para conectar un nuevo controlador con el resto de la aplicación

Para que su controlador sea accesible desde el Front-end, se debe agregar
una nueva ruta para su controlador en el directorio `/routes` y ese archivo
será usado por `index.js` aplicación.

### Agregar el archivo a `/routes`

1. Para el controlador `xController.js` genere el archivo `xRoutes.js` en el
   directorio `/routes`, donde `x` es el nombre descriptivo de su controlador.

2. Para el controlador `xController.js` haga:

```JavaScript
const express = require('express')
const router = express.Router()
const xController = require('../controllers/xController.js')
```

Dependiendo de la naturaleza de sus funciones, pueden corresponder con
distintos métodos HTTP (PUT, GET, POST, ...)

3. Para el método HTTP `Y` (`y` en minúsculas) genere el comentario `// Ys` y
   haga:

```JavaScript
router.y('/func', xController.func)
```

Donde `func` respresenta el nombre de la función que exporta su controlador.

4. Finalmente exporte la variable router usando:

```JavaScript
module.exports = router
```

Ejemplo, el controlador `userController.js` exporta tres funciones, dos
POST y un PUT, entonces, en el archivo `userRoutes.js` está:

```JavaScript
const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController.js')

// POSTs
router.post('/', userController.create)
router.post('/code', userController.codeValidate)

//PUTs
router.put('/addVehicle', userController.addVehicle)

module.exports = router
```

### Hacer visible la nueva ruta en `index.js`

Agregada la ruta, esta debe poder ser visible debe ser visible en `index.js`
entonces:

1. Para el archivo `xRoutes.js`, dentro de `index.js` hacer:

```JavaScript
const x = require('./routes/xRoutes.js')
app.use('/x', x)
```

Para verificar que todo ha sido añadido sin errores léxico-sintácticos
ejecute en CLI npm run start, debe aparecer:

```
   _______  ___  ______  ______
  |   __  ||   ||      ||   ___|
  |  |  | ||   ||  __  ||  |
  |  |__| ||   || |  | ||  |___
  |   ____||   || |  | ||   ___|
  |  |     |   || |__| ||  |
  |  |     |   ||      ||  |___
  |__|     |___||______||______|

 _______  _______  _      _______  _______       ______
|   ____||       || |    |       ||___    |     |      |
|  |     |   _   || |    |   _   |    |   |     |  __  |
|  |     |  | |  || |    |  | |  | ___|   |     | |  | |
|  |     |  | |  || |    |  |_|  ||___    |     | |  | |
|  |     |  |_|  || |    |       |    |   | ___ | |__| |
|  |____ |       || |___ |   _   | ___|   ||   ||      |
|_______||_______||_____||__| |__||_______||___||______|

```

Si esto es así, todo ha sido exitoso y ya puede utilizar su nuevo
controlador.
