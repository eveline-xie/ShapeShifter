const Map = require('../models/map-model')
const User = require('../models/user-model');
// const puppeteer = require('puppeteer');
// const html2canvas = require('html2canvas');
// const { createCanvas, loadImage } = require('canvas');
// const d3 = require('d3');
const shpwrite = require('shp-write');
const toGeoJSON = require('togeojson');
const fs = require('fs');
const { convert } = require('geojson2shp');
const os = require('os');

async function createNewMap(req, res) {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a map',
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
        published: {
            isPublished: false, publishedDate: new Date(),
            //   ,thumbnail: thumbnailUrl 
        },
        thumbnail: req.body.thumbnail
    })

    if (!map) {
        return res.status(400).json({ success: false, error: err })
    }
    loggedInUser.mapsIOwn.push(map._id);
    await loggedInUser.save();
    await map.save();
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

    const map = await Map.findOne({ _id: body.id });
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
    const maps = await Map.find({ ownerEmail: loggedInUser.email });
    return res.status(201).json({
        success: true,
        userMaps: maps
    })
}

async function loadUserMapsNoGeoJson(req, res) {
    const loggedInUser = await User.findOne({ _id: req.userId });
    const maps = await Map.find({ ownerEmail: loggedInUser.email });
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
                published: maps[i].published,
                thumbnail: maps[i].thumbnail
            }
        )
    }
    return res.status(201).json({
        success: true,
        userMapsNoGeoJson: mapsNoGeoJson
    })
}

async function getMapById(req, res) {
    const map = await Map.findById({ _id: req.params.id });
    return res.status(201).json({
        success: true,
        currentMap: map
    })
}

async function getShpDbfFileById(req, res) {
    const map = await Map.findById({ _id: req.params.id });
    if (!map) {
        return res.status(500).json({
            errorMessage: "Failed to find map"
        })
    }
//     const geojsonMap = map.geoJsonMap;
//     var options = {
//         folder: 'myshapes',
//         types: {
//             point: 'mypoints',
//             polygon: 'mypolygons',
//             line: 'mylines'
//         }
//     }
//     // a GeoJSON bridge for features
//     const myFile = shpwrite.zip(map.geoJsonMap, options);
//     console.log(myFile);
//     res.setHeader('Content-Type', 'application/zip');
//   // Set the content disposition to attachment, which prompts the browser to download the file
//     res.setHeader('Content-Disposition', `attachment; filename=shapefile.zip`);
//     return res.status(201).send(myFile);
//     // const options = { encoding: 'utf-8' };
//     // const shp = shpwrite.zip(features, options);
//     // fs.writeFileSync('output.zip', shp);
//     // const zip = new require('node-zip')();
//     // zip.load(fs.readFileSync('output.zip'));
//     // const dbf = zip.files['output.dbf'].asNodeBuffer();
//     // fs.writeFileSync('output.dbf', dbf);
//     // return res.status(201).send(zip);
    const options = {
        layer: "test"
    }
    let path = `${os.tmpdir()}/${map.name
        .replace(" ", "_")
        .replace("/", "_")
    .replace("\\", "_")}_shp.zip`;
    let stream = fs.createWriteStream(path);
    console.log("themap", map.geoJsonMap);
    await convert(map.geoJsonMap, stream, options);
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error(err);
        }
        fs.unlink(path, (err) => {
            if (err) {
                console.error(err);
            }
        });
        console.log(data);
        return res.status(201).send(data);
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
    const mapToDupe = await Map.findById({ _id: body.id });
    let newName = "Copy of " + mapToDupe.name;
    const map = new Map({
        name: newName,
        ownerUsername: loggedInUser.username,
        ownerEmail: loggedInUser.email,
        comments: [],
        geoJsonMap: mapToDupe.geoJsonMap,
        collaborators: [],
        keywords: [],
        published: { isPublished: false, publishedDate: new Date() },
        thumbnail: mapToDupe.thumbnail,
    });
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
    const map = await Map.findById({ _id: req.params.id });
    const loggedInUser = await User.findOne({ email: map.ownerEmail });
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
        });
    })
}

