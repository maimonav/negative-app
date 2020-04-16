const DataBase = require("./DataLayer/DBManager");

class Supplier {
  constructor(id, name, contactDetails) {
    this.id = id;
    this.name = name;
    this.contactDetails = contactDetails;
    this.isSupplierRemoved = null;
  }

  async initSupplier() {
    return DataBase.singleAdd("supplier", {
      id: this.id,
      name: this.name,
      contactDetails: this.contactDetails,
    });
  }

  async editSupplier(name, contactDetails) {
    super.name = name;
    this.contactDetails = contactDetails;
    return DataBase.singleUpdate(
      "supplier",
      { id: this.id },
      { name: name, contactDetails: contactDetails }
    );
  }

  async removeSupplier() {
    this.isSupplierRemoved = new Date();
    return DataBase.singleUpdate(
      "supplier",
      { id: this.id },
      { isSupplierRemoved: this.isSupplierRemoved }
    );
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
