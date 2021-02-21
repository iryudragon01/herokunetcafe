const Joi = require ('@hapi/joi')

// Register Validation
const registerValidation = (data) =>{
    const schema = Joi.Object( {
        name:Joi.string().min(5).required(),
        password:Joi.string().min(5).required(),
        email:Joi.string().required().email().min(1)
    })
    return schema(data)
}
const loginValidation = (data) =>{
    const schema = Joi.Object( {
        password:Joi.string().min(5).required(),
        email:Joi.string().required().email().min(1)
    })
    return schema(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation