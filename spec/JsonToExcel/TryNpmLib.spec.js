<<<<<<< HEAD
/*var xlsx = require('json-as-xlsx')
 
=======
var xlsx = require("json-as-xlsx");

>>>>>>> JsonToExcel
var columns = [
  { label: "Email", value: "email" }, // Top level data
  { label: "Age", value: (row) => row.age + " years" }, // Run functions
  {
    label: "Password",
    value: (row) => (row.hidden ? row.hidden.password : ""),
  }, // Deep props
];

var content = [
  { email: "Ana", age: 16, hidden: { password: "11111111" } },
  { email: "Luis", age: 19, hidden: { password: "12345678" } },
];

var settings = {
<<<<<<< HEAD
  sheetName: 'First sheet',
  fileName: 'Users',
  extraLength: 3
}
 
xlsx(columns, content, settings) // Will download the excel file*/
=======
  sheetName: "First sheet",
  fileName: "C:\\Users\\ASUS\\Downloads\\file",
  extraLength: 3,
};

describe("Json to excel", function() {
  it("test", async function() {
    xlsx(columns, content, settings); // Will download the excel file
  });
});
>>>>>>> JsonToExcel
