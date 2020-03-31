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


    editSupplier = (name, contactDetails) => {
        super.name = name;
        this.contactDetails = contactDetails;
        DataBase.update('supplier', { id: this.id }, { name: name, contactDetails: contactDetails});
        return "The supplier edited successfully";
    }


    removeSupplier = () => {
        if (this.isSupplierRemoved == null) {
            this.isSupplierRemoved = new Date();
            DataBase.update('supplier', { id: this.id }, { isSupplierRemoved: this.isSupplierRemoved });
            return "The supplier removed successfully";
        }
        else
            return "The supplier already removed";
    }


    equals(toCompare) {
        return (
            toCompare.id === this.id &&
            toCompare.name === this.name &&
            toCompare.contactDetails === this.contactDetails &&
            toCompare.isSupplierRemoved === this.isSupplierRemoved
        );
    }
}
module.exports = Supplier;