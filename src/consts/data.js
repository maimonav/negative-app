//TODO: Example purpose only! Need to remove when backend is ready.
export const exampleNames = [
  { title: "movie" },
  { title: "admin" },
  { title: "supplier" },
  { title: "Ralph Hubbard" }
];

const employeeDetails = {
  password: "1234",
  firstName: "aviv",
  lastName: "maimon",
  permissions: "Director",
  contactDetails: "maimonaviv@gmail.com"
};

export const exampleEmployeesDetails = new Map();
exampleEmployeesDetails.set("admin", employeeDetails);

const supplierDetails = {
  contactDetails: "maimonaviv@gmail.com"
};

export const exampleSuppliersDetails = new Map();
exampleSuppliersDetails.set("supplier", supplierDetails);
