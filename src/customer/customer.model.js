import {Schema, model} from 'mongoose';
 
const CustomerSchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    email:{
        type: String,
        required: [true, 'Contact is required'],
    },
    phone:{
        type: String,
        required: [true, 'Phone is required'],
    },
    
})

CustomerSchema.methods.toJSON = function () {
    const {__v,_id,...customer} = this.toObject()
    customer.uid = _id
    return customer
}

export default model('Customer',CustomerSchema)