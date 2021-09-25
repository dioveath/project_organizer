function validateMember(member) {
  // TODO: return object with error message and error status 
  if(!(member.username && 
       member.password &&
       member.level &&
       member.email &&
       member.efforts_put
      )) {
    throw Error("All Member fields are not set!");
  }

  if(member.username.length < 4) {
    throw Error("Member Name must  be more than 3 characters!");
  }

  if(member.password.length <= 6) {
    throw Error("Password must be greater than 5");
  }

  return true;
}

export { validateMember };
