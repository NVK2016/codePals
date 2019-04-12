
//Ready Event occurs when all the DOM elements are loaded 
$(document).ready(function () 
{
    console.log("Inside Client Side User JS file"); 
  
      //Update Profile when the submits data expect for the email address 
      $("#btn-update").on("click", function(){
        
        alert("updating profile"); 

        // Constructing a updateProfile object to hand to the database
        var updateUser = {
            firstName: $("#firstName").val().trim(),
            lastName: $("#lastName").val().trim(),
            passw: $("#password").val().trim(),
            email: $("#email").val().trim(),
            city: $("#city").val().trim(),
            state: $("#state").val().trim(),
            phone: $("#phone").val().trim(),
            photoLink: $("#photo").val().trim(),
            //Take from query 
            // userId: id
        };

        alert("Data", JSON.stringify(updateUser)); 
        //Pass the api route path for performing the database changes 
        $.ajax({
            method: "PUT",
            url: "/upduser",
            data: updateUser
            })
            .done(function() {
                //Need to change it to dashboard 
                console.log("Test Message"); 
            });
      })
});
