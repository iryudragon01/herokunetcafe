const Joi = require ('joi')

// Register Validation
const registerValidation = (data) =>{
    const schema = Joi.object().keys( {
        name:Joi.string().min(5).required(),
        password:Joi.string().min(5).required(),
        email:Joi.string().required().email().min(1)
    })
    return schema.validate(data)
}
const loginValidation = (data) =>{
    const schema = Joi.object().keys( {
        password:Joi.string().min(5).required(),
        email:Joi.string().required().email().min(1)
    })
    return schema.validate(data)
}

const statementValidation = (data) => {
    const schema = Joi.object().keys({
        name:Joi.string().min(1).required(),
        quantity:Joi.number().integer().min(1).required()
    })
    return schema.validate(data)

}
module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.statementValidation = statementValidation