const Map = require('../models/map-model')
const User = require('../models/user-model');
const zlib = require('zlib');

async function createMap(req, res) {
    const body = req.body;
    console.log("createMap body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    console.log("id:", req.userId);
    const loggedInUser = await User.findOne({ _id: req.userId });
    const map = new Map({
        name: "Untitled",
        ownerUsername: loggedInUser.username,
        ownerEmail: loggedInUser.email,
        comments: [],
        geoJsonMap: body.map,
        collaborators: [],
        keywords: [],
        published: {isPublished: false, publishedDate: new Date()}
    })
    console.log("map", map);
    if (!map) {
        return res.status(400).json({ success: false, error: err })
    }
    loggedInUser.mapsIOwn.push(map._id);
    loggedInUser.save();
    map.save();
    return res.status(201).json({
        map: map
    })
}

async function updateMapCustomProperties(req, res) {
    const body = req.body
    console.log("updateMap: " + JSON.stringify(body));
    //console.log("req.body.name: " + req.body.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const map = await Map.findOne({ _id: body.id});
    console.log("nonupdated", map);
    console.log("name", body.name, body.keywords, body.collaborators);
    map.name = body.payload.name;
    map.keywords = body.payload.keywords;
    map.collaborators = body.payload.collaborators;
    map.save();
    console.log("updatedmap", map);
    return res.status(201).json({
        success: true,
        map: map

    })
}
module.exports = {
    createMap,
    updateMapCustomProperties
}