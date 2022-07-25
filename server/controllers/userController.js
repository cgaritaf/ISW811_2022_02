const UserModel = require("../models/user");
const jwt = require('jsonwebtoken');

//Se obtiene las variables de entorno
const config = process.env;

// creación de nuevos usuarios
module.exports.signup = async (req, res, next) => {
    const { username, password, role} = req.body;
    if (!username || !password) {
        res.json({ success: false, msg: 'Por favor envié los datos de usuario y contraseña!' });
    } else {
        var newUser = new UserModel({ username: username, password: password, role:role });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'El usuario ya existe en la base de datos!' });
            }
            res.json({ success: true, msg: 'Usuario creado con exito!' });
        });
    }
};

// logueo de usuarios
module.exports.signin = async (req, res, next) => {

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username: username }).exec();

    if (!user) {
        res.status(401).send({ success: false, msg: 'Autenticación incorrecta, por favor valide el usuario y contraseña' });
    } else {
        //Si el usuario existe verifica si las contraseñas
        user.comparePassword(password, user.password, function (err, isMatch) {
            if (isMatch && !err) {
              // Si el usuario es correcto y la contraseña coindice se procede a crear el token
              const token = jwt.sign(
                { username: username },
                config.SECRETWORDJWT,
                { expiresIn: "2h" }
              );
              // return the information including token as JSON
              const payload = { role: user.role, username: user.username };
              res.status(202).send({ success: true, token: token, user: payload });
            } else {
                //si la contraseña no coincide se procede a indicar el error
                res.status(401).send({ success: false, msg: 'Clave incorrecta' });
                //res.json({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
        });
    }
};