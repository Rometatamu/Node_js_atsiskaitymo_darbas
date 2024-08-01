import mongoose from "mongoose";

const ticketSchema=mongoose.Schema({
    title: {type: String, required: true, min:5},
    ticket_price: {type: Number, required: true},
    from_location: {type: String, required: true},
    to_location: {type: String, required: true},
    to_location_photo_url: {type: String, required: true},
    userId:{type:String, required:false},
    id: {type: String, required: true},
});
export default mongoose.model("Ticket", ticketSchema);