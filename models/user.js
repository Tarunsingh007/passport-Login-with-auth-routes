var mongoose=require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:{
        type:String
    },
    password:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
});
const user=mongoose.model('user', userSchema);
module.exports=user;