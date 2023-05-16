import jsTPS_Transaction from "../common/jsTPS.js"


export default class SplitPolygon_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPolygonToSplit, initSplitPolygons) {
        super();
        this.store = initStore;
        this.polygonToSplit = initPolygonToSplit;
        this.splitPolygons = initSplitPolygons;
    }

    doTransaction() {
        this.store.undoMergePolygonsOfMap(this.splitPolygons, this.polygonToSplit);
    }
    
    undoTransaction() {
        this.store.mergePolygonsOfMap(this.splitPolygons, this.polygonToSplit);
    }
}