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
        url: "/resources/facebook/search/users?query=" + query,
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
        url: "/resources/facebook/user/" + objectId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function(contact) {
            var container = $("container");
            container.empty();
            container.append("<h3>Add Contact From Facebook</h3>");
            container.append("<form action='#' id='contactAddForm' >");
            $("#contactAddForm").submit(contactAddFormSubmit);
            $("form", container).append("<p>First Name: <input type='text' name='firstName' value='" + escapeHtml(contact.firstName) + "'></p>");
            $("form", container).append("<p>Last Name: <input type='text' name='lastName' value='" + escapeHtml(contact.lastName) + "'></p>");
            $("form", container).append("<p>Phone: <input type='text' name='phone'></p>");
            $("form", container).append("<p>Email: <input type='text' name='email' value='" + escapeHtml(contact.email) + "'></p>");
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

