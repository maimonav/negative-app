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
    this.name = name !== undefined ? name : this.name;
    this.contactDetails =
      contactDetails !== undefined ? contactDetails : this.contactDetails;
    return DataBase.singleUpdate(
      "supplier",
      { id: this.id },
      { name: this.name, contactDetails: this.contactDetails }
    );
  }

  async removeSupplier() {
    this.isSupplierRemoved = new Date();
    let result = DataBase.singleUpdate(
      "supplier",
      { id: this.id },
      { isSupplierRemoved: this.isSupplierRemoved }
    );
    if (typeof result === "string") {
      return "The supplier cannot be removed\n" + result;
    }
    return true;
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
