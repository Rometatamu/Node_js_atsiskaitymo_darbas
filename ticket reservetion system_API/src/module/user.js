import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name: {type: String, required: true, minlength:3, set: (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },},
    email: {type: String, required: true, validate: {
        validator: function (value) {
          return /\S+@\S+\.\S+/.test(value);
        },  message: "Not correct email",
      },},
    password: {type: String, required: true},
    money_balance:{type:Number, required: true},
    id: {type: String, required: true},
});
export default mongoose.model("User", userSchema);