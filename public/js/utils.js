
/**
 * Converts a sql formatted date as string to 
 * 2021-06-25T18:15:00.000Z to 2021-06-25
 */
let sqlDateStrToReadDate = d => d.toString().slice(0, 10);

function projectFormToDbObj() {
  var dbProj = {
    name:   $('input[name="projectName"]')[0].value,
    description:   $('input[name="projectDesc"]')[0].value, 
    start_date:   $('input[name="projectStart"]')[0].value, 
    end_date:   $('input[name="projectEnd"]')[0].value
  };
  return dbProj;
}
