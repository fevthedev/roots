function userLogin(){
    
    var email = $("#userLoginEmail").val();
    var password = $("#userLoginPassword").val();
    
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        $("#userLoginEmail").focus();
        return false;
    } else if (password == "") {
        alert("Please enter your password.");
        $("#userLoginPassword").focus();
        return false;
    } else {
        
        $.ajax({
            method: "post",
            url: "ajax/login",
            data: { usrEmail : email, usrPass : password },
            success: function (response) {
                if (response) {
                    var obj = JSON.parse(response);
                    /* blah blah blah */
                }
            }
        });
    }
    
    
}

function userRegistration() {
    
    var firstName = $("#userFirstName").val();
    var lastName = $("#userLastName").val();
    var email = $("#userEmail").val();
    var password = $("#userPassword").val();
    var confirmPass = $("#userPasswordConfirm").val();
    
    if (firstName.trim() === "") {
        alert("Please enter your first name.");
        $("#userFirstName").focus();
        $("#")
        return false;
    } else if (lastName.trim() == "") {
        alert("Please enter your last name.");
        $("#userLastName").focus();
        return false;
    } else if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        $("#userEmail").focus();
        return false;
    } else if (password.trim() == "") {
        alert("Please enter a valid password. Your password should not consist of only spaces.");
        $("#userPassword").focus();
        return false;
    } else if (password.trim() !== confirmPass.trim()) {
        alert("Passwords do not match. Please check and try again.");
        $("#userPassword").focus();
        return false;
    }
    
    var formData = $("#signupForm").serialize();
    
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
