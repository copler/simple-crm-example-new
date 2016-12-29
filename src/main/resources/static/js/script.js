$(function(){
	$("a#contacts").click(displayContactsList);

	$("a#organizations").click(displayOrganizationsList);

});

function displayContactsList(){

	$.ajax({
		url: window.serverUrl + "/resources/contacts",
		type: "GET",
		contentType: "application/json; charset=utf-8",
		success: function(data) {

			var container = $("container");
			container.empty();

			container.append("<h3>Contacts</h3>");

            container.append("<h4><a id='add-contact' class='add-contact' href='#'>Add contact</a></h4>");
            $("#add-contact").click(displayContactAdd);

            container.append("<h4><a id='search-contacts-from-facebook' class='add-contact' href='#'>Search contacts from Facebook</a></h4>");
            $("#search-contacts-from-facebook").click(displaySearchContactsFromFacebook);

			container.append("<ul class='contact-list'>");

			data.forEach(function(contact){

				var organizationName = contact.organization ? contact.organization.name : "";

				$("ul", container).append("<li><a class='edit' href='#' data-id='"+contact.id+"'>" + escapeHtml(contact.firstName) + " " +
											escapeHtml(contact.lastName) + "</a>  Organization: " + escapeHtml(organizationName) +
											"  <a class='btn btn-danger btn-sml btn-delete' href='#' data-id='"+contact.id+"'>Delete</a> </li>");

			});
			$("a.edit").unbind("click", displayContactEdit).bind("click", displayContactEdit);
			$("a.delete").unbind("click", deleteContact).bind("click", deleteContact);
		},
		error: errorLogger
	});

	return false;
}

function getOrganizationsSelect(selectedId){

	var select = $("<select class='form-control' name='organizationId'/>");
	$.ajax({
		url: window.serverUrl + "/resources/organizations",
		type: "GET",
		contentType: "application/json; charset=utf-8",
		success: function(organizations) {

			select.append($("<option/>").text("Choose"));

			organizations.forEach(function(organization){
				if(organization.id !== selectedId){
					var option = $("<option/>").attr("value", organization.id).text(organization.name);
				}else{
					var option = $("<option/>").attr("value", organization.id).attr("selected", true).text(organization.name);
				}
				select.append(option);
			});
		},
		error: errorLogger
	});

	return select;
}

function getOrganizationTypesSelect(selectedId){

	var select = $("<select class='form-control' name='organizationTypeId'/>");
	$.ajax({
		url: window.serverUrl + "/resources/organizationtypes",
		type: "GET",
		contentType: "application/json; charset=utf-8",
		success: function(organizationTypes) {

			select.append($("<option/>").text("Choose"));

			organizationTypes.forEach(function(organizationType){
				if(organizationType.id !== selectedId){
					var option = $("<option/>").attr("value", organizationType.id).text(organizationType.name);
				}else{
					var option = $("<option/>").attr("value", organizationType.id).attr("selected", true).text(organizationType.name);
				}
				select.append(option);
			});
		},
		error: errorLogger
	});

	return select;
}

function getAddressFieldset(address){

	if(typeof address !== "undefined" && address !== null){
		var street = typeof address.street === "undefined" ? "" : address.street;
		var number = typeof address.number === "undefined" ? "" : address.number;
		var postalCode = typeof address.postalCode === "undefined" ? "" : address.postalCode;
		var country = typeof address.country === "undefined" ? "" : address.country;
		var city = typeof address.city === "undefined" ? "" : address.city;
		var province = typeof address.province === "undefined" ? "" : address.province;
	}else{
		var street = "";
		var number = "";
		var postalCode = "";
		var country = "";
		var city = "";
		var province = "";
	}

	var fieldset = $('<fieldset/>');

	fieldset.append($("<legend>Address</legend>"));
	fieldset.append("<div class='form-group'><label class='form-label'>Street:</label> <input class='form-control' type='text' name='street' value='" + street + "'/></div>");
	fieldset.append("<div class='form-group'><label class='form-label'>Number:</label> <input class='form-control' type='text' name='number' value='" + number + "'/></div>");
	fieldset.append("<div class='form-group'><label class='form-label'>Postal code:</label> <input class='form-control' type='text' name='postalCode' value='" + postalCode + "'/></div>");
	fieldset.append("<div class='form-group'><label class='form-label'>Country:</label> <input class='form-control' type='text' name='country' value='" + country + "'/></div>");
	fieldset.append("<div class='form-group'><label class='form-label'>City:</label> <input class='form-control' type='text' name='city' value='" + city + "'/></div>");
	fieldset.append("<div class='form-group'><label class='form-label'>Province:</label> <input class='form-control' type='text' name='province' value='" + province + "'/></div>");

	return fieldset;
}

