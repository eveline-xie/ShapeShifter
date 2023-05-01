const Map = require('../models/map-model')
const User = require('../models/user-model');
// const puppeteer = require('puppeteer');
// const html2canvas = require('html2canvas');
// const { createCanvas, loadImage } = require('canvas');
// const d3 = require('d3');


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
    let mapWithIdentifiers = body.map.features.map(function (feature, index) {
        feature.properties.myId = index;
        return feature;
    })
    body.map.features = mapWithIdentifiers;
    //let thumbnailUrl;
    /*
    const canvas = createCanvas(1000, 1000);
    const ctx = canvas.getContext('2d');
    
    // Render the GeoJSON layer onto the canvas using a library like d3.js or topojson.js
    // For example, if using d3.js:
     const path = d3.geoPath().projection(d3.geoMercator().fitSize([1000, 1000], body.map));
     ctx.fillStyle = '#fff';
     ctx.fillRect(0, 0, 1000, 1000);
     ctx.strokeStyle = '#000';
     ctx.lineWidth = 1;
     ctx.beginPath();
     path.context(ctx)(body.map);
     ctx.stroke();
    
    // Convert the canvas to a PNG buffer using a library like canvas-to-buffer or node-canvas-to-buffer
    const { createCanvas } = require('canvas');
    const canvasToBuffer = require('canvas-to-buffer');
    const buffer = canvasToBuffer(canvas, 'image/png');
    
    // Convert the PNG buffer to a data URL using the sharp library
    const sharp = require('sharp');
    const thumbnailUrl = await sharp(buffer).toFormat('png').toBuffer().then((data) => {
      return `data:image/png;base64,${data.toString('base64')}`;
    });
    
    console.log(thumbnailUrl);
    */
    const map = new Map({
        name: "Untitled",
        ownerUsername: loggedInUser.username,
        ownerEmail: loggedInUser.email,
        comments: [],
        geoJsonMap: body.map,
        collaborators: [],
        keywords: [],
        published: { isPublished: false, publishedDate: new Date()
         //   ,thumbnail: thumbnailUrl 
    }
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
    const map = await Map.findById({ _id: req.params.id });
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
    const mapToDupe = await Map.findById({ _id: body.id });
    const map = new Map({
        name: mapToDupe.name,
        ownerUsername: loggedInUser.username,
        ownerEmail: loggedInUser.email,
        comments: [],
        geoJsonMap: mapToDupe.geoJsonMap,
        collaborators: [],
        keywords: [],
        published: { isPublished: false, publishedDate: new Date() }
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

    // if (req.body.prevPolygon.properties) {
    //     if (req.body.prevPolygon.properties.myId) {
    //         index = req.body.prevPolygon.properties.myId;
    //     }
    // }
    // else {
        // for (let i = 0; i < newgeojson.features.length; i++) {
        //     if (JSON.stringify(newgeojson.features[i].geometry.coordinates[0][0]) == JSON.stringify(req.body.prevPolygon.geometry.coordinates[0][0])) {
        //         index = i;
        //     }
        // }
    // }

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
    });
  }
  return res.status(201).json({
    success: true,
    publishedMaps: maps,
  });
}

async function loadSharedMaps(req, res) {
  const loggedInUser = await User.findOne({ _id: req.userId });
  console.log("logged in user for share: "+loggedInUser.username);
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
    });
  }
    // console.log(maps);
  return res.status(201).json({
    success: true,
    sharedMaps: maps,
  });
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
  deletePolygonOfMap,
  publishMap,
  loadPublishedMaps,
  loadSharedMaps,
};