async function updatePolygonOfMap(req, res) {
    const map = await Map.findOne({ _id: req.params.id });
    let newgeojson = map.geoJsonMap;
    var index;

    for (let i = 0; i < newgeojson.features.length; i++) {
        if (newgeojson.features[i].geometry.type == "Polygon" &&
            req.body.prevPolygon.geometry.type == "Polygon") {
            console.log(newgeojson.features[i].geometry.coordinates[0][0]);
            console.log(req.body.prevPolygon.geometry.coordinates[0][0]);
            if (((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0] -
                req.body.prevPolygon.geometry.coordinates[0][0][0]) <= .00001) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][1] -
                    req.body.prevPolygon.geometry.coordinates[0][0][1]) <= .00001)) &&
                ((Math.abs(newgeojson.features[i].geometry.coordinates[0][1][0] -
                    req.body.prevPolygon.geometry.coordinates[0][1][0]) <= .00001) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][1][1] -
                        req.body.prevPolygon.geometry.coordinates[0][1][1]) <= .00001))) {
                index = i;
                break;
            }
        }
        else if (newgeojson.features[i].geometry.type == "MultiPolygon" &&
            req.body.prevPolygon.geometry.type == "MultiPolygon") {
            console.log(newgeojson.features[i].geometry.coordinates[1][0][0]);
            console.log(req.body.prevPolygon.geometry.coordinates[1][0][0]);
            if ((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][0] -
                req.body.prevPolygon.geometry.coordinates[0][0][0][0]) <= .00001 &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][1] -
                    req.body.prevPolygon.geometry.coordinates[0][0][0][1]) <= .00001)) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][0] -
                    req.body.prevPolygon.geometry.coordinates[1][0][0][0]) <= .00001 &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][1] -
                        req.body.prevPolygon.geometry.coordinates[1][0][0][1]) <= .00001))) {
                index = i;
                break;
            }
        }
    }
    if (index == undefined) {
        for (let i = 0; i < newgeojson.features.length; i++) {
            if (JSON.stringify(newgeojson.features[i].geometry.coordinates[0][0]) == JSON.stringify(req.body.prevPolygon.geometry.coordinates[0][0])) {
                index = i;
            }
        }
    }

    //newgeojson is the featurecollection with a property called features
    //that is an array of polygons and multipolygons

    //the prev polygon is either a polygon or a multipolygon that we are comparing
    //to the features array

    //problem is when a polygon is modified in the front end it adds an extra vertex
    //so the prev will never be the same

    console.log(index);
    newgeojson.features[index] = req.body.updatedPolygon;
    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    map.save().then(() => {
        return res.status(201).json({
            map: map
        });
    })
}

async function deletePolygonOfMap(req, res) {
    const map = await Map.findOne({ _id: req.params.id });
    let newgeojson = map.geoJsonMap;
    var index;
    console.log(req.body.feature);
    for (let i = 0; i < newgeojson.features.length; i++) {
        if (newgeojson.features[i].geometry.type == "Polygon" &&
            req.body.feature.geometry.type == "Polygon") {
            console.log(newgeojson.features[i].geometry.coordinates[0][0]);
            console.log(req.body.feature.geometry.coordinates[0][0]);
            if (((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0] -
                req.body.feature.geometry.coordinates[0][0][0]) <= .00001) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][1] -
                    req.body.feature.geometry.coordinates[0][0][1]) <= .00001)) &&
                ((Math.abs(newgeojson.features[i].geometry.coordinates[0][1][0] -
                    req.body.feature.geometry.coordinates[0][1][0]) <= .00001) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][1][1] -
                        req.body.feature.geometry.coordinates[0][1][1]) <= .00001))) {
                index = i;
                break;
            }
        }
        else if (newgeojson.features[i].geometry.type == "MultiPolygon" &&
            req.body.feature.geometry.type == "MultiPolygon") {
            console.log(newgeojson.features[i].geometry.coordinates[1][0][0]);
            console.log(req.body.feature.geometry.coordinates[1][0][0]);
            if ((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][0] -
                req.body.feature.geometry.coordinates[0][0][0][0]) <= .00001 &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][1] -
                    req.body.feature.geometry.coordinates[0][0][0][1]) <= .00001)) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][0] -
                    req.body.feature.geometry.coordinates[1][0][0][0]) <= .00001 &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][1] -
                        req.body.feature.geometry.coordinates[1][0][0][1]) <= .00001))) {
                index = i;
                break;
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
        });
    })
}

