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

    goHome();
    return true;
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

    showSuccessPrompt();
    return true;
    
    var firstName = $("#userFirstName").val();
    var lastName = $("#userLastName").val();
    var email = $("#userEmail").val();
    var password = $("#userPassword").val();
    var confirmPass = $("#userPasswordConfirm").val();
    
    if (firstName.trim() === "") {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter your first name.");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userFirstName").focus();
        return false;
    } else if (lastName.trim() == "") {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter your last name.");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userLastName").focus();
        return false;
    } else if (!validateEmail(email)) {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Please enter a valid email address.");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userEmail").focus();
        return false;
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
        dataType: JSON,
        data: formData,
        success: function(response) {
            if (response) {
                var obj = JSON.parse(response);
                /* blah blah blah */
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

function goHome() {
    location.assign("index.html");
}

function goOffline() {
    location.assign("login.html");
}

function showSuccessPrompt() {

    $("#signupForm").fadeOut("slow", function() {

        $("#signupModal .modal-footer").attr("hidden",true);
        $("#successPrompt").attr("hidden", false).fadeIn("slow");

    });
}

// Scrapping cookie and just storing font size in db
/*
function checkCookie() {
    var cookie = document.cookie;
    var cookieList = cookie.split(";");

    if (cookieList.length > 0) {
        
        for (var i=0; i<cookieList.length; i++) {

            alert(cookieList[i]);
        }
    }
    
}

function setFontSizeCookie(size) {
    if (isNaN(size)) { return false;}
    var cookie = "fontsize=" + size;
    var d = new Date();
    d.setTime(d.getTime() + (150*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    cookie += (";" + expires);
    document.cookie = cookie;
    location.reload();
}
*/

function checkFontSize() {

    var checkFont = 1;
    //$("body").addClass("font-xl"); return true;

    $.ajax({
        
        type: "POST",
        url: "",
        data: { fontFlag: checkFont },
        dataType: "json",
        success: function(response) {
            var obj = JSON.parse(response);

            if (obj.success) {
                switch (obj.size) {

                    case "rg":
                        $("body").addClass("font-rg");
                        break;

                    case "lg":
                        $("body").addClass("font-lg");
                        break;

                    case "xl":
                        $("body").addClass("font-xl");
                        break;

                    case "xxl":
                        $("body").addClass("font-xxl");
                        break;

                    default:
                        $("body").addClass("font-rg");
                        break;

                }
            }
        }
    });
}

function setFontSize(size) {
    
    $.ajax({

        type: "POST",
        url: "",
        data: { fontSize: size },
        dataType: "json",
        success: function(response) {
            var obj = JSON.parse(response);

            if (obj.success) {
                location.reload();
            }
        }
    });

}

function weatherTimeCheck() {
    var found = false;
    var cookieValue = 0;
    var cookies = document.cookie;

    if (cookies != "") {
        var cookieList = cookies.split(";");

        for (var i=0; i<cookieList.length; i++) {
            var splitCookie = cookieList[i].split("=");
            var cookieName = splitCookie[0].replace(" ","");
            
            if (cookieName === "timecheck") {
                cookieValue = splitCookie[1];
                alert(cookieValue);
                found = true;
            }

        }

    }

    if (!found) {
        // get current timestamp
        // store as cookie
        var checkTime = new Date().getTime();
        var weatherCheckTimeCookie = "timecheck=" + checkTime;
        document.cookie = weatherCheckTimeCookie;
        return true;
    } else {
        //get current timestamp
        //compare to time in cookie
        //If more than 20 minutes from last timecheck cookie - renew cookie - return true
        var newTime = new Date().getTime();
        var timeVariance = 20 * 60 * 1000; // 20 minutes

        if ((newTime - cookieValue) > timeVariance) {
            return true;
        } else {
            return false;
        }
    }
}

function getCookieValue(cookieName) {
    var cookies = document.cookie;
    
    if (cookies != "") {
        var cookieList = cookies.split(";");

        for (var i=0; i<cookieList.length; i++) {
            var cookie = cookieList[i];
            var cookieSplit = cookie.split("=");
            var name = cookieSplit[0].replace(" ","");
            
            if (name == cookieName) {
                return cookieSplit[1];
            }
        }
    }
}

function uploadProfile(fileInput) {
    var changeConfirm = confirm("This will change your profile photo. Continue?");
    if (changeConfirm) {
        var imgFile = fileInput.files[0];
        var formData = new FormData();
        formData.append("profileImage", imgFile);

        $.ajax({
            type: "POST",
            url: "",
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                // call function to retrieve updated profile image
                //reload page to show image
            },
            error: function(jqXHR, textStatus, errorMessage) {
                console.log(errorMessage);
            }
        });
    } else {
        return false;
    }   
    
}