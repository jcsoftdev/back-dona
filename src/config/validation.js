const Joi = require('@hapi/joi')

//LOGIN VALIDATION

const loginValidation = (data) => {
  const schema = Joi.object({
      dni: Joi.number().required(),
      cellphone: Joi.number().required(),
  })

  return schema.validate(data);

}

module.exports.loginValidation = loginValidation

