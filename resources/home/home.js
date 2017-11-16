var post_template = require("./templates/post.hbs");

var Handlebars = require("hbsfy/runtime");

$(function() {

    populateFeed();

    $(".feedItem").click(function(){

        //location.assign("templates/profile.html");

    });

    $("#siteLogo").click(function(){

        //location.assign("/index.html");

    });

    $(".interestedBtn").click(function(){

        if ($(this).hasClass("interested")) {

            $(this).removeClass("interested");
            $("img",this).attr("src", "resources/images/unselectedgold.png");

        } else {

            $(this).addClass("interested");
            $("img",this).attr("src", "resources/images/interestedgold.png");

        }
    });

    $("#postStatusBtn").click(postStatus);
    $("#submitSignupBtn").click(userRegistration);
    $("#submitLoginBtn").click(userLogin);
    $("#signupSucessBtn").click(function(){window.location.reload();});
    $("#signoutBtn").click(logout);
});

function postStatus()
{
    $.post("/ajax/new-post",
    {
        messageBody : document.getElementById("statusEntryField").value
    }, function(retData)
    {
        populateFeed();
    }).fail(function(err)
    {
        alert("Sorry, an error occurred. Please inform an administrator.");
        console.log(err);
    });
}

function populateFeed()
{
    var feed;
    try
    {
        feed= document.getElementById("feed");
        feed.innerHTML = "<h3 class='my-3'>Feed</h3>";
    }
    catch(e)
    {
        feed = document.getElementById("offlineFeedItemContainer");
    }

    $.get("/ajax/get-posts", function(posts)
    {
        // iterate backwards for newest first
        for(var i = posts.length - 1; i >=0; i--)
        {
            feed.innerHTML += post_template(posts[i]);
        }
    }).fail(function(err)
    {
        console.log(err);
        alert("Sorry, an error occurred. Please inform an administrator");
    });
}

function userLogin(){

    // goHome();
    // return true;
    var username = $("#userLoginName").val();
    var password = $("#userLoginPassword").val();

    if (username == "") {
		$("#loginFormAlert").html("<strong>Missing information: </strong>Please enter your username.");
		$("#loginFormAlert").removeClass("hidden-xs-up");
		$("#loginFormAlert").removeClass("alert-success");
		$("#loginFormAlert").addClass("alert-warning");
        $("#userLoginEmail").focus();
        return false;
    } //else if (password == "") {
    //    $("#loginFormAlert").html("<strong>Missing information: </strong>Please enter your password.");
	//	$("#loginFormAlert").removeClass("hidden-xs-up");
	//	$("#loginFormAlert").removeClass("alert-success");
	//	$("#loginFormAlert").addClass("alert-warning");
    //    $("#userLoginPassword").focus();
    //    return false;
    //}
    else {
        $("#loginFormAlert").addClass("hidden-xs-up");
        $.ajax({
            method: "post",
            url: "/ajax/login",
            data: { usrLoginName : username, usrPass : password },
            success: function (response) {
                if (response) {
                    var obj = JSON.parse(response);
                    console.log(response);
                    console.log(obj);

					if (obj.error) {
                        console.log(obj.error);
						$("#loginFormAlert").removeClass("hidden");
						$("#loginFormAlert").removeClass("alert-success");
						$("#loginFormAlert").addClass("alert-warning");
					} else {
						location.reload();
					}
                }
            }
        });
    }


}

function logout()
{
    $.ajax({
        method: "get",
        url: "/ajax/logout",
        success: function (response) {
            location.reload();
        }
    });
}

function userRegistration() {

    var fullName = $("#userFullName").val();
    var userName = $("#userName").val();
    var password = $("#userPassword").val();
    var confirmPass = $("#userPasswordConfirm").val();

    if (fullName.trim() === "") {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter your name.");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userFirstName").focus();
        return false;
    } else if (userName.trim() == "") {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter a username.");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userLastName").focus();
        return false;
    } else if (userName.indexOf(' ') >= 0) {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter a valid user name (no spaces).");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userEmail").focus();
        return false;
    // } else if (password.trim() == "") {
	// 	$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter a valid password. Your password should not consist of only spaces.");
	// 	$("#signupFormAlert").removeClass("hidden-xs-up");
	// 	$("#signupFormAlert").removeClass("alert-success");
	// 	$("#signupFormAlert").addClass("alert-warning");
    //     $("#userPassword").focus();
    //     return false;
    } else if (password.trim() !== confirmPass.trim()) {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Passwords do not match. Please check and try again.");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userPassword").focus();
        return false;
    }

    var formData = $("#signupForm").serialize();

	$("#signupFormAlert").addClass("hidden-xs-up");

    $.ajax({
        method: "post",
        url: "/ajax/create-user",
        // in quotes because https://stackoverflow.com/questions/40734625/ajax-post-showing-an-error-when-try-to-upgrade-jquery-version
        dataType: 'JSON',
        data: formData,
        success: function(response) {
            console.log("++++++++++++++++++++++++++++++++++++");

            if (response) {
                // For now just returning a string with either success or an error msg
                // var obj = JSON.parse(response);
                console.log(response); // For now at least - Jon
            }
            showSuccessPrompt();
            return true;
        }
    });
}

// Don't need this if we're not using email addresses

// function validateEmail(email) {
//     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
//         return (true)
//     } else {
//         return false;
//     }
// }

function showActivity(label) {

    $(".tabLabel").css({
        "background-color": "#ffffff",
        "color": "#000000"
    });

    $(label).css({
        "background-color": "#81e5bc",
        "color": "#ffffff"
    });


    $(".contentItem").fadeOut("slow").attr("hidden", true);
    $("#profileActivityContent").fadeIn("slow").attr("hidden", false);

}

function showGallery(label) {

    $(".tabLabel").css({
        "background-color": "#ffffff",
        "color": "#000000"
    });

    $(label).css({
        "background-color": "#81e5bc",
        "color": "#ffffff"
    });

    $(".contentItem").fadeOut("slow").attr("hidden", true);
    $("#profilePhotosContent").fadeIn("slow").attr("hidden", false);

}

function showEvents(label) {

    $(".tabLabel").css({
        "background-color": "#ffffff",
        "color": "#000000"
    });

    $(label).css({
        "background-color": "#81e5bc",
        "color": "#ffffff"
    });

    $(".contentItem").fadeOut("slow").attr("hidden", true);
    $("#profileEventContent").attr("hidden", false).fadeIn("slow");

}

function showMessages(label) {

    $(".tabLabel").css({
        "background-color": "#ffffff",
        "color": "#000000"
    });

    $(label).css({
        "background-color": "#81e5bc",
        "color": "#ffffff"
    });

    $(".contentItem").fadeOut("slow").attr("hidden", true);
    $("#profileMailContent").attr("hidden", false).fadeIn("slow");

}

// function goHome() {
//     location.assign("index.html");
// }

// function goOffline() {
//     location.assign("login.html");
// }

function showSuccessPrompt() {

    $("#signupForm").fadeOut("slow", function() {

        $("#signupModal .modal-footer").attr("hidden",true);
        $("#successPrompt").attr("hidden", false).fadeIn("slow");

    });
}

