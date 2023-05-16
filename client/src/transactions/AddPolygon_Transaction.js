import jsTPS_Transaction from "../common/jsTPS.js"


export default class AddPolygon_Transaction extends jsTPS_Transaction {
    constructor(initStore, initPolygon) {
        super();
        this.store = initStore;
        this.polygon = initPolygon;
    }

    doTransaction() {
        this.store.addPolygonToMap(this.polygon);
    }
    
    undoTransaction() {
        this.store.deletePolygonOfMap(this.polygon);
    }
}