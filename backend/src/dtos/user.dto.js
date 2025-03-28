import {ROLES}  from '../constants/roles.js';

export const registerDTO = (req) => ({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
});

export const loginDTO = (req) => ({
    email: req.body.email ,
    password: req.body.password
});

export const createUserInternalDTO = (userData, hashedPassword) => ({
    ...userData,
    password: hashedPassword,
    role: ROLES.USER
  });