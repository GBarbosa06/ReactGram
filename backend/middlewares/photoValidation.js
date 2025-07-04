const {body} = require("express-validator");

const photoInsertValidation = () =>{
    return [
        body("title")
            .not()
            .equals("undefined")
            .withMessage("O título é obrigatório")
            .isString()
            .withMessage("O título deve ser um texto")
            .isLength({min: 3})
            .withMessage("O título deve ter pelo menos 3 caracteres"),
        body("image").custom((value, {req}) => {
            if (!req.file) {
                throw new Error("A imagem é obrigatória");
            }
            return true;
        })
    ];
}

module.exports = {
    photoInsertValidation,
};