function deleteContact(clickedElement){

	var dataId = $(clickedElement.target).attr("data-id");

	if(window.confirm("Do you really want to delete this contact?")){
		$.ajax({
			url: window.serverUrl + "/resources/contacts/" + dataId,
			type: "DELETE",
			contentType: "application/json; charset=utf-8",
			success: function(data) {
				alert("Contact succesfully deleted!");
				displayContactsList();
			},
			error: errorLogger
		});
	}

	return false;
}

function deleteOrganization(clickedElement){

	var dataId = $(clickedElement.target).attr("data-id");


	if(window.confirm("Do you really want to delete this organization?")){
		$.ajax({
			url: window.serverUrl + "/resources/organizations/" + dataId,
			type: "DELETE",
			contentType: "application/json; charset=utf-8",
			success: function(data) {
				alert("Organization succesfully deleted!");
				displayOrganizationsList();
			},
			error: errorLogger
		});
	}

	return false;
}

function displayContactAdd(){

	var container = $("container");
	container.empty();

	container.append("<h3>Add Contact</h3>");

	container.append("<form action='#' id='contactAddForm' >");
	$("#contactAddForm").submit(contactAddFormSubmit);

	$("form", container).append("<div class='form-group'><label class='form-label'>First Name:</label> <input class='form-control' type='text' name='firstName'></p>");
	$("form", container).append("<div class='form-group'><label class='form-label'>Last Name:</label> <input class='form-control' type='text' name='lastName'></p>");
	$("form", container).append("<div class='form-group'><label class='form-label'>Phone:</label> <input class='form-control' type='text' name='phone'></p>");
	$("form", container).append("<div class='form-group'><label class='form-label'>Email:</label> <input class='form-control' type='text' name='email'></p>");
	var organizationField = $("<div class='form-group'><label class='form-label'>Organization:</label></div>");
	organizationField.append(getOrganizationsSelect());
	$("form", container).append(organizationField);
	$("form", container).append(getAddressFieldset());
	$("form", container).append("<div class='btn-wrap'><input class='submit-style btn btn-default btn-form' type='submit' value='Add'></div>");

	return false;
}

function contactAddFormSubmit(event){

	var contact = {
		firstName: $("[name=firstName]").val(),
		lastName: $("[name=lastName]").val(),
		phone: $("[name=phone]").val(),
		email: $("[name=email]").val(),
		address: {
			street: $("[name=street]").val(),
			number:	$("[name=number]").val(),
			postalCode: $("[name=postalCode]").val(),
			country: $("[name=country]").val(),
			city: $("[name=city]").val(),
			province: $("[name=province]").val()
		}
	}

	if($('[name=organizationId').val() !== "Choose"){
		contact.organization = {
			id: $('[name=organizationId').val()
		}
	}

	$.ajax({
		url: window.serverUrl + "/resources/contacts/",
		type: "POST",
		data: JSON.stringify(contact),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data) {
			alert("Contact succesfully created!");
			displayContactsList();
		},
		error: errorLogger
	});

	event.preventDefault();
}

function displayOrganizationAdd(){

	var container = $("container");
	container.empty();

	container.append("<h3>Add Organization</h3>");

	container.append("<form action='#' id='organizationAddForm' >");
	$("#organizationAddForm").submit(organizationAddFormSubmit);

	$("form", container).append("<div class='form-group'><label class='form-label'>Organization name:</label> <input class='form-control' type='text' name='name'></div>");
	$("form", container).append("<div class='form-group'><label class='form-label'>Phone:</label> <input class='form-control' type='text' name='phone'></div>");
	$("form", container).append("<div class='form-group'><label class='form-label'>Email:</label> <input class='form-control' type='text' name='email'></div>");

	var organizationTypeField = $("<div class='form-group'><label class='form-label'>Organization Type:</label> </div>");
	organizationTypeField.append(getOrganizationTypesSelect());
	$("form", container).append(organizationTypeField);

	$("form", container).append(getAddressFieldset());
	$("form", container).append("<div class='btn-wrap'><input class='submit-style btn btn-default btn-form' type='submit' value='Add'></div>");

	return false;
}

