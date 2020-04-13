const DataBase = require("./DBManager");


class Supplier {
    constructor(id, name, contactDetails) {
        this.id = id;
        this.name = name;
        this.contactDetails = contactDetails;
        this.isSupplierRemoved = null;
    }


    async editSupplier(name, contactDetails){
        super.name = name;
        this.contactDetails = contactDetails;
        let result = await DataBase.update('supplier', { id: this.id }, { name: name, contactDetails: contactDetails});
        return typeof result === 'string' ? "The supplier cannot be edited\n" + result
            : "The supplier edited successfully";
    }


    async removeSupplier(){
        if (this.isSupplierRemoved == null) {
            this.isSupplierRemoved = new Date();
            let result = await DataBase.update('supplier', { id: this.id }, { isSupplierRemoved: this.isSupplierRemoved });
            return typeof result === 'string' ? "The supplier cannot be removed\n" + result
            : "The supplier removed successfully";
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