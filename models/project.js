function validateProject(proj){
  // TODO: add more checks 
  if(!(proj.name && 
       proj.description &&
       proj.status &&
       proj.budget &&
       proj.start_date &&
       proj.end_date &&
       proj.project_manager &&
       proj.progress &&
       proj.efforts_needed &&
       proj.efforts_put
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
