
//Ready Event occurs when all the DOM elements are loaded 
$(document).ready(function () {
    console.log("Inside Client Side Activity JS file"); 
    // Looks for a query param in the url for userId
    var url = window.location.href;
    var activityId;

    // Getting the infoormation for any actitivty 
    getActivity(activityId);

    //
    function getActivity(activityId){
        $.get("/dashboard?id=" + activityId, function(data) {
            console.log("Activity", data);
        });
    }

    //Edit the URL & Enable the form on Edit button click 
    $("#btn_updUser").on("click", function() 
    {
       //Append the URL 
     window.location.href = "/signup?user_id=1" ;
     console.log("update the url for editing activity"); 
   
     });

     //Update Activity when the submits data expect for the name  
     $("#btn_update").on("click", function(){

       // console.log($("#fname").val(), $("#lname").val());
       activityId = 2;  //Next to pass userID 

       // Constructing a updateActivity object to hand to the database
       var updateActivity = {
           location: $("#location").val().trim(),
           description: $("#description").val().trim(),
           estimateStartDate: $("#tentStartDate").val().trim(),
           actType: $("#actType").val().trim(),
           active: $("#active").val().trim(),
           //Take from query 
           activityId: activityId
       };

       // console.log("Data", updateUser); 
       //Pass the api route path for performing the database changes 
       $.ajax({
           method: "PUT",
           url: "/updactivity",
           data: updateActivity
           })
           .done(function() {
               //Need to change it to dashboard 
               window.location.href = "/login";
           });
     })
});