async function mergePolygonsOfMap(req, res) {
    const map = await Map.findOne({ _id: req.params.id });
    let newgeojson = map.geoJsonMap;
    var index;
    console.log(req.body.polygonsToMerge);

    for (let j = 0; j < req.body.polygonsToMerge.length; j++) {
        for (let i = 0; i < newgeojson.features.length; i++) {
            if (newgeojson.features[i].geometry.type == "Polygon" &&
                req.body.polygonsToMerge[j].geometry.type == "Polygon") {
                console.log(newgeojson.features[i].geometry.coordinates[0][0]);
                console.log(req.body.polygonsToMerge[j].geometry.coordinates[0][0]);
                if (((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0] -
                    req.body.polygonsToMerge[j].geometry.coordinates[0][0][0]) <= .00001) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][1] -
                        req.body.polygonsToMerge[j].geometry.coordinates[0][0][1]) <= .00001)) &&
                    ((Math.abs(newgeojson.features[i].geometry.coordinates[0][1][0] -
                        req.body.polygonsToMerge[j].geometry.coordinates[0][1][0]) <= .00001) &&
                        (Math.abs(newgeojson.features[i].geometry.coordinates[0][1][1] -
                            req.body.polygonsToMerge[j].geometry.coordinates[0][1][1]) <= .00001))) {
                    index = i;
                    break;
                }
            }
            else if (newgeojson.features[i].geometry.type == "MultiPolygon" &&
                req.body.polygonsToMerge[j].geometry.type == "MultiPolygon") {
                console.log(newgeojson.features[i].geometry.coordinates[1][0][0]);
                console.log(req.body.polygonsToMerge[j].geometry.coordinates[1][0][0]);
                if ((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][0] -
                    req.body.polygonsToMerge[j].geometry.coordinates[0][0][0][0]) <= .00001 &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][1] -
                        req.body.polygonsToMerge[j].geometry.coordinates[0][0][0][1]) <= .00001)) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][0] -
                        req.body.polygonsToMerge[j].geometry.coordinates[1][0][0][0]) <= .00001 &&
                        (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][1] -
                            req.body.polygonsToMerge[j].geometry.coordinates[1][0][0][1]) <= .00001))) {
                    index = i;
                    break;
                }
            }
        }
        newgeojson.features.splice(index, 1);
    }
    newgeojson.features.push(req.body.mergedPolygon);

    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    map.save().then(() => {
        return res.status(201).json({
            map: map
        });
    })
}

async function undoMergePolygonsOfMap(req, res) {
    const map = await Map.findOne({ _id: req.params.id });
    let newgeojson = map.geoJsonMap;
    var index;
    console.log(req.body.mergedPolygon);
    for (let i = 0; i < newgeojson.features.length; i++) {
        if (newgeojson.features[i].geometry.type == "Polygon" &&
            req.body.mergedPolygon.geometry.type == "Polygon") {
            console.log(newgeojson.features[i].geometry.coordinates[0][0]);
            console.log(req.body.mergedPolygon.geometry.coordinates[0][0]);
            if (((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0] -
                req.body.mergedPolygon.geometry.coordinates[0][0][0]) <= .00001) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][1] -
                    req.body.mergedPolygon.geometry.coordinates[0][0][1]) <= .00001)) &&
                ((Math.abs(newgeojson.features[i].geometry.coordinates[0][1][0] -
                    req.body.mergedPolygon.geometry.coordinates[0][1][0]) <= .00001) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][1][1] -
                        req.body.mergedPolygon.geometry.coordinates[0][1][1]) <= .00001))) {
                index = i;
                break;
            }
        }
        else if (newgeojson.features[i].geometry.type == "MultiPolygon" &&
            req.body.mergedPolygon.geometry.type == "MultiPolygon") {
            console.log(newgeojson.features[i].geometry.coordinates[1][0][0]);
            console.log(req.body.mergedPolygon.geometry.coordinates[1][0][0]);
            if ((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][0] -
                req.body.mergedPolygon.geometry.coordinates[0][0][0][0]) <= .00001 &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][1] -
                    req.body.mergedPolygon.geometry.coordinates[0][0][0][1]) <= .00001)) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][0] -
                    req.body.mergedPolygon.geometry.coordinates[1][0][0][0]) <= .00001 &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][1] -
                        req.body.mergedPolygon.geometry.coordinates[1][0][0][1]) <= .00001))) {
                index = i;
                break;
            }
        }
    }
    console.log(index);
    console.log("prev length", newgeojson.features.length);
    newgeojson.features.splice(index, 1);
    console.log("updated length", newgeojson.features.length);

    newgeojson.features.push(req.body.polygonsToMerge[0]);
    newgeojson.features.push(req.body.polygonsToMerge[1]);

    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    map.save().then(() => {
        return res.status(201).json({
            map: map
        });
    })
}

