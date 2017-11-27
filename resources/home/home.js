var post_template = require("./templates/post.hbs");
var autocomplete_template = require("./templates/autocomplete.hbs");

var Handlebars = require("hbsfy/runtime");

Handlebars.registerHelper('time', function(value, options)
{
    var a = (new Date(value) + "").split(" ");
    var t = a[4].split(":");
    return a[0] + ", " + a[1] + " " + a[2] + ", " + a[3] + " at " + ((t[0]==0)?12:t[0]%12) + ":" + t[1] + " " + ((t[0]/12)?"pm":"am");
});

Handlebars.registerHelper('boldify', function(string, regex, options)
{
    return string.replace(new RegExp('(' + regex + ')', 'i'), "<b>$1</b>");
});

$(function() {

    populateFeed();
    checkFontSize();

    $(".feedItem").click(function(){

        //location.assign("templates/profile.html");

    });

    $("#siteLogo").click(function(){

        //location.assign("/index.html");

    });

    $(".interestedBtn").click(function(){

        if ($(this).hasClass("interested")) {

            $(this).removeClass("interested");
            $("img",this).attr("src", "/images/unselectedgold.png");

        } else {

            $(this).addClass("interested");
            $("img",this).attr("src", "/images/interestedgold.png");

        }
    });

    // convoluted syntax to preserve value of el
    for(let el of document.getElementsByClassName("reply-btn"))
    {
        el.onclick = function(messageid, senderid)
        {
            return function()
            {
                sendMail(document.getElementById("mailReplyMessage_" + messageid).value, senderid);
            };
        }(el.id.split("_")[1], el.id.split("_")[2]);
    }

    //for(let el of document.getElementsByClassName("delete-btn"))
    //{
    //    el.onclick = function(messageid)
    //    {
    //        return function()
    //        {
    //            document.getElementById("mailLi_" + messageid).outerHTML = "";
    //            document.getElementById("mailItem_" + messageid).outerHTML = "";
    //            $.post("/ajax/delete-message", {id: messageid}, function(res)
    //            {
    //                //...
    //            });
    //        };
    //    }(el.id.split("_")[1]);
    //}


    $("#font125").click(function(){setFontSize(125);});
    $("#font150").click(function(){setFontSize(150);});
    $("#font175").click(function(){setFontSize(175);});
    $("#font200").click(function(){setFontSize(200);});
    $("#postStatusBtn").click(postStatus);
    $("#submitSignupBtn").click(userRegistration);
    $("#submitLoginBtn").click(userLogin);
    $("#signoutBtn").click(logout);
    $("#profileTabActivity").click(showActivity);
    $("#profileTabPhotos").click(showGallery);
    $("#profileTabEvents").click(showEvents);
    $("#profileTabMail").click(showMessages);
    $("#changeProfilePicBtn").click(profilePic);
    $("#mailCancelBtn").click(resetMail);
    $("#mailNameSearchBox").on('keyup', mailAutoComplete);
});

function mailAutoComplete()
{
    var str = document.getElementById("mailNameSearchBox").value;
    var resultsDiv = document.getElementById("mailSearchResults");

    $.post('/ajax/search-by-name', {search: str}, function(results)
    {
        resultsDiv.innerHTML = "";
        for(var user of results)
        {
            resultsDiv.innerHTML += autocomplete_template({user: user, str: str});
        }

        // convoluted syntax to preserve the value of el
        for(let el of document.getElementsByClassName("autocompleteItem"))
        {
            el.onclick = function(id)
            {
                return function()
                {
                    for(var u of results)
                        if(u._id == id)
                            setRecipient(u);
                };
            }(el.id.split("_")[1]);
        }
    });
}

function setRecipient(user)
{
    var nameBox = document.getElementById("mailRecipientName");
    nameBox.innerHTML = "<h3>" + user.name + "</h3>";
    nameBox.hidden = false;
    document.getElementById("mailTopHalf").hidden = true;

    var sendButton = document.getElementById("mailSendBtn");
    sendButton.hidden = false;
    sendButton.onclick = function()
    {
        sendMail(document.getElementById("mailMessageBox").value, user._id);
    };
}

