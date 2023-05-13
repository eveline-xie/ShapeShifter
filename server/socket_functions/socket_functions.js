const Map = require('../models/map-model')
const User = require('../models/user-model');

async function addPolygonToMap(id, feature) {
    const map = await Map.findOne({ _id: id });
    console.log("features length", map.geoJsonMap.features.length);
    let newgeojson = map.geoJsonMap;
    let newPolygon = feature;
    console.log(newPolygon.properties);
    newgeojson.features.push(newPolygon);
    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    await map.save();
    return map;
}

async function updatePolygonOfMap(id, prevPolygon, updatedPolygon) {
    const map = await Map.findOne({ _id: id });
    let newgeojson = map.geoJsonMap;
    var index;

    for (let i = 0; i < newgeojson.features.length; i++) {
        if (newgeojson.features[i].geometry.type == "Polygon" &&
            prevPolygon.geometry.type == "Polygon") {
            if (((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0] -
                prevPolygon.geometry.coordinates[0][0][0]) <= .00001) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][1] -
                    prevPolygon.geometry.coordinates[0][0][1]) <= .00001)) &&
                ((Math.abs(newgeojson.features[i].geometry.coordinates[0][1][0] -
                    prevPolygon.geometry.coordinates[0][1][0]) <= .00001) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][1][1] -
                        prevPolygon.geometry.coordinates[0][1][1]) <= .00001))) {
                index = i;
                break;
            }
        }
        else if (newgeojson.features[i].geometry.type == "MultiPolygon" &&
            prevPolygon.geometry.type == "MultiPolygon") {
            if ((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][0] -
                prevPolygon.geometry.coordinates[0][0][0][0]) <= .00001 &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][1] -
                    prevPolygon.geometry.coordinates[0][0][0][1]) <= .00001)) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][0] -
                    prevPolygon.geometry.coordinates[1][0][0][0]) <= .00001 &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][1] -
                        prevPolygon.geometry.coordinates[1][0][0][1]) <= .00001))) {
                index = i;
                break;
            }
        }
    }
    if (index == undefined) {
        for (let i = 0; i < newgeojson.features.length; i++) {
            if (JSON.stringify(newgeojson.features[i].geometry.coordinates[0][0]) == JSON.stringify(prevPolygon.geometry.coordinates[0][0])) {
                index = i;
            }
        }
    }

    console.log(index);
    newgeojson.features[index] = updatedPolygon;
    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    await map.save();
    return map;
}

async function deletePolygonOfMap(id, feature) {
    const map = await Map.findOne({ _id: id });
    let newgeojson = map.geoJsonMap;
    var index;
    console.log(feature);
    for (let i = 0; i < newgeojson.features.length; i++) {
        if (newgeojson.features[i].geometry.type == "Polygon" &&
            feature.geometry.type == "Polygon") {
            if (((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0] -
                feature.geometry.coordinates[0][0][0]) <= .00001) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][1] -
                    feature.geometry.coordinates[0][0][1]) <= .00001)) &&
                ((Math.abs(newgeojson.features[i].geometry.coordinates[0][1][0] -
                    feature.geometry.coordinates[0][1][0]) <= .00001) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][1][1] -
                        feature.geometry.coordinates[0][1][1]) <= .00001))) {
                index = i;
                break;
            }
        }
        else if (newgeojson.features[i].geometry.type == "MultiPolygon" &&
            feature.geometry.type == "MultiPolygon") {
            if ((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][0] -
                feature.geometry.coordinates[0][0][0][0]) <= .00001 &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][1] -
                    feature.geometry.coordinates[0][0][0][1]) <= .00001)) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][0] -
                    feature.geometry.coordinates[1][0][0][0]) <= .00001 &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][1] -
                        feature.geometry.coordinates[1][0][0][1]) <= .00001))) {
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
    await map.save();
    return map;
}

