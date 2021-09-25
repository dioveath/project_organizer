function validateProject(proj){
  // TODO: Use sequealize for all database later.

  if(!(proj.name != undefined &&
       proj.description != undefined &&
       proj.status != undefined &&
       proj.budget != undefined &&
       proj.start_date != undefined &&
       proj.end_date != undefined &&
       proj.project_manager != undefined &&
       proj.efforts_needed != undefined &&
       proj.efforts_put != undefined
      )){
    throw Error("All Proj fields are not set!");
  }

  if(proj.name.length < 3) {
    throw Error("Proj Name must be more than 2 Characters.");
  }
  
  if(proj.description.length <= 10) {
    throw Error("Proj Description Must contain at least 10 Characters.");
  }

  if(proj.progress <= 0 && proj.progress >= 100) {
    throw Error("Project progress should be between 0 to 100 inclusive");
  }

  return true;
}


function rowDataPacketToProj(proj){
  return {
    id: proj.id,
    name: proj.name,
    description: proj.description,
    start_date: proj.start_date, 
    end_date: proj.end_date, 
  };
}


const _validateProject = validateProject;
export { _validateProject as validateProject };

const _rowDataPacketToProj = rowDataPacketToProj;
export { _rowDataPacketToProj as rowDataPacketToProj };
