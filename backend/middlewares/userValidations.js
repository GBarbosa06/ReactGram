const {body} = require("express-validator");

const userCreateValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("O nome é obrigatório")
            .isLength({min: 3})
            .withMessage("O nome precisa ter no mínimo 3 caracteres"),
        body("email")
            .isString()
            .withMessage("O email é obrigatório")
            .isEmail()
            .withMessage("Insira um email válido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
            .isLength({min: 6})
            .withMessage("A senha precisa ter no mínimo 6 caracteres"),
        body("confirmpassword")
            .isString()
            .withMessage("A confirmação senha é obrigatória")
            .custom((value, {req}) => {
                if(value != req.body.password){
                    throw new Error("As senhas não são iguais.")
                }
                return true;
            })
        
    ];
}

const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O e-mail é obrigatório")
            .isEmail()
            .withMessage("Insira um e-mail válido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatória")
    ]
}

const userUpdateValidation = () =>{
    return [
        body("name")
            .optional()
            .isLength({min:3})
            .withMessage("O nome precisa de pelo menos 3 caracteres."),
        body("password")
            .optional()
            .isLength({min:6})
            .withMessage("A senha precisa ter no mínimo 6 caracteres")
    ]
}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
};