async function mergePolygonsOfMap(id, polygonsToMerge, mergedPolygon) {
    const map = await Map.findOne({ _id: id });
    let newgeojson = map.geoJsonMap;
    var index;
    console.log(polygonsToMerge);

    for (let j = 0; j < polygonsToMerge.length; j++) {
        for (let i = 0; i < newgeojson.features.length; i++) {
            if (newgeojson.features[i].geometry.type == "Polygon" &&
                polygonsToMerge[j].geometry.type == "Polygon") {
                if (((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0] -
                    polygonsToMerge[j].geometry.coordinates[0][0][0]) <= .00001) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][1] -
                        polygonsToMerge[j].geometry.coordinates[0][0][1]) <= .00001)) &&
                    ((Math.abs(newgeojson.features[i].geometry.coordinates[0][1][0] -
                        polygonsToMerge[j].geometry.coordinates[0][1][0]) <= .00001) &&
                        (Math.abs(newgeojson.features[i].geometry.coordinates[0][1][1] -
                            polygonsToMerge[j].geometry.coordinates[0][1][1]) <= .00001))) {
                    index = i;
                    break;
                }
            }
            else if (newgeojson.features[i].geometry.type == "MultiPolygon" &&
                polygonsToMerge[j].geometry.type == "MultiPolygon") {
                if ((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][0] -
                    polygonsToMerge[j].geometry.coordinates[0][0][0][0]) <= .00001 &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][1] -
                        polygonsToMerge[j].geometry.coordinates[0][0][0][1]) <= .00001)) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][0] -
                        polygonsToMerge[j].geometry.coordinates[1][0][0][0]) <= .00001 &&
                        (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][1] -
                            polygonsToMerge[j].geometry.coordinates[1][0][0][1]) <= .00001))) {
                    index = i;
                    break;
                }
            }
        }
        newgeojson.features.splice(index, 1);
    }
    newgeojson.features.push(mergedPolygon);

    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    await map.save();
    return map;
}

async function undoMergePolygonsOfMap(id, polygonsToMerge, mergedPolygon) {
    const map = await Map.findOne({ _id: id });
    let newgeojson = map.geoJsonMap;
    var index;
    console.log("test", map);
    console.log("mergedpolygon", mergedPolygon);
    console.log("polygons to merge", polygonsToMerge)
    for (let i = 0; i < newgeojson.features.length; i++) {
        if (newgeojson.features[i].geometry.type == "Polygon" &&
            mergedPolygon.geometry.type == "Polygon") {
            if (((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0] -
                mergedPolygon.geometry.coordinates[0][0][0]) <= .00001) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][1] -
                    mergedPolygon.geometry.coordinates[0][0][1]) <= .00001)) &&
                ((Math.abs(newgeojson.features[i].geometry.coordinates[0][1][0] -
                    mergedPolygon.geometry.coordinates[0][1][0]) <= .00001) &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[0][1][1] -
                        mergedPolygon.geometry.coordinates[0][1][1]) <= .00001))) {
                index = i;
                break;
            }
        }
        else if (newgeojson.features[i].geometry.type == "MultiPolygon" &&
            mergedPolygon.geometry.type == "MultiPolygon") {
            if ((Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][0] -
                mergedPolygon.geometry.coordinates[0][0][0][0]) <= .00001 &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[0][0][0][1] -
                    mergedPolygon.geometry.coordinates[0][0][0][1]) <= .00001)) &&
                (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][0] -
                    mergedPolygon.geometry.coordinates[1][0][0][0]) <= .00001 &&
                    (Math.abs(newgeojson.features[i].geometry.coordinates[1][0][0][1] -
                        mergedPolygon.geometry.coordinates[1][0][0][1]) <= .00001))) {
                index = i;
                break;
            }
        }
    }
    console.log(index);
    console.log("prev length", newgeojson.features.length);
    newgeojson.features.splice(index, 1);
    console.log("updated length", newgeojson.features.length);

    newgeojson.features.push(polygonsToMerge[0]);
    newgeojson.features.push(polygonsToMerge[1]);

    map.geoJsonMap = "";
    map.geoJsonMap = newgeojson;
    await map.save();
    return map;
}

module.exports = {
    addPolygonToMap,
    updatePolygonOfMap,
    deletePolygonOfMap,
    mergePolygonsOfMap,
    undoMergePolygonsOfMap
    
};