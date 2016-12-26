package com.copler.crm.controller;

import com.copler.crm.dto.Contact;
import com.copler.crm.services.FacebookService;
import org.springframework.social.facebook.api.Reference;
import org.springframework.social.facebook.api.User;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.List;

/**
 * Created by Andrew on 12/20/2016.
 */
@RestController
@RequestMapping("/resources/facebook")
public class ContactFacebookController {

    @Inject
    FacebookService facebookService;

    @RequestMapping(value = "/search/users", method = RequestMethod.GET)
    public List<Reference> searchUsers(@RequestParam("query") String query) {
        return facebookService.searchUsers(query);
    }

    @RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
    public Contact user(@PathVariable("id") String objectId) {
        Contact contact = new Contact();
        User user = facebookService.user(objectId);
        contact.setFirstName(setStringValue(user.getFirstName()));
        contact.setLastName(setStringValue(user.getLastName()));
        contact.setEmail(setStringValue(user.getEmail()));
//
//        Address address = new Address();
//        if (user.getHometown() != null) {
//            address.setCity(user.getHometown().getName());
//        }
//        contact.setAddress(address);
//
        return contact;
    }

    private String setStringValue(final String value) {
        return value != null ? value : "";
    }

}