function organizationAddFormSubmit(event){

	var organization = {
			name: $("[name=name]").val(),
			phone: $("[name=phone]").val(),
			email: $("[name=email]").val(),
			address: {
				street: $("[name=street]").val(),
				number:	$("[name=number]").val(),
				postalCode: $("[name=postalCode]").val(),
				country: $("[name=country]").val(),
				city: $("[name=city]").val(),
				province: $("[name=province]").val()
			}
	}

	if($('[name=organizationTypeId').val() !== "Choose"){
		organization.organizationType = {
			id: $('[name=organizationTypeId').val()
		};
	}

	$.ajax({
		url: window.serverUrl + "/resources/organizations/",
		type: "POST",
		data: JSON.stringify(organization),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data) {
			alert("Organization succesfully created!");
			displayOrganizationsList();
		},
		error: errorLogger
	});

	event.preventDefault();
}

function displayContactEdit(clickedElement){

	var dataId = $(clickedElement.target).attr("data-id");

	$.ajax({
		url: window.serverUrl + "/resources/contacts/" + dataId,
		type: "GET",
		contentType: "application/json; charset=utf-8",
		success: function(contact) {

			var container = $("container");
			container.empty();

			container.append("<h3>Edit Contact</h3>");

			container.append("<form action='#' id='contactEditForm' >");
			$("#contactEditForm").submit(contactEditFormSubmit);

			$("form", container).append("<input name='id' type='hidden' value='" + contact.id + "'>");
			$("form", container).append("<div class='form-group'><label class='form-label'>First Name:</label> <input class='form-control' type='text' name='firstName' value='" + escapeHtml(contact.firstName) + "'></div>");
			$("form", container).append("<div class='form-group'><label class='form-label'>Last Name:</label> <input class='form-control' type='text' name='lastName' value='" + escapeHtml(contact.lastName) + "'></div>");
			$("form", container).append("<div class='form-group'><label class='form-label'>Phone:</label> <input class='form-control' type='text' name='phone' value='" + escapeHtml(contact.phone) + "'></div>");
			$("form", container).append("<div class='form-group'><label class='form-label'>Email:</label> <input class='form-control' type='text' name='email' value='" + escapeHtml(contact.email) + "'></div>");

			var organizationField = $("<div><label class='form-label'>Organization:</label></div>");
			if(typeof contact.organization !== "undefined" && contact.organization !== null){
				organizationField.append(getOrganizationsSelect(contact.organization.id));
			}else{
				organizationField.append(getOrganizationsSelect());
			}
			$("form", container).append(organizationField);


			if(typeof contact.address !== 'undefined'){
				$("form", container).append(getAddressFieldset(contact.address));
			}else{
				$("form", container).append(getAddressFieldset());
			}

			$("form", container).append("<div class='btn-wrap'><input class='submit-style btn btn-default btn-form' type='submit' value='Update'></div>");
		},
		error: errorLogger
	});

	return false;
}

function displayOrganizationEdit(clickedElement){

	var dataId = $(clickedElement.target).attr("data-id");

	$.ajax({
		url: window.serverUrl + "/resources/organizations/" + dataId,
		type: "GET",
		contentType: "application/json; charset=utf-8",
		success: function(organization) {

			var container = $("container");
			container.empty();

			container.append("<h3>Edit Organization</h3>");

			container.append("<form action='#' id='organizationEditForm' >");
			$("#organizationEditForm").submit(organizationEditFormSubmit);

			$("form", container).append("<input name='id' type='hidden' value='" + organization.id + "'>");
			$("form", container).append("<div class='form-group'><label class='form-label'>Organization name:</label> <input class='form-control' type='text' name='name' value='" + escapeHtml(organization.name) + "'></div>");
			$("form", container).append("<div class='form-group'><label class='form-label'>Phone:</label> <input class='form-control' type='text' name='phone' value='" + escapeHtml(organization.phone) + "'></div>");
			$("form", container).append("<div class='form-group'><label class='form-label'>Email:</label> <input class='form-control' type='text' name='email' value='" + escapeHtml(organization.email) + "'></div>");


			var organizationTypeField = $("<div class='form-group'><label class='form-label'>Organization Type:</label></div>");
			if(typeof organization.organizationType !== 'undefined' && organization.organizationType !== null){
				organizationTypeField.append(getOrganizationTypesSelect(organization.organizationType.id));
			}else{
				organizationTypeField.append(getOrganizationTypesSelect());
			}
			$("form", container).append(organizationTypeField);

			if(typeof organization.address !== 'undefined' && organization.address !== null){
				$("form", container).append(getAddressFieldset(organization.address));
			}else{
				$("form", container).append(getAddressFieldset());
			}

			$("form", container).append("<div  class='btn-wrap'><input class='submit-style btn btn-default btn-form' type='submit' value='Update'></div>");

			container.append("<a href='#' class='show-contacts' data-id='"+organization.id+"'> Show contacts from this organization </a>");
			$("a.show-contacts").click(displayOrganizationContacts);

		},
		error: errorLogger
	});

	return false;
}

