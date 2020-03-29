const DataBase = require("./DBManager");


class Supplier {
    constructor(id, name, contactDetails) {
        this.id = id;
        this.name = name;
        this.contactDetails = contactDetails;
        this.isSupplierRemoved = null;
        DataBase.add('supplier', { id: id, name: name, contactDetails: contactDetails });
        DataBase.setDestroyTimer('suppliers', false, "2 YEAR", "1 DAY", 'isSupplierRemoved');
    }

    removeSupplier = () => {
        if (this.isSupplierRemoved == null) {
            this.isSupplierRemoved = new Date();
            DataBase.update('supplier', { id: this.id }, { isSupplierRemoved: this.isSupplierRemoved });
            return true;
        }
        else
            return false;
    }


    equals(toCompare) {
        return (
            toCompare.name === this.name &&
            toCompare.contactDetails === this.contactDetails &&
            toCompare.isSupplierRemoved === this.isSupplierRemoved
        );
    }
}
module.exports = Supplier;