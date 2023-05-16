import jsTPS_Transaction from "../common/jsTPS.js"


export default class MergePolygons_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPolygonsToMerge, initMergedPolygon) {
        super();
        this.store = initStore;
        this.polygonsToMerge = initPolygonsToMerge;
        this.mergedPolygon = initMergedPolygon;
    }

    doTransaction() {
        this.store.mergePolygonsOfMap(this.polygonsToMerge, this.mergedPolygon);
    }
    
    undoTransaction() {
        this.store.undoMergePolygonsOfMap(this.polygonsToMerge, this.mergedPolygon);
    }
}