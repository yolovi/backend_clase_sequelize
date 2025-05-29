const handleValidationError = (err, res) => {
  let errors = err.errors.map((el) => el.message);
  if (errors.length > 1) {
    const msgErr = errors.join(" || ");
    res.status(400).send({ messages: msgErr });
  } else { //si solo hay un error
    res.status(400).send({ messages: errors });
  }
};

const typeError = (err, req, res, next) => {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    handleValidationError(err, res); //llamamos a la función que lo ponta bonito
  } else { //error genérico
    res.status(500).send({ msg: "Hubo un problema",err });
  }
};

module.exports = { typeError };
