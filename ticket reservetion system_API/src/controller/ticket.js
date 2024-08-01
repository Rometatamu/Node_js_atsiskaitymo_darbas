import {v4 as uuidv4} from "uuid";
import TicketModel from "../module/ticket.js";
import UserModel from "../module/user.js";


const GET_TICKETS= async (req, res)=>{
    try{
        const tickets=await TicketModel.find({ userId: null });
        res.status(200).json({tickets: tickets});
    } catch(err){
      console.log(err);
      return res.status(500).json({mesage:`Server error`});
    }
};

const PUT_TICKET_BY_USER_ID= async (req, res)=>{
    try {
        const userId = req.body.userId;
        const ticketId=req.params.id

        const user = await UserModel.findOneAndUpdate(
            {id:userId},
            {...req.body},
            {new:true}
        );

        if (!user) {
            return res.status(404).json({ message: `User not found` });
        }

        const ticket = await TicketModel.findOne(
            {id: ticketId},
            
        );
        if (!ticket) {
            return res.status(404).json({ message: `Ticket not found` });
        }

        if (user.money_balance < ticket.ticket_price) {
            return res.status(400).json({ message: 'Insufficient funds', ticket: ticket });
        }
        ticket.userId = userId;
        const updatedTicket = await ticket.save();

        user.money_balance -= ticket.ticket_price;
        await user.save();

        return res.status(200).json({ message: `The ticket was successfully purchased`, ticket: updatedTicket });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: `Server error` });
    }
  };

const GET_TICKETS_WITH_USER= async (req, res)=>{
    try{
        const boughtTickets=await TicketModel.find({userId: req.params.userId});
        res.status(200).json({boughtTickets: boughtTickets});
    } catch(err){
      console.log(err);
      return res.status(500).json({mesage:`Server error`});
    }
};
const POST_TICKET = async (req, res)=>{
    try{
    const ticket= new TicketModel({
        title: req.body.title,
        ticket_price: req.body.ticket_price,
        from_location: req.body.from_location,
        to_location: req.body.to_location,
        to_location_photo_url: req.body.to_location_photo_url,
        userId: req.body.userId,
        id: uuidv4(),
    });

    await ticket.save();
    return res.status(201).json({message: "A ticket was add successfully.", ticket: ticket,});
   } catch (err){
    console.log(err);
    return res.status(500).json({message: "Server error"});
   };
};


    
export {GET_TICKETS, PUT_TICKET_BY_USER_ID, GET_TICKETS_WITH_USER, POST_TICKET};
