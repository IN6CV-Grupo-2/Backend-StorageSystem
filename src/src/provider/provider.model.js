import {Schema, model} from 'mongoose';

const ProviderSchema = Schema({
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
    products:[{
        type: Schema.Type.ObjectId,
        ref:'Product'
    }]
})

CursoSchema.methods.toJSON = function () {
    const {__v,_id,...provider} = this.toObject()
    provider.uid = _id
    return provider
}

export default model('Provider',ProviderSchema)