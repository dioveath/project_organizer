

var authUrl = "http://localhost:1234/auth";

$('input[name~="registerButton"]').click(async (e) => {
  e.preventDefault();
  $("#error").text("");

  var username =  $('input[name~="username"]').val();
  var email =  $('input[name~="email"]').val();
  var password =  $('input[name~="password"]').val();  
  var confirmPassword =  $('input[name~="confirmPassword"]').val();
  var level = 1;
  var efforts_put = 1;

  console.log(password, confirmPassword);

  if(password !== confirmPassword) {
    $("#error").text("Password & Confirm Password mismatch!");
    return;
  }

  $.post(`${authUrl}/register`, {username, password, email, level, efforts_put}, (data) => {
    console.log(data);
    if(data.status !== "Success") {
      $("#error").text(data.message);
      return;
    }
    location.href = "/dashboard";
  });

});
 
