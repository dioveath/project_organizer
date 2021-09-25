
var authUrl = "http://localhost:1234/auth";

$('input[name~="loginButton"]').click( async (e)=> {
  e.preventDefault();

  var username = $('input[name~="username"]').val();
  var password = $('input[name~="password"]').val();  

  $.post(`${authUrl}/login`, {username, password}, (data) => {
    console.log(data);
    if(data.status !== "Success"){
      $("#error").text(data.message);
      return;
    }
    location.href = "/dashboard";
  });

});


