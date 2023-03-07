/**
 * @swagger
 * components:
 * 
 *   schemas:
 * 
 *     # Schema used to list all movies from the db
 *     MovieList:
 *       properties:
 *         movies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *           example: [id: '1', id: '2', id: '3']
 * 
 * 
 *     # Schema used for POST, PUT movies
 *     MovieWrite:
 *       properties:
 *         id:
 *           type: string
 *           example: '1'                # Property-level example
 *           readOnly: true              # Note: an Object-level example will cancel the "readOnly" effect
 *         title:
 *           type: string
 *           example: Onze Homens e um Segredo
 *         year:
 *           type: integer
 *           example: 2002
 *         cast:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *           example: [id: '1', id: '2', id: '3']
 *       required:
 *         - title
 *         - year
 *         - cast
 *       #example:                       # Object-level example
 *       #  ...
 * 
 * 
 *     # Schema used for GET movie details
 *     MovieRead:
 *       properties:
 *         id:
 *           type: string
 *           example: '1'
 *         title:
 *           type: string
 *           example: De Volta para o Futuro
 *         year:
 *           type: integer
 *           example: 1985
 *         cast:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *           example:
 *             - id: '1'
 *               name: Christopher Lloyd
 *             - id: '2'
 *               name: Michael J. Fox
 */