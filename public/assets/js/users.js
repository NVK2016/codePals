
//Ready Event occurs when all the DOM elements are loaded 
$(document).ready(function () {
  console.log("Inside Client Side User JS file");


  //Update Profile when the submits data expect for the email address 
  $("#btn-update").on("click", function () {

    // alert("updating profile");

    //Loop through all the selected skills from Chosen DropoDOown list 
    var newSkills = [];
    $.each($("#selectSkills option:selected"), function(){            
      newSkills.push($(this).attr("id"));
    });
    // alert("You have selected the  - " + newSkills.join(", "));

    // Constructing a updateProfile object to hand to the database
    var updateUser = {
      firstName: $("#firstName").val().trim(),
      lastName: $("#lastName").val().trim(),
      // passw: $("#password").val().trim(),
      // email: $("#email").val().trim(),
      city: $("#city").val().trim(),
      state: $("#state").val().trim(),
      phone: $("#phone").val().trim(),
      photoLink: $("#photo").val().trim(),
      //All the addiotional skills added 
      userskills: newSkills
    };

    // alert("Data", JSON.stringify(updateUser)); 
    //Pass the api route path for performing the database changes 
    $.ajax({
      method: "PUT",
      url: "/upduser",
      data: updateUser,
      dataType: "JSON"
    })
      .done(function (result) {
        //Need to change it to dashboard 
        console.log("Test Message", result);
        // window.location.href = "./dashboard";
      })
      .fail(function (error) {
        console.log(error); 
        console.log("There was an error when updating a existing user profile");
      });
  })

  //Add a new Skill into the database  
  $("#btn-newSkill").on("click", function () {

    // alert("Add New Skill");
    //Grab values fro mthe fields & send it to the post requestt 
    var skillName = $("#skillName").val().trim(); 
    var skillType = $("#skillType").val().trim(); 

    alert(skillName, skillType); 
    //Create a new object 
    var newSkillObj = { 
      skill : skillName, 
      skillType: skillType
    }
    console.log("New Skill Obj", newSkillObj);
    
    //Pass the api route to create a newe record 
    $.ajax({
      method: "POST",
      url: "/addskill",
      data: newSkillObj,
      dataType: "JSON"
    })
      .done(function () {
        //render the upduser again 
        console.log("Test Message");
        alert( window.location.href);
        window.location.href = "/upduser";
      })
      .fail(function () {
        console.log("There was an error when adding a new skill");
      });
  });

  function sendMail() {
    var link = "mailto:me@example.com"
             + "?cc=myCCaddress@example.com"
             + "&subject=" + escape("This is my subject")
             + "&body=" + escape(document.getElementById('myText').value)
    ;

    window.location.href = link;
  }
});
