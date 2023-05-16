import jsTPS_Transaction from "../common/jsTPS.js"


export default class DeletePolygon_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPolygon) {
        super();
        this.store = initStore;
        this.polygon = initPolygon;
    }

    doTransaction() {
        this.store.deletePolygonOfMap(this.polygon);
    }
    
    undoTransaction() {
        this.store.addPolygonToMap(this.polygon);
    }
}