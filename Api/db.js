import mysql from "mysql2";

const database = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  database: 'school',
  port: 3306,
});

export default database.promise();