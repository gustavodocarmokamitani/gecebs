import { celebrate, Joi } from 'celebrate';

/**
 * Validação para o registro de um novo time e seu manager
 */
export const teamValidation = {
  register: celebrate({
    body: Joi.object({
      teamName: Joi.string().required().description('Nome da equipe'),
      email: Joi.string().email().required().description('Email do time'),
      password: Joi.string().required().description('Senha de acesso'),
      phone: Joi.string().description('Telefone de contato').allow(null, ''),
    }),
  }),
};

/**
 * Validação para o login de um usuário
 */
export const authValidation = {
  login: celebrate({
    body: Joi.object({
      username: Joi.string().required().description('Nome de usuário'),
      password: Joi.string().required().description('Senha de acesso'),
    }),
  }),
};

/**
 * Validação para as rotas de categoria
 */
export const categoryValidation = {
  create: celebrate({
    body: Joi.object({
      name: Joi.string().required().description('Nome da categoria'),
    }),
  }),
};

/**
 * Validação para as rotas de usuário (atleta)
 */
export const userValidation = {
  createAthlete: celebrate({
    body: Joi.object({
      firstName: Joi.string().required().description('Primeiro nome do atleta'),
      lastName: Joi.string().required().description('Sobrenome do atleta'),
      phone: Joi.string().description('Telefone do atleta').allow(null, ''),
      birthDate: Joi.string()
        .isoDate()
        .required()
        .description('Data de nascimento (formato ISO 8601)'),
      federationId: Joi.string().description('ID da confederação').allow(null, ''),
      houseNumber: Joi.string().description('Número da casa/residência').allow(null, ''),
    }),
  }),
};
