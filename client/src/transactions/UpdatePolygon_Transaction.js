import jsTPS_Transaction from "../common/jsTPS.js"


export default class UpdatePolygon_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPrevPolygon, initUpdatedPolygon) {
        super();
        this.store = initStore;
        this.prevPolygon = initPrevPolygon;
        this.updatedPolygon = initUpdatedPolygon;
    }

    doTransaction() {
        this.store.updatePolygonOfMap(this.prevPolygon, this.updatedPolygon);
    }
    
    undoTransaction() {
        this.store.updatePolygonOfMap(this.updatedPolygon, this.prevPolygon);
    }
}