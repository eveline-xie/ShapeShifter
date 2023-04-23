const Map = require('../models/map-model')
const User = require('../models/user-model');

async function createNewMap(req, res) {
    const body = req.body;
    //console.log("createMap body: " + JSON.stringify(body));
    console.log("in here");
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a map',
        })
    }
    console.log("id:", req.userId);
    const loggedInUser = await User.findOne({ _id: req.userId });
    console.log("features", body.map.features);
    let mapWithIdentifiers = body.map.features.map(function(feature, index) {
        feature.properties.myId = index;
        return feature;
    })
    body.map.features = mapWithIdentifiers;

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
    console.log("e");
    await loggedInUser.save();
    console.log("f");
    await map.save();
    console.log("g");
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

async function loadUserMapsNoGeoJson(req, res) {
    const loggedInUser = await User.findOne({ _id: req.userId });
    const maps = await Map.find({ownerEmail: loggedInUser.email});
    let mapsNoGeoJson = [];
    for (let i = 0; i < maps.length; i++) {
        mapsNoGeoJson.push(
            {
                _id: maps[i]._id,
                name: maps[i].name,
                ownerUsername: maps[i].ownerUsername,
                ownerEmail: maps[i].ownerEmail,
                comments: maps[i].comments,
                collaborators: maps[i].collaborators,
                keywords: maps[i].keywords,
                published: maps[i].published
            }
        )
    }
    return res.status(201).json({
        success: true,
        userMapsNoGeoJson: mapsNoGeoJson
    })
}

async function getMapById(req, res) {
    const map = await Map.findById({_id: req.params.id});
    return res.status(201).json({
        success: true,
        currentMap: map
    })
}

async function duplicateMapById(req, res) {
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
    const mapToDupe = await Map.findById({_id: body.id});
    const map = new Map({
        name: mapToDupe.name,
        ownerUsername: loggedInUser.username,
        ownerEmail: loggedInUser.email,
        comments: [],
        geoJsonMap: mapToDupe.geoJsonMap,
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

async function deleteMapById(req, res) {
    console.log("id to delete", req.params.id);
    const map = await Map.findById({_id: req.params.id});
    const loggedInUser = await User.findOne({email: map.ownerEmail});
    await (Map.findOneAndDelete({ _id: req.params.id }));
    loggedInUser.mapsIOwn.splice(loggedInUser.mapsIOwn.indexOf(map._id), 1);
    loggedInUser.save();
    return res.status(201).json({});
}

async function addPolygonToMap(req, res) {
    const map = await Map.findOne({ _id: req.params.id });
    console.log("features length", map.geoJsonMap.features.length);
    let newgeojson = map.geoJsonMap;
    let newPolygon = req.body.feature;
    console.log(newPolygon.properties);
    newgeojson.features.push(newPolygon);
    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    map.save().then(() => {
    return res.status(201).json({
        map: map
    });})
}

async function updatePolygonOfMap(req, res) {
    const map = await Map.findOne({ _id: req.params.id });
    let newgeojson = map.geoJsonMap;
    var index;
    
    if (req.body.prevPolygon.properties) {
        if (req.body.prevPolygon.properties.myId) {
            index = req.body.prevPolygon.properties.myId;
        }
    }
    else {
        for (let i = 0; i < newgeojson.features.length; i++) {
            if (newgeojson.features[i].geometry.coordinates.length == req.body.prevPolygon.geometry.coordinates.length) {
                if ((newgeojson.features[i].geometry.coordinates[0][0] == req.body.prevPolygon.geometry.coordinates[0][0] && 
                    newgeojson.features[i].geometry.coordinates[0][1] == req.body.prevPolygon.geometry.coordinates[0][1]) ||
                    (newgeojson.features[i].geometry.coordinates[1][0] == req.body.prevPolygon.geometry.coordinates[1][0] && 
                        newgeojson.features[i].geometry.coordinates[1][1] == req.body.prevPolygon.geometry.coordinates[1][1])) {
                            index = i;
                        }
            }
        }
    }
    console.log(index);
    console.log(newgeojson.features[8].geometry.coordinates);
    console.log(req.body.prevPolygon.geometry.coordinates);
    newgeojson.features[index] = req.body.updatedPolygon;
    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    map.save().then(() => {
    return res.status(201).json({
        map: map
    });})
}

async function deletePolygonOfMap(req, res) {
    const map = await Map.findOne({ _id: req.params.id });
    let newgeojson = map.geoJsonMap;
    var index;
    console.log(req.body.feature);
    if (req.body.feature.properties) {
        if (req.body.feature.properties.myId) {
            index = req.body.feature.properties.myId;
        }
    }
    else {
        for (let i = 0; i < newgeojson.features.length; i++) {
            if (JSON.stringify(newgeojson.features[i].geometry.coordinates[0]) == JSON.stringify(req.body.feature.geometry.coordinates[0])) {
                index = i;
            }
        }
    }
    console.log(index);
    console.log("prev length", newgeojson.features.length);
    newgeojson.features.splice(index, 1);
    console.log("updated length", newgeojson.features.length);
    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    map.save().then(() => {
    return res.status(201).json({
        map: map
    });})
}


module.exports = {
    createNewMap,
    updateMapCustomProperties,
    loadUserMaps,
    loadUserMapsNoGeoJson,
    getMapById,
    duplicateMapById,
    deleteMapById,
    addPolygonToMap,
    updatePolygonOfMap,
    deletePolygonOfMap
}