async function updateThumbnailOfMap(req, res) {
    const map = await Map.findOne({ _id: req.params.id });
    map.thumbnail = req.body.thumbnail;
    map.save().then(() => {
        return res.status(201).json({
            map: map
        });
    })
}

async function publishMap(req, res) {
    const id = req.body.id;
    console.log("publishMap: " + JSON.stringify(id));

    const map = await Map.findOne({ _id: id });
    map.published.isPublished = true;
    map.published.publishedDate = Date.now()
    map.save();
    return res.status(201).json({
        success: true,
        map: map,
    });
}

async function loadPublishedMaps(req, res) {
    const maps = await Map.find({ "published.isPublished": true });
    let mapsNoGeoJson = [];
    for (let i = 0; i < maps.length; i++) {
        mapsNoGeoJson.push({
            _id: maps[i]._id,
            name: maps[i].name,
            ownerUsername: maps[i].ownerUsername,
            ownerEmail: maps[i].ownerEmail,
            comments: maps[i].comments,
            collaborators: maps[i].collaborators,
            keywords: maps[i].keywords,
            published: maps[i].published,
            thumbnail: maps[i].thumbnail,
        });
    }
    return res.status(201).json({
        success: true,
        publishedMaps: maps,
    });
}

async function loadSharedMaps(req, res) {
    const loggedInUser = await User.findOne({ _id: req.userId });
    console.log("logged in user for share: " + loggedInUser.username);
    //   const maps = await Map.find({ ownerEmail: loggedInUser.email });
    let maps = [];
    const sharedMaps = loggedInUser.sharedWithMe;
    console.log("SharedMaps: " + sharedMaps);
    for (let i = 0; i < sharedMaps.length; i++) {
        console.log(sharedMaps[i]);
        const map = await Map.findOne({ _id: sharedMaps[i] });
        console.log(map);
        maps.push({
            _id: map._id,
            name: map.name,
            ownerUsername: map.ownerUsername,
            ownerEmail: map.ownerEmail,
            comments: map.comments,
            collaborators: map.collaborators,
            keywords: map.keywords,
            published: map.published,
            thumbnail: map.thumbnail
        });
    }
    // console.log(maps);
    return res.status(201).json({
        success: true,
        sharedMaps: maps,
    });
}

async function updateMapComments(req, res) {
    const body = req.body;
    console.log("updateMap: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: "You must provide a body to update",
        });
    }
    console.log("saved user id" + req.userId);
    const map = await Map.findOne({ _id: body.payload.mapid });
    const user = await User.findOne({ _id: req.userId });
    map.comments.push([user.username, body.payload.comments]);
    //   map.name = body.payload.name;
    //   map.keywords = body.payload.keywords;
    //   map.collaborators = body.payload.collaborators;
    map.save();
    return res.status(201).json({
        success: true,
        mapComments: map.comments,
    });
}

async function loadComments(req, res) {
    const mapid = req.query.mapid;
    console.log("mapid: " + mapid);
    const map = await Map.findOne({ _id: mapid });
    //   map.name = body.payload.name;
    //   map.keywords = body.payload.keywords;
    //   map.collaborators = body.payload.collaborators;
    return res.status(201).json({
        success: true,
        mapComments: map.comments,
    });
}

async function removeSharedMap(req, res) {
    const mapid = req.body.mapid;
    const email = req.body.email;
    const loggedInUser = await User.findOne({ email: email });
    console.log("mapidL " + mapid)
    console.log("before remove map user:" + loggedInUser);
    loggedInUser.sharedWithMe.splice(
        loggedInUser.sharedWithMe.indexOf(mapid),
        1
    );
    console.log("after before remove map user:" + loggedInUser);
    loggedInUser.save();
    return res.status(201).json({});

}

module.exports = {
    createNewMap,
    updateMapCustomProperties,
    loadUserMaps,
    loadUserMapsNoGeoJson,
    getMapById,
    getShpDbfFileById,
    removeSharedMap,

    duplicateMapById,
    deleteMapById,
    addPolygonToMap,
    updatePolygonOfMap,
    deletePolygonOfMap,
    mergePolygonsOfMap,
    undoMergePolygonsOfMap,

    updateThumbnailOfMap,

    publishMap,
    loadPublishedMaps,
    loadSharedMaps,
    updateMapComments,
    loadComments,
};