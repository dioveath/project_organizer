/**
 *
 * File: utils.js
 * Author: Saroj Rai @ CharichaSoftwares
 * Created On: Tuesday, 29 June 2021.
 *
 * Summary: Some utility functions 
 *
 * Copyright(c) 2021 All Rights Reserved for CharichaSoftwares
 */

let sqlToJsDate = function (d){
  return new Date(d.replace('T', ' ').replace('Z', ' '));
};

let jsToSqlDate = d => d.toISOString().slice(0, 10).replace('T', ' ');
let jsToSqlDateTime = d => d.toISOString().slice(0, 19).replace('T', ' ');

const _sqlToJsDate = sqlToJsDate;
export { _sqlToJsDate as sqlToJsDate };

const _jsToSqlDate = jsToSqlDate;
export { _jsToSqlDate as jsToSqlDate };

const _jsToSqlDateTime = jsToSqlDateTime;
export { _jsToSqlDateTime as jsToSqlDateTime };

