window.semj_token = 'semj_token';
window.semj_user_id = 'semj_user_id';
window.semj_user_firstname = 'semj_user_firstname';
window.semj_user_middlename = 'semj_user_middlename';
window.semj_user_lastname = 'semj_user_lastname';
window.semj_user_phone_number = 'semj_phone_number';
window.semj_user_profile = 'semj_user_profile';
window.semj_user_email = 'semj_email';
window.semj_user_affiliation = 'semj_affiliation';
window.SESSION_SEMJ_ISSN="semj_issn";
window.SESSION_CI_COUNT="semj_ci_count";
window.SESSION_CI_VOLNAME="semj_ci_volname";
window.SESSION_CI_VOLPREIOD="semj_ci_volperiod";
window.SESSION_SI_COUNT="semj_si_count";
window.SESSION_SI_VOLNAME="semj_si_volname";
window.SESSION_SI_VOLPREIOD="semj_si_volperiod";

window.AUTHORIZATION_PROPERTY = 'semj_access';

window.S3_ARTICLES_BASE_PATH = "https://s3.ap-south-1.amazonaws.com/";


window.SUCCESS_CODE = 200;

window.RELOGIN_CODES = {};
RELOGIN_CODES['20001'] = true;
RELOGIN_CODES['20003'] = true;
RELOGIN_CODES['20004'] = true;
RELOGIN_CODES['20005'] = true;
RELOGIN_CODES['20007'] = true;

window.HTML_LOGIN = 'login.html'
window.HTML_FORGOT_PASSWORD_RESET = 'forgotpwdreset.html';
window.HTML_FORGOT_PASSWORD_RESET_SUCCESS = 'resetpasswordsuccess.html';
window.HTML_ARTICLES = 'articles.html';
window.HTML_VOLUMES = 'volumes.html';
window.HTML_EDITOR_CURRENT_ISSUE = 'current.html';

/** -- Dev
#window.API_BASE_PATH = 'https://k8i9r23mhk.execute-api.ap-south-1.amazonaws.com/dev'
window.USER_POOL_ID = 'ap-south-1_A95Qp9XsR';
window.USER_POOL_CLIENT_ID = '29jqef7sdlqndhemc91564rd7o';
**/

window.API_BASE_PATH = 'https://0gb5tlusl5.execute-api.ap-south-1.amazonaws.com/prod'
window.USER_POOL_ID = 'ap-south-1_J7lvd5kh7';
window.USER_POOL_CLIENT_ID = '5uvim6hri0o5hj1jaks6cjblqi';


window.API_GET_JOURNALS = API_BASE_PATH + '/journals';
window.API_GET_CURRENT_ISSUE = API_BASE_PATH + '/currentissue';
window.API_GET_SPECIAL_ISSUE = API_BASE_PATH + '/speiclaissue';
window.API_POST_CURRENT_ISSUE = API_BASE_PATH + '/currentissue';
window.API_POST_MANUSCRIPTS = API_BASE_PATH + '/manuscripts';
window.API_GET_ARTICLES = API_BASE_PATH + '/articles';
window.API_POST_ARTICLES = API_BASE_PATH + '/articles';
window.API_GET_VOLUMES = API_BASE_PATH + '/volumes';
window.API_POST_VOLUMES = API_BASE_PATH + '/volumes';
window.API_POST_CONTACTUS = API_BASE_PATH + '/contactus';

$(document).ready(function() {
    //$(".issn").html('eISSN 1234-1234');
    $('.navbar-brand').css('display', 'none');
    $(window).on('scroll', function(event) {
        var scrollValue = $(window).scrollTop();
        var height = $('#logobar').height();
        if (scrollValue > height) {
             $('.menubar').addClass('fixed-top');
             $('.navbar-brand').css('display', 'block');
        } else{
            $('.menubar').removeClass('fixed-top');
            $('.navbar-brand').css('display', 'none');
        }
    });

    /*if(!isNullOrEmpty(sessionStorage.getItem(SESSION_CI_COUNT))){
        setCurrentIssueStats();
    }else{
        //TODO make server call
        storeCurrentIssueStats();
        setCurrentIssueStats();
    }*/
	if(!isNullOrEmpty(localStorage.getItem(semj_user_firstname))){
	    $('#greet_user_firstname').html(localStorage.getItem(semj_user_firstname));
	    $('#greet_user_action').html('(<small><a href="login.html" onclick="signout(); return true;" class="text-white">Logout</a></small>)');
	}else{
	    $('#greet_user_firstname').html('Guest');
	    $('#greet_user_action').html('(<small><a href="login.html" class="text-white">Login</a></small>)');
	}
	$("input[type=file]").change(function () {
      var fieldVal = $(this).val();
      // Change the node's value by removing the fake path (Chrome)
      fieldVal = fieldVal.replace("C:\\fakepath\\", "");
      if (fieldVal != undefined || fieldVal != "") {
        $(this).next(".custom-file-label").html(fieldVal);
      }
    });
	var profile = localStorage.getItem(semj_user_profile);
	if(!isNullOrEmpty(profile)){
	    if(profile==='author'){
            $('.authorprofile').show();
	    }else if(profile==='editor'){
	        $('.editorprofile').show();
	    }
	}
	$.fn.button = function(action) {
      if (action === 'loading' && this.data('loading-text')) {
      this.data('original-text', this.html()).html(this.data('loading-text')).prop('disabled', true);
      }
      if (action === 'reset' && this.data('original-text')) {
      this.html(this.data('original-text')).prop('disabled', false);
      }
    };
});

/*function setCurrentIssueStats(){
    $('#cicount').html('('+sessionStorage.getItem(SESSION_CI_COUNT)+' Articles)');
    $('#civolname').html(sessionStorage.getItem(SESSION_CI_VOLNAME));
    $('#civolperiod').html(sessionStorage.getItem(SESSION_CI_VOLPREIOD));
}*/

/*function storeCurrentIssueStats(){
    sessionStorage.setItem(SESSION_CI_COUNT,25);
    sessionStorage.setItem(SESSION_CI_VOLNAME, 'Vol.1 No.1');
    sessionStorage.setItem(SESSION_CI_VOLPREIOD, 'March, 2021');
}*/

function removeAllTokens(){
    localStorage.removeItem(semj_token);
    localStorage.removeItem(semj_user_id);
    localStorage.removeItem(semj_user_firstname);
    localStorage.removeItem(semj_user_middlename);
    localStorage.removeItem(semj_user_lastname);
    localStorage.removeItem(semj_user_phone_number);
    localStorage.removeItem(semj_user_email);
    localStorage.removeItem(semj_user_profile);
    localStorage.removeItem(semj_user_affiliation);
}

function isNullOrEmpty(variable) {
	if (variable === null || variable === '' || variable === undefined || variable === 'undefined')
		return true;
	return false;
}

function checkAuth() {
	var semjtoken = localStorage.getItem(semj_token);
	if (semjtoken === null || semjtoken === undefined) {
		return false;
	}
	return true;
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	console.log('Query variable %s not found', variable);
}

function truncate(message){
    var len = 350;
    if (message.length > len) {
      return message.substring(0, len) + '...';
   }
   return message;
}