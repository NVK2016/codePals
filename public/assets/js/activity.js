
//Ready Event occurs when all the DOM elements are loaded 
$(document).ready(function () {
    console.log("Inside Client Side Activity JS file");


    console.log("1");

    var actTypeInput;
    if ($("#projRadio").is(":checked")) {
        actTypeInput = "project";
    }
    else if ($("#meetupRadio").is(":checked")) {
        actTypeInput = "meetup";
    }

    // Adding event listeners to the form to create a new object
    //$(document).on("submit", "#activity-form", handleNewActivFormSubmit);
    //$(document).on("click", ".delete-author", handleDeleteButtonPress);

    $("#addActButton").on("click", function () {
        event.preventDefault();
        console.log("inside on button click event");


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
        console.log(actTypeInput);

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
            estimateStartDate: startDateInput,
            actType: actTypeInput,
            active: true,
            participantsIds: particIds
        }

        addActivity(addedActivity);

        /* // Don't do anything if the name fields hasn't been filled out
      if (!titleInput.val().trim().trim()) {
          console.log("Activity Title is not provided")
          return;
      }
      else if (!descriptionInput.val().trim().trim()) {
          console.log("Short Description is not provided")
          return;
      }
      // Calling the upsertAuthor function and passing in the value of the name input
      upsertAuthor({
          name: nameInput
              .val()
              .trim()
      }); */
    });

    function addActivity(activity){
        console.log(window.location.href);
        console.log("activity "+ activity)
        $.post(window.location.href, activity, function(){
          window.location.href = "/donations";
        })
        $.post("/addactivity", activity)
      .then(getAuthors);  // correct here!!!!
      }


    // Looks for a query param in the url for userId
    var url = window.location.href;
    var activityId;

    // A function to handle what happens when the form is submitted to create a new activity
    function handleNewActivFormSubmit(event) {
        event.preventDefault();
        console.log("2");
        console.log(palsInput);

        console.log(titleInput);
        console.log(locationInput);
        console.log(startDateInput);
        console.log(descriptionInput);
        console.log(actTypeInput);

        /* // Don't do anything if the name fields hasn't been filled out
        if (!titleInput.val().trim().trim()) {
            console.log("Activity Title is not provided")
            return;
        }
        else if (!descriptionInput.val().trim().trim()) {
            console.log("Short Description is not provided")
            return;
        }
        // Calling the upsertAuthor function and passing in the value of the name input
        upsertAuthor({
            name: nameInput
                .val()
                .trim()
        }); */
    }

    // Getting the infoormation for any actitivty 
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
