require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("./controllers/userController");
const response = require("./lib/utils/response.js").response;
const tokenKey = process.env.KEY;

const viewCredentials = (authorization) => {
  if (!authorization || typeof authorization !== "string") return false;
  const content = authorization.split(" ");
  if (content[0].toLowerCase() !== "basic") return false;
  const userData = Buffer.from(content[1], "base64").toString().split(":");
  return { email: userData[0], password: userData[1] };
};

exports.viewAuthorization = (authorization) => {
  if (!authorization || typeof authorization !== "string") return false;
  const credential = authorization.split(" ");
  return credential[0].toLowerCase() === "bearer" ? credential[1] : false;
};

exports.generateToken = (
  email,
  expiresIn = Math.floor(Date.now() / 1000) * 60 * 60 * 24 * 30 // 30 días desde el momento en que se generó el token
) => {
  return jwt.sign(
    {
      sub: { email },
      iss: process.env.AUDIENCE,
      aud: process.env.AUDIENCE,
    },
    tokenKey,
    { expiresIn }
  );
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(401)
      .send(response(false, null, "Credenciales Invalidas."));

  users
    .findByEmail(email, null)
    .then(async (user) => {
      if (!user) return undefined;
      const compare = await bcrypt.compare(password, user.password);
      return [compare, user];
    })
    .then((resp) => {
      if (!resp) {
        return res
          .status(401)
          .send(response(false, null, "El usuario no existe"));
      } else if (!resp[0]) {
        return res
          .status(401)
          .send(response(false, null, "Contraseña Incorrecta"));
      }

      const user = resp[1]._doc;
      // if (!user.isVerify)
      //   return res
      //     .status(401)
      //     .send(response(false, null, "Usuario no verificado."));

      delete user.password;
      res
        .status(200)
        .send(
          response(
            true,
            { token: this.generateToken(user.email) },
            "Inicio de sesión satisfactorio"
          )
        );
    })
    .catch((error) => {
      res
        .status(500)
        .send(response(false, error, "Error autenticando al usuario"));
    });
};

exports.validateSession = (req, res) => {
  const { token } = req.body;

  jwt.verify(
    token,
    tokenKey,
    { audience: process.env.AUDIENCE },
    (err, decoded) => {
      if (err || !token)
        return res.status(401).send(response(false, null, "Unauthorized."));

      res
        .status(200)
        .send(
          response(
            true,
            { token: this.generateToken(decoded.sub.email) },
            "Authorized"
          )
        );
    }
  );
};

exports.verifyAutentication = (req, res, next) => {
  const token = this.viewAuthorization(req.headers.authorization);

  jwt.verify(
    token,
    tokenKey,
    {
      audience: process.env.AUDIENCE,
    },
    (err, decoded) => {
      if (err || !token)
        return res.status(401).send(response(false, null, "Unauthorized."));
      req.secret = decoded;
      next();
    }
  );
};
