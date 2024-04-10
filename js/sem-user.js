var userPool;

$(document).ready(function() {
    $("#registrationform").submit(
            function(event) {
                event.preventDefault();
                var submitButton = $("#registrationform :submit");
                submitButton.button('loading');
                let firstName = getField('given_name', 'firstname');
                let middleName = getField('middle_name', 'middlename');
                let lastName = getField('family_name', 'lastname');
                let email = $('#email').val();
                //let emailField = getField('email', 'email');
                let password = $('#password').val();
                var confirmPassword = $('#confirmpassword').val();
                if(password!==confirmPassword){
                    $('#modalbody').html('Password and Confirm Passwords don\'t match!');
                    $('#staticBackdrop').modal('show');
                    submitButton.button('reset');
                    return false;
                }
                let mobilePrefix = $('#mobileprefix').text();
                let mobile = null;
                mobile = getPhoneField(mobilePrefix, 'phone_number', 'mobile');
                let affiliation = null;
                affiliation = getField('custom:affiliation', 'affiliation');
                let profile = getValueField('profile', 'author');
                let attributeList = []
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(firstName));
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(middleName));
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(lastName));
                if(!isNullOrEmpty(mobile)){
                    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(mobile));
                }
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(profile));
                attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(affiliation));
                signUpUser(email, password, attributeList, submitButton);
                return false;
            }
    );
    $("#loginform").submit(
            function(){
                    var submitButton = $("#loginform :submit");
                    submitButton.button('loading');
                    var authenticateData = {
                        Username : $('#username').val(),
                        Password : $('#password').val()
                    };
                    var authenticateDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticateData);
                    if(userPool===undefined){
                        userPool = getUserPool();
                    }
                    var userData = {
                            Username : $('#username').val(),
                            Pool : userPool
                    };
                    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                    cognitoUser.authenticateUser(authenticateDetails, {
                        onSuccess: function(result){
                            //console.log(JSON.stringify(result));
                            //var accessToken = result.getAccessToken().getJwtToken();
                            //console.log(accessToken);
                            //console.log(JSON.stringify(result));
                            localStorage.setItem(semj_token, result.getIdToken().getJwtToken());
                            //console.log(result.idToken.payload.sub);
                            localStorage.setItem(semj_user_id, result.idToken.payload.sub);
                            //console.log(result.idToken.payload.given_name);
                            localStorage.setItem(semj_user_firstname, result.idToken.payload.given_name);
                            localStorage.setItem(semj_user_middlename, result.idToken.payload.middle_name);
                            localStorage.setItem(semj_user_lastname, result.idToken.payload.family_name);
                            localStorage.setItem(semj_user_phone_number, result.idToken.payload.phone_number);
                            localStorage.setItem(semj_user_email, result.idToken.payload.email);
                            //console.log(result.idToken.payload.profile);
                            localStorage.setItem(semj_user_profile, result.idToken.payload.profile);
                            localStorage.setItem(semj_user_affiliation,result.idToken.payload["custom:affiliation"]);
                            window.location.href = 'profile.html';
                        },
                        onFailure: function(err){
                            //(err.message || JSON.stringify(err));
                            $('#modalbody').html(err.message);
                            $('#staticBackdrop').modal('show');
                            submitButton.button('reset');
                        }
                    });
                    return false;
                });
    $("#forgotpwdform").submit(
            function(){
                    var submitButton = $("#forgotpwdform :submit");
                    submitButton.button('loading');
                    if(userPool===undefined){
                        userPool = getUserPool();
                    }
                    var userId = $('#username').val();
                    var userData = {
                            Username : userId,
                            Pool : userPool
                    };
                    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                    cognitoUser.forgotPassword({
                        onSuccess: function(result){
                            window.location.href = HTML_FORGOT_PASSWORD_RESET+'?userid='+userId;
                        },
                        onFailure: function(err){
                            //(err.message || JSON.stringify(err));
                            $('#modalbody').html(err.message);
                            $('#staticBackdrop').modal('show');
                            submitButton.button('reset');
                        }
                    });
                    return false;
                });
    $("#resetpasswordform").submit(
                function(){
                        var submitButton = $("#resetpasswordform :submit");
                        submitButton.button('loading');
                        var code = $('#verificationcode').val();
                        var newPassword = $('#newpwd').val();
                        var confirmnewnewpwd = $('#confirmnewpwd').val();
                        if(newPassword!==confirmnewnewpwd){
                            $('#modalbody').html('Password and Confirm Passwords don\'t match!');
                            $('#staticBackdrop').modal('show');
                            submitButton.button('reset');
                            return false;
                        }
                        if(userPool===undefined){
                            userPool = getUserPool();
                        }
                        var userData = {
                                Username : useridfromreset,
                                Pool : userPool
                        };
                        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                        cognitoUser.confirmPassword(code, newPassword, {
                            onSuccess: function(result){
                                window.location.href = HTML_FORGOT_PASSWORD_RESET_SUCCESS;
                            },
                            onFailure: function(err){
                                //(err.message || JSON.stringify(err));
                                $('#modalbody').html(err.message );
                                $('#staticBackdrop').modal('show');
                                submitButton.button('reset');
                            }
                        });
                        return false;
                    });
});

function getValueField(attrName, value){
    var field = {
                Name : attrName,
                Value : value
            };
    return field;
}

function getPhoneField(mobilePrefix, attrName, fieldId){
    var phoneFieldValue = $('#'+fieldId).val();
    if(isNullOrEmpty(phoneFieldValue)){
        return null;
    }
    var field = {
                    Name : attrName,
                    Value : mobilePrefix+phoneFieldValue
                };
    return field;
}

function getField(attrName, fieldId){
    var field = {
                    Name : attrName,
                    Value : $('#'+fieldId).val()
                };
    return field;
}

function signUpUser(userEmail, userPassword, attributeList, submitButton) {
    if(userPool===undefined){
	    userPool = getUserPool();
	}
	userPool.signUp(userEmail, userPassword, attributeList, null, function(err, result){
        if (err) {
            //(err.message || JSON.stringify(err));
            $('#modalbody').html(err.message);
            $('#staticBackdrop').modal('show');
            submitButton.button('reset');
        }
        else {
            //cognitoUser = result.user;
            window.location.href = 'emailverification.html';
        }
    });
}

function getUserPool(){
    if(userPool===undefined){
        var poolData = {
                        UserPoolId : USER_POOL_ID,
                        ClientId : USER_POOL_CLIENT_ID
                    };
         userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
         return userPool;
     }
     return userPool;
}

function signout(){
    var userId = localStorage.getItem(semj_user_email);
    removeAllTokens();
    if(userPool===undefined){
        userPool = getUserPool();
    }
    var userData = {
            Username : userId,
            Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    if(cognitoUser){
        //if (cognitoUser.signInUserSession){
            cognitoUser.signOut();
            return;
        //}
    }
}