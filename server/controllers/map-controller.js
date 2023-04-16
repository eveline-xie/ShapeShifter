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

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    const map = await Map.findOne({ _id: body.id});
    map.name = body.payload.name;
    map.keywords = body.payload.keywords;
    map.collaborators = body.payload.collaborators;
    map.save();
    return res.status(201).json({
        success: true,
        map: map

    })
}

async function loadUserMaps(req, res) {
    const loggedInUser = await User.findOne({ _id: req.userId });
    const maps = await Map.find({ownerEmail: loggedInUser.email});
    return res.status(201).json({
        success: true,
        userMaps: maps
    })

}

async function getMapById(req, res) {
    const map = await Map.findById({_id: req.params.id});
    return res.status(201).json({
        success: true,
        currentMap: map
    })
}
module.exports = {
    createMap,
    updateMapCustomProperties,
    loadUserMaps,
    getMapById
}