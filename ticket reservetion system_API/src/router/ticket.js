import express from "express";

import {
    GET_TICKETS,
    PUT_TICKET_BY_USER_ID,
    GET_TICKETS_WITH_USER,
    POST_TICKET
} from "../controller/ticket.js";

import {auth} from "../middlewares/auth.js";
const router=express.Router()


router.get(`/tickets`, auth, GET_TICKETS);
router.get(`/tickets/user/:userId`, auth, GET_TICKETS_WITH_USER);
router.put('/tickets/:id', auth, PUT_TICKET_BY_USER_ID);
router.post(`/tickets`, POST_TICKET);

export default router;
