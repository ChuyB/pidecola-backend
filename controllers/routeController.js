/**
 * Este módulo contiene los métodos para manejar las rutas en la base de datos.
 * @module controllers/routesController
 * @author Jesús Bovea <19-10072@gmail.com>
 * @require lib/utils/utils.callbackReturn
 * @require lib/utils/response.response
 * @require models/routeModel.js
 */

const response = require("../lib/utils/response").response;
const routes = require("../models/routeModel.js");
const callback = require("../lib/utils/utils").callbackReturn;

/**
 * Función que recibe una HTTP request para agregar una nueva ruta
 * a la base de datos.
 * @public
 * @param {Object} req - Un HTTP Request
 * @param {Object} res - Un HTTP Response
 * @returns {Object} 
 */
exports.addNewRoute = async (req, res) => {
  const name = req.body.name;

  const newRoute = {
    name,
  };

  if (!name)
    return res
      .status(400)
      .send(response(false, "", "El Nombre de la ruta debe ser especificado"));

  const existingRoute = await routes.find({ name: { $eq: name } });

  if (existingRoute.length !== 0)
    return res.status(409).send(response(false, "", "La ruta ya existe"));

  await routes.create(newRoute).then(callback);

  return res.status(200).send(response(true, "", "Ruta creada"));
};

/**
 * Función que recibe una HTTP request y response con un arreglo
 * de todos los nombres de las rutas existentes
 * @public
 * @param {Object} req - Un HTTP Request
 * @param {Object} res - Un HTTP Response
 * @returns {Object} 
 */
exports.getAllRoutesNames = async (_, res) => {
  try {
    const allRoutes = await routes.find({});
    const routeNames = allRoutes.map((route) => route.name);
    return res.status(200).send(response(true, routeNames, ""));
  } catch (error) {
    return res
      .status(500)
      .send(response(false, error, "Ha ocurrido un error en el servidor"));
  }
};

/**
 * Función que recibe una HTTP request y elimina una ruta por su nombre
 * @public
 * @param {Object} req - Un HTTP Request
 * @param {Object} res - Un HTTP Response
 * @returns {Object} 
 */
exports.deleteRouteByName = async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res
      .status(400)
      .send(response(false, "", "El Nombre de la ruta debe ser especificado"));

  try {
    const existingRoute = await routes.find({ name: { $eq: name } });

    if (existingRoute.length === 0)
      return res
        .status(404)
        .send(response(false, "", `La ruta ${name} no existe`));

    const deleteRes = await routes.findByIdAndDelete(existingRoute[0]._id);

    if (deleteRes)
      return res
        .status(200)
        .send(
          response(
            true,
            "",
            `La ruta ${existingRoute[0].name} ha sido eliminada correctamente`,
          ),
        );

    return res
      .status(400)
      .send(response(false, "", "No se pudo eliminar la ruta"));
  } catch (error) {
    return res
      .status(500)
      .send(response(false, error, "Ha ocurrido un error en el servidor"));
  }
};

/**
 * Función que recibe una HTTP request y actualiza una ruta por su nombre
 * cambiando ese nombre
 * @public
 * @param {Object} req - Un HTTP Request
 * @param {Object} res - Un HTTP Response
 * @returns {Object} 
 */
exports.updateRouteByName = async (req, res) => {
  const { previousName, newName } = req.body;

  if (!previousName)
    return res
      .status(400)
      .send(response(false, "", "El nombre de la ruta debe ser especificado"));

  if (!newName)
    return res
      .status(400)
      .send(
        response(false, "", "El nuevo nombre de la ruta debe ser especificado"),
      );

  try {
    const routeWithNewName = await routes.find({ name: { $eq: newName } });

    if (routeWithNewName.length !== 0)
      return res
        .status(400)
        .send(
          response(false, "", `La ruta ${newName} ya se encuentra registrada`),
        );

    const resUpdate = await routes.findOneAndUpdate(
      { name: { $eq: previousName } },
      { name: newName },
    );

    if (!resUpdate)
      return res
        .status(404)
        .send(response(false, "", `La ruta ${previousName} no se encuentra`));

    return res
      .status(200)
      .send(
        response(
          true,
          "",
          `La ruta ${previousName} ha sido actualizada y ahora tiene el nombre de ${newName}`,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .send(response(false, error, "Ha ocurrido un error en el servidor"));
  }
};
