import express from "express";

import {
    GET_USER_BY_ID, 
    GET_ALL_USERS, 
    SIGN_UP, LOGIN, 
    GET_NEW_JWT_TOKEN,
} from "../controller/user.js";

import {auth} from "../middlewares/auth.js"

const router=express.Router()

router.post("/signup", SIGN_UP);
router.post("/login", LOGIN);
router.post("/login/refresh", GET_NEW_JWT_TOKEN);
router.get("/users/:id", auth, GET_USER_BY_ID);
router.get("/users", auth, GET_ALL_USERS);

export default router;