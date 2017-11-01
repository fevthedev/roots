$(function() {

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
});

function userLogin(){
    
    var email = $("#userLoginEmail").val();
    var password = $("#userLoginPassword").val();
    
    if (!validateEmail(email)) {
		$("#loginFormAlert").html("<strong>Missing information: </strong>Please enter a valid email address.");
		$("#loginFormAlert").removeClass("hidden-xs-up");
		$("#loginFormAlert").removeClass("alert-success");
		$("#loginFormAlert").addClass("alert-warning");
        $("#userLoginEmail").focus();
        return false;
    } else if (password == "") {
        $("#loginFormAlert").html("<strong>Missing information: </strong>Please enter your password.");
		$("#loginFormAlert").removeClass("hidden-xs-up");
		$("#loginFormAlert").removeClass("alert-success");
		$("#loginFormAlert").addClass("alert-warning");
        $("#userLoginPassword").focus();
        return false;
    } else {
        $("#loginFormAlert").addClass("hidden-xs-up");
        $.ajax({
            method: "post",
            url: "ajax/login",
            data: { usrEmail : email, usrPass : password },
            success: function (response) {
                if (response) {
                    var obj = JSON.parse(response);
                    
					if (!obj.error) {
						$("#loginFormAlert").removeClass("hidden");
						$("#loginFormAlert").removeClass("alert-warning");
						$("#loginFormAlert").addClass("alert-success");
					} else {
						$("#loginFormAlert").removeClass("hidden");
						$("#loginFormAlert").removeClass("alert-success");
						$("#loginFormAlert").addClass("alert-warning");
					}
                }
            }
        });
    }
    
    
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
    // } else if (!validateEmail(email)) {
	// 	$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter a valid email address.");
	// 	$("#signupFormAlert").removeClass("hidden-xs-up");
	// 	$("#signupFormAlert").removeClass("alert-success");
	// 	$("#signupFormAlert").addClass("alert-warning");
    //     $("#userEmail").focus();
    //     return false;
    } else if (password.trim() == "") {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter a valid password. Your password should not consist of only spaces.");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userPassword").focus();
        return false;
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
        url: "ajax/create-user",
        // in quotes because https://stackoverflow.com/questions/40734625/ajax-post-showing-an-error-when-try-to-upgrade-jquery-version
        dataType: 'JSON',
        data: formData,
        success: function(response) {
            if (response) {
                // For now just returning a string with either success or an error msg
                // var obj = JSON.parse(response);
                alert(response); // For now at least - Jon
            }
        }
    
    });
    
    
}

function validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){  
        return (true)  
    } else {
        return false;
    }
}

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