function sendMail(text, userid)
{
    $.post('/ajax/send-mail',
    {
        messageText : text,
        recipientUserID : userid
    }, function(res)
    {
        resetMail();
        console.log(res);
    });
}

function resetMail()
{
    document.getElementById("mailNameSearchBox").value = "";
    document.getElementById("mailMessageBox").value = "";
    document.getElementById("mailTopHalf").hidden = false;
    document.getElementById("mailRecipientName").hidden = true;
    document.getElementById("mailSearchResults").innerHTML= "";
}

function profilePic()
{
    var fileInput = document.getElementById("profilePictureInput");
    fileInput.click();
    var changeConfirm = confirm("This will change your profile photo. Continue?");
    if (changeConfirm) {

        var imgFile = fileInput.files[0];
        var formData = new FormData();
        //formData.append("profileImage", imgFile);

        $.post("/ajax/upload-profile-picture", {image: imgFile}, function(res)
        {
            console.log(res);
        });

        //$.ajax({
        //    type: "POST",
        //    url: "/ajax/upload-profile-picture",
        //    data: {image: imgFile},
        //    processData: false,
        //    contentType: false,
        //    success: function(response) {
        //        location.reload();
        //    },
        //    error: function(jqXHR, textStatus, errorMessage) {
        //        console.log(errorMessage);
        //    }
        //});
    } else {
    return false;
    }
}

function postStatus()
{
    $.post("/ajax/new-post",
    {
        messageBody : document.getElementById("statusEntryField").value
    }, function(retData)
    {
        document.getElementById("statusEntryField").value = "";
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

    var username = $("#userLoginName").val();
    var password = $("#userLoginPassword").val();

    if (username == "") {
		$("#loginFormAlert").html("<strong>Missing information: </strong>Please enter your username.");
		$("#loginFormAlert").removeClass("hidden-xs-up");
		$("#loginFormAlert").removeClass("alert-success");
		$("#loginFormAlert").addClass("alert-warning");
        $("#userLoginEmail").focus();
        return false;
    }
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
    }
    else if (password.trim() !== confirmPass.trim()) {
		$("#signupFormAlert").html("<strong>Missing information: </strong>Passwords do not match. Please check and try again.");
		$("#signupFormAlert").removeClass("hidden-xs-up");
		$("#signupFormAlert").removeClass("alert-success");
		$("#signupFormAlert").addClass("alert-warning");
        $("#userPassword").focus();
        return false;
    }

    var formData = $("#signupForm").serialize();

	$("#signupFormAlert").addClass("hidden-xs-up");

    $.post("/ajax/create-user", formData, function(res)
    {
        console.log(res);

        if(res == "SUCCESS") showSuccessPrompt();
        else if(res == "username already registered")
        {
            $("#signupFormAlert").html("<strong>Missing information: </strong>Username has already been taken. Please try another username.");
            $("#signupFormAlert").removeClass("hidden-xs-up");
            $("#signupFormAlert").removeClass("alert-success");
            $("#signupFormAlert").addClass("alert-warning");
            $("#userPassword").focus();
            return false;
        }
    });

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

function showSuccessPrompt() {

    $("#signupForm").fadeOut("slow", function() {

        $("#signupModal .modal-footer").attr("hidden",true);
        $("#successPrompt").attr("hidden", false).fadeIn("slow");
    });
}


function checkFontSize() {

    $.ajax({

        type: "GET",
        url: "/ajax/get-font-size",
        success: function(size) {
            switch (size) {

                case "125":
                $("body").addClass("font-rg");
                break;

                case "150":
                $("body").addClass("font-lg");
                break;

                case "175":
                $("body").addClass("font-xl");
                break;

                case "200":
                $("body").addClass("font-xxl");
                break;

                default:
                $("body").addClass("font-rg");
                break;

            }
        }
    });
}

function setFontSize(size) {

    $.ajax({

        type: "POST",
        url: "/ajax/set-font-size",
        data: { fontSize: size },
        dataType: "json",
        success: function(response) {
            location.reload();
        }
    });
}

