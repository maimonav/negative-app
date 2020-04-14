const Sequelize = require('sequelize');


const userSchema = () => {
  return {
    // attributes
    id: { type: Sequelize.INTEGER, primaryKey: true },
    username: { type: Sequelize.STRING, notEmpty: true, allowNull: false },
    password: { type: Sequelize.STRING, notEmpty: true, allowNull: false },
    permissions: { type: Sequelize.ENUM('ADMIN', 'MANAGER', 'DEPUTY_MANAGER', 'SHIFT_MANAGER', 'EMPLOYEE'), allowNull: false, defaultValue: 'EMPLOYEE' },
    isUserRemoved: { type: Sequelize.DATE, defaultValue: null },
  }
};

const employeeSchema = (User) => {
  return {
    // attributes
    id: {
      type: Sequelize.INTEGER, primaryKey: true,
      references: {
        // This is a reference to another model
        model: User,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    firstName: { type: Sequelize.STRING, notEmpty: true, allowNull: false, isAlpha: true },
    lastName: { type: Sequelize.STRING, notEmpty: true, allowNull: false, isAlpha: true },
    contactDetails: { type: Sequelize.STRING, notEmpty: true, allowNull: false },
    isEmployeeRemoved: { type: Sequelize.DATE, defaultValue: null },
  }
};

const movieSchema = (Category) => {
  return {
    // attributes
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: { type: Sequelize.STRING, notEmpty: true, allowNull: false },
    categoryId: {
      type: Sequelize.INTEGER, allowNull: false, 
      references: {
        // This is a reference to another model
        model: Category,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    movieKey: { type: Sequelize.STRING, notEmpty: true, defaultValue: null },
    examinationRoom: { type: Sequelize.INTEGER, defaultValue: null },
    isMovieRemoved: { type: Sequelize.DATE, defaultValue: null }
  }
};


const cafeteriaProductSchema = (Category) => {
  return {
    // attributes
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: { type: Sequelize.STRING, notEmpty: true, allowNull: false },
    categoryId: {
      type: Sequelize.INTEGER, allowNull: false, 
      references: {
        // This is a reference to another model
        model: Category,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    price: { type: Sequelize.DOUBLE, allowNull: false },
    quantity: { type: Sequelize.INTEGER, allowNull: false },
    maxQuantity: { type: Sequelize.INTEGER, defaultValue: 9999999 },
    minQuantity: { type: Sequelize.INTEGER, defaultValue: -1 },
    isProductRemoved: { type: Sequelize.DATE, defaultValue: null }

  }
};

const categorySchema = () => {
  return {
    // attributes
    id: { type: Sequelize.INTEGER, primaryKey: true },
    parentId: { type: Sequelize.INTEGER, defaultValue: -1 },
    name: { type: Sequelize.STRING, allowNull: false, notEmpty: true },
    isCategoryRemoved: { type: Sequelize.DATE, defaultValue: null }
  }
};

const supplierSchema = () => {
  return {
    // attributes
    id: { type: Sequelize.INTEGER, primaryKey: true },
    name: { type: Sequelize.STRING, notEmpty: true, allowNull: false },
    contactDetails: { type: Sequelize.STRING, notEmpty: true, allowNull: false },
    isSupplierRemoved: { type: Sequelize.DATE, defaultValue: null },
  }
};


const orderSchema = (Employee, Supplier) => {
  return {
    // attributes
    id: { type: Sequelize.INTEGER, primaryKey: true },
    date: { type: Sequelize.DATE, allowNull: false },
    creatorEmployeeId: {
      type: Sequelize.INTEGER, allowNull: false,
      references: {
        // This is a reference to another model
        model: Employee,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    recipientEmployeeId: {
      type: Sequelize.INTEGER,
      references: {
        // This is a reference to another model
        model: Employee,

        // This is the column name of the referenced model
        key: 'id'
      }
      , defaultValue: null
    },
    supplierId: {
      type: Sequelize.INTEGER, allowNull: false, 
      references: {
        // This is a reference to another model
        model: Supplier,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
  }
};


const movieOrderSchema = (Movie, Order) => {
  return {
    // attributes
    orderId: {
      type: Sequelize.INTEGER, primaryKey: true,
      references: {
        // This is a reference to another model
        model: Movie,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    movieId: {
      type: Sequelize.INTEGER, primaryKey: true,
      references: {
        // This is a reference to another model
        model: Order,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    expectedQuantity: { type: Sequelize.INTEGER, min: 0, defaultValue: 0 },
    actualQuantity: { type: Sequelize.INTEGER, min: 0, defaultValue: 0 },
  }
};

const cafeteriaProductOrderSchema = (CafeteriaProduct, Order) => {
  return {
    // attributes
    orderId: {
      type: Sequelize.INTEGER, primaryKey: true,
      references: {
        // This is a reference to another model
        model: CafeteriaProduct,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    productId: {
      type: Sequelize.INTEGER, primaryKey: true,
      references: {
        // This is a reference to another model
        model: Order,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    expectedQuantity: { type: Sequelize.INTEGER, min: 0, defaultValue: 0 },
    actualQuantity: { type: Sequelize.INTEGER, min: 0, defaultValue: 0 }
  }
};


const incomesDailyReportSchema = (Employee) => {
  return {
    // attributes
    date: { type: Sequelize.DATE, primaryKey: true },
    creatorEmployeeId: {
      type: Sequelize.INTEGER, allowNull: false,
      references: {
        // This is a reference to another model
        model: Employee,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    numOfTabsSales: { type: Sequelize.INTEGER, allowNull: false },
    cafeteriaCashRevenues: { type: Sequelize.DOUBLE, allowNull: false },
    cafeteriaCreditCardRevenues: { type: Sequelize.DOUBLE, allowNull: false },
    ticketsCashRevenues: { type: Sequelize.DOUBLE, allowNull: false },
    ticketsCreditCardRevenues: { type: Sequelize.DOUBLE, allowNull: false },
    tabsCashRevenues: { type: Sequelize.DOUBLE, allowNull: false },
    tabsCreditCardRevenues: { type: Sequelize.DOUBLE, allowNull: false },
  }
};


const moviesDailyReportSchema = (Movie, Employee) => {
  return {
    // attributes
    date: { type: Sequelize.DATE, primaryKey: true },
    creatorEmployeeId: {
      type: Sequelize.INTEGER, allowNull: false,
      references: {
        // This is a reference to another model
        model: Employee,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    movieId: {
      type: Sequelize.INTEGER, primaryKey: true,
      references: {
        // This is a reference to another model
        model: Movie,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    theater: { type: Sequelize.INTEGER, allowNull: false },
    numOfTicketsSales: { type: Sequelize.INTEGER, allowNull: false },
    numOfUsedTickets: { type: Sequelize.INTEGER, allowNull: false },
    wasAirConditionGlitches: { type: Sequelize.BOOLEAN, defaultValue: false }
  }
};

const generalPurposeDailyReportSchema = (Employee) => {
  return {
    // attributes
    date: { type: Sequelize.DATE, primaryKey: true },
    creatorEmployeeId: {
      type: Sequelize.INTEGER, allowNull: false,
      references: {
        // This is a reference to another model
        model: Employee,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    additionalProps: { type: Sequelize.JSON, allowNull: false }
  }
};

const inventoryDailyReportSchema = (CafeteriaProduct, Employee) => {
  return {
    // attributes
    date: { type: Sequelize.DATE, primaryKey: true },
    productId: {
      type: Sequelize.INTEGER, primaryKey: true,
      references: {
        // This is a reference to another model
        model: CafeteriaProduct,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    creatorEmployeeId: {
      type: Sequelize.INTEGER, allowNull: false,
      references: {
        // This is a reference to another model
        model: Employee,

        // This is the column name of the referenced model
        key: 'id'
      }
    },
    quantitySold: { type: Sequelize.INTEGER, allowNull: false },
    quantityInStock: { type: Sequelize.INTEGER, allowNull: false },
    stockThrown: { type: Sequelize.INTEGER, allowNull: false }
  }
};


/*validate: {
    is: ["^[a-z]+$",'i'],     // will only allow letters
    is: /^[a-z]+$/i,          // same as the previous example using real RegExp
    not: ["[a-z]",'i'],       // will not allow letters
    isEmail: true,            // checks for email format (foo@bar.com)
    isUrl: true,              // checks for url format (http://foo.com)
    isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
    isIPv4: true,             // checks for IPv4 (129.89.23.1)
    isIPv6: true,             // checks for IPv6 format
    isAlpha: true,            // will only allow letters
    isAlphanumeric: true,     // will only allow alphanumeric characters, so "_abc" will fail
    isNumeric: true,          // will only allow numbers
    isInt: true,              // checks for valid integers
    isFloat: true,            // checks for valid floating point numbers
    isDecimal: true,          // checks for any numbers
    isLowercase: true,        // checks for lowercase
    isUppercase: true,        // checks for uppercase
    notNull: true,            // won't allow null
    isNull: true,             // only allows null
    notEmpty: true,           // don't allow empty strings
    equals: 'specific value', // only allow a specific value
    contains: 'foo',          // force specific substrings
    notIn: [['foo', 'bar']],  // check the value is not one of these
    isIn: [['foo', 'bar']],   // check the value is one of these
    notContains: 'bar',       // don't allow specific substrings
    len: [2,10],              // only allow values with length between 2 and 10
    isUUID: 4,                // only allow uuids
    isDate: true,             // only allow date strings
    isAfter: "2011-11-05",    // only allow date strings after a specific date
    isBefore: "2011-11-05",   // only allow date strings before a specific date
    max: 23,                  // only allow values <= 23
    min: 23,                  // only allow values >= 23
    isCreditCard: true,       // check for valid credit card numbers

    // Examples of custom validators:
    isEven(value) {
      if (parseInt(value) % 2 !== 0) {
        throw new Error('Only even values are allowed!');
      }
    }
    isGreaterThanOtherField(value) {
      if (parseInt(value) <= parseInt(this.otherField)) {
        throw new Error('Bar must be greater than otherField.');
      }
    }
  }*/





exports.userSchema = userSchema
exports.employeeSchema = employeeSchema;
exports.movieSchema = movieSchema;
exports.cafeteriaProductSchema = cafeteriaProductSchema;
exports.categorySchema = categorySchema;
exports.movieOrderSchema = movieOrderSchema;
exports.cafeteriaProductOrderSchema = cafeteriaProductOrderSchema;
exports.orderSchema = orderSchema;
exports.supplierSchema = supplierSchema;
exports.incomesDailyReportSchema = incomesDailyReportSchema;
exports.moviesDailyReportSchema = moviesDailyReportSchema;
exports.inventoryDailyReportSchema = inventoryDailyReportSchema;
exports.generalPurposeDailyReportSchema = generalPurposeDailyReportSchema;
