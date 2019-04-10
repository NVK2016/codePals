
//Ready Event occurs when all the DOM elements are loaded 
$(document).ready(function () {
    console.log("Inside Client Side User JS file"); 
     // Looks for a query param in the url for userId
     var url = window.location.href;
    
     //Edit the URL & Enable the form on Edit button click 
     $("#btn_updUser").on("click", function() 
     {
        //Append the URL 
      window.location.href = "/signup?user_id=1" ;
      console.log("update the url for eaditing profile"); 
    
      });

      //Update Profile when the submits data expect for the email address 
      $("#btn_update").on("click", function(){

        alert(window.location.href); 
        var id = 2;  //Next to pass userID 

        // Constructing a updateProfile object to hand to the database
        var updateUser = {
            firstName: $("#fname").val().trim(),
            lastName: $("#lname").val().trim(),
            passw: $("#pass").val().trim(),
            city: $("#city").val().trim(),
            state: $("#state").val().trim(),
            phone: $("#phone").val().trim(),
            //Take from query 
            userId: id
        };

        // console.log("Data", updateUser); 
        //Pass the api route path for performing the database changes 
        $.ajax({
            method: "PUT",
            url: "/upduser",
            data: updateUser
            })
            .done(function() {
                //Need to change it to dashboard 
                window.location.href = "/signup";
            });
      })
});
