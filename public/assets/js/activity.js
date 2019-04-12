
//Ready Event occurs when all the DOM elements are loaded 
$(document).ready(function () {
    console.log("Inside Client Side Activity JS file");

    //add an event listener for the Add Activity button on the addactivity page
    $("#addActButton").on("click", function () {
        event.preventDefault();
        console.log("inside on button click event");

        //read the radio buttons to set up activity type property
        var actTypeInput;
        if ($("#projRadio").is(':checked')) {
            actTypeInput = "project";
        }
        else if ($("#meetupRadio").is(':checked')) {
            actTypeInput = "meetup";
        }

        // Read the values from the corresponding form's controls 
        var titleInput = $("#title").val().trim();
        var locationInput = $("#location").val().trim();
        var startDateInput = $("#tentStartDate").val().trim();
        var descriptionInput = $("#description").val().trim();
        var palsInput = $("#selectCodePals").chosen().val();

        console.log(palsInput);
        console.log(titleInput);
        console.log(locationInput);
        console.log(startDateInput);
        console.log(descriptionInput);
        console.log("act type " + actTypeInput);

        var particIds = [];
        for (var i = 0; i < palsInput.length; i++) {
            particIds.push(palsInput[i].charAt(0));
        }

        if (!titleInput) {
            console.log("Activity Title is not provided")
            return;
        }

        var addedActivity = {
            adminId: 1,  //will have to authenticate the admin!!!!
            title: titleInput,
            location: locationInput,
            description: descriptionInput,
            estimateStartDate: startDateInput,
            actType: actTypeInput,
            active: true,
            participantsIds: particIds,
        }

        //call addActivity function 
        addActivity(addedActivity);

    });

    //addActivity function sends POST request with the JSON containg the data from the text/fields and other controls
    function addActivity(activity) {
        console.log(window.location.href);

        $.ajax({
            url: "/addactivity",
            method: "POST",
            data: { activity: JSON.stringify(activity) },
            dataType: "json",
        })
            .done(function (result) {
                console.log("The new activity was added successfully!")
                window.location.href = "./dashboard"; 
            })
            .fail(function () {
                console.log("There was an error when adding a new activity");
            });
    }

    // Getting the information for any actitivty 
    /*   getActivity(activityId);
  
      //
      function getActivity(activityId) {
          $.get("/dashboard?id=" + activityId, function (data) {
              console.log("Activity", data);
          });
      } */

    //Edit the URL & Enable the form on Edit button click 
    $("#btn_updUser").on("click", function () {
        //Append the URL 
        window.location.href = "/signup?user_id=1";
        console.log("update the url for editing activity");

    });

    //Update Activity when the submits data expect for the name  
    $("#btn_update").on("click", function () {

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
            .done(function () {
                //Need to change it to dashboard 
                window.location.href = "/login";
            });
    })
});
