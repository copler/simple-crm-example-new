function isBlank(value) {
    return ( $.trim(value).length == 0 );
}

function displaySearchContactsFromFacebook(){
    var container = $("container");
    container.empty();
    container.append("<h3>Search contacts from Facebook</h3>");
    container.append("<form action='#' id='searchContactsFromFacebookForm' >");
    $("form", container).append("<p>User Name: <input type='text' name='query'></p>");
    $("form", container).append("<p><input type='submit' value='Search'></p>");
    $("#searchContactsFromFacebookForm").submit(function( event ) {
        var query = $("[name=query]").val();
        if (!isBlank(query)) {
            return searchContactsFromFacebook(event);
        }
        alert("User Name can't be blank !");
        event.preventDefault();
    });
    return false;
}

function searchContactsFromFacebook(event) {
    var query = $("[name=query]").val();
    $.ajax({
        url: window.socialUrl + "/facebook/search/users?query=" + query,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            var container = $("container");
            container.empty();
            container.append("<h3>Search Contacts From Facebook</h3>");
            container.append("<ul>");
            data.forEach(function(user){
                $("container ul").append("<li><a class='edit' href='#' data-id='"+user.id+"'>" + escapeHtml(user.name) +
                    "</a></li>");
                $("container ul").append("<img src='http://graph.facebook.com/" + user.id + "/picture?type=square' alt='Smiley face' height='50' width='50'>");
            });
            $("a.edit").unbind("click", displayContactAddFromFacebook).bind("click", displayContactAddFromFacebook);
            container.append("</ul>");
        },
        error: errorLogger
    });
    event.preventDefault();
    return false;
}

function displayContactAddFromFacebook(clickedElement) {
    var objectId = $(clickedElement.target).attr("data-id");
    $.ajax({
        url: window.socialUrl + "/facebook/user/" + objectId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(contact) {
            var container = $("container");
            container.empty();
            container.append("<h3>Add Contact From Facebook</h3>");
            container.append("<img src='http://graph.facebook.com/" + contact.id + "/picture?type=large' alt='Smiley face' __height='100' width='200'>");
            container.append("<form action='#' id='contactAddForm' >");
            $("#contactAddForm").submit(contactAddFormSubmit);
            $("form", container).append("<div class='form-group'><label class='form-label'>First Name:</label> <input class='form-control' type='text' name='firstName' value='" + escapeHtml(contact.firstName) + "'></div>");
            $("form", container).append("<div class='form-group'><label class='form-label'>Last Name: </label> <input class='form-control' type='text' name='lastName' value='" + escapeHtml(contact.lastName) + "'></div>");
            $("form", container).append("<div class='form-group'><label class='form-label'>Phone: </label> <input class='form-control' type='text' name='phone'></div>");
            $("form", container).append("<div class='form-group'><label class='form-label'>Email:</label> <input class='form-control' type='text' name='email' value='" + escapeHtml(contact.email) + "'></div>");
            $("form", container).append("<div class='form-group'><label class='form-label'>Photo:</label> <input class='form-control' type='text' name='photo'></div>");
            var organizationField = $("<p>Organization: </p>");
            organizationField.append(getOrganizationsSelect());
            $("form", container).append(organizationField);
            $("form", container).append(getAddressFieldset(contact.address));
            $("form", container).append("<p><input type='submit' value='Add'></p>");
        },
        error: errorLogger
    });
    return false;
}

