var xlsx = require('json-as-xlsx')
 
var columns = [
  { label: 'Email', value: 'email' }, // Top level data
  { label: 'Age', value: row => (row.age + ' years') }, // Run functions
  { label: 'Password', value: row => (row.hidden ? row.hidden.password : '') }, // Deep props
]
 
var content = [
  { email: 'Ana', age: 16, 
  : { password: '11111111' } },
  { email: 'Luis', age: 19, hidden: { password: '12345678' } }
]
 
var settings = {
  sheetName: 'First sheet',
  fileName: 'Users',
  extraLength: 3
}
 
xlsx(columns, content, settings) // Will download the excel file