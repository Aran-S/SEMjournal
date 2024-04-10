$(document).ready(function() {
    $("#contactform").submit(
        function() {
            var submitButton = $("#contactform :submit");
            submitButton.button('loading');
            var formData = new FormData();
            var conname = $("#conname").val();
            var conemail = $("#conemail").val();
            var consubject = $("#consubject").val();
            var conmessage = $("#conmessage").val();
            formData.append("conname", conname);
            formData.append("conemail", conemail);
            formData.append("consubject", consubject);
            formData.append("conmessage", conmessage);
            jQuery
                .ajax({
                    url : API_POST_CONTACTUS,
                    type : 'POST',
                    processData : false, // Important!
                    contentType : false,
                    dataType : 'json',
                    data : formData,
                    async : true,
                    success : function(data, responsestatus, request) {
                        submitButton.button('reset');
                        $('#modalbody').html('Thank you for contacting us! We will get back as soon as possible!');
                        $('#staticBackdrop').modal('show');
                        //window.location.href = HTML_VOLUMES;
                    },
                    error : function(data, error) {
                        submitButton.button('reset');
                        $('#modalbody').html('Unable to submit contact us request, please try again!');
                        $('#staticBackdrop').modal('show');
                    }
                });
            return false;
        }
    );
});