function displayOrganizationContacts(clickedElement){

	var dataId = $(clickedElement.target).attr("data-id");

	$.ajax({
		url: window.serverUrl + "/resources/contacts?organizationId=" + dataId,
		type: "GET",
		contentType: "application/json; charset=utf-8",
		success: function(data) {

			var container = $("container");

			if(!$("contacts").length){
				container.append("<contacts>");
			}else{
				$("contacts").empty();
			}

			$("contacts", container).append("<h4>Contacts from this organization:</h4>");

			$("a.add-contact").click(displayContactAdd);

			$("contacts", container).append("<ul>");

			data.forEach(function(contact){
				$("contacts ul", container).append("<li><a class='edit' href='#' data-id='"+contact.id+"'>" + escapeHtml(contact.firstName) + " " +
											escapeHtml(contact.lastName) + "</a> | " + escapeHtml(contact.phone) + "  </li>");

			});
			$("a.edit").unbind("click", displayContactEdit).bind("click", displayContactEdit);
		},
		error: errorLogger
	});

	return false;
}

function contactEditFormSubmit(event){

	var contact = {
			id: parseInt($("[name=id]").val()),
			firstName: $("[name=firstName]").val(),
			lastName: $("[name=lastName]").val(),
			phone: $("[name=phone]").val(),
			email: $("[name=email]").val(),
			address: {
				street: $("[name=street]").val(),
				number:	$("[name=number]").val(),
				postalCode: $("[name=postalCode]").val(),
				country: $("[name=country]").val(),
				city: $("[name=city]").val(),
				province: $("[name=province]").val()
			}
	}

	if($('[name=organizationId').val() !== "Choose"){
		contact.organization = {
			id: $('[name=organizationId').val()
		}
	}

	$.ajax({
		url: window.serverUrl + "/resources/contacts/" + contact.id,
		type: "PUT",
		data: JSON.stringify(contact),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data) {
			alert("Contact succesfully updated!");
			displayContactsList();
		},
		error: errorLogger
	});

	event.preventDefault();
}

function organizationEditFormSubmit(event){

	var organization = {
			id: parseInt($("[name=id]").val()),
			name: $("[name=name]").val(),
			phone: $("[name=phone]").val(),
			email: $("[name=email]").val(),
			address: {
				street: $("[name=street]").val(),
				number:	$("[name=number]").val(),
				postalCode: $("[name=postalCode]").val(),
				country: $("[name=country]").val(),
				city: $("[name=city]").val(),
				province: $("[name=province]").val()
			}
	}

	if($('[name=organizationTypeId').val() !== "Choose"){
		organization.organizationType = {
			id: $('[name=organizationTypeId').val()
		};
	}

	$.ajax({
		url: window.serverUrl + "/resources/organizations/" + organization.id,
		type: "PUT",
		data: JSON.stringify(organization),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data) {
			alert("Organization succesfully updated!");
			displayOrganizationsList();
		},
		error: errorLogger
	});

	event.preventDefault();
}

function displayOrganizationsList(){

	$.ajax({
		url: window.serverUrl + "/resources/organizations",
		type: "GET",
		contentType: "application/json; charset=utf-8",
		success: function(data) {

			var container = $("container");
			container.empty();

			container.append("<h3>Organizations</h3>");
			container.append("<h4><a class='add-organization' href='#'>Add organization</a></h4>");
			$("a.add-organization").click(displayOrganizationAdd);

			container.append("<ul>");

			data.forEach(function(organization){
				$("container ul").append("<li><a class='edit' href='#' data-id='"+organization.id+"'>" + escapeHtml(organization.name) +
											"</a> <a class='delete' href='#' data-id='"+organization.id+"'>Delete</a> </li>");
			});
			$("a.edit").unbind("click", displayOrganizationEdit).bind("click", displayOrganizationEdit);
			$("a.delete").unbind("click", deleteOrganization).bind("click", deleteOrganization);

		},
		error: errorLogger
	});

	return false;
}

function errorLogger(xhr, ajaxOptions, thrownErrror){

	if(xhr.status){
		console.error("Error status:" + xhr.status);
	}

	if(typeof thrownError !== 'undefined'){
		console.error("Error description:" + thrownErrror);
	}
}



function escapeHtml(aString) {

	if (typeof aString == 'undefined' || aString === null)
		return "";

	var entityMap = {
		    "&": "&amp;",
		    "<": "&lt;",
		    ">": "&gt;",
		    '"': '&quot;',
		    "'": '&#39;',
		    "/": '&#x2F;'
	};

	return String(aString).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
}
