const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MapSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerUsername: {type: String, required: true},
        ownerEmail: { type: String, required: true },
        comments: {type:[[{String, String}]], required: false},
        geoJsonMap: {type: Object, required: true},
        collaborators: [{type: [String], required: false}],
        keywords: [{type: [String], required: false}],
        published: {type: {isPublished: Boolean, publishedDate: Date}, required: true}
        //,
        //thumbnail: {type:String, required:true}
    },
    { timestamps: true },
)


module.exports = mongoose.model('Map', MapSchema)