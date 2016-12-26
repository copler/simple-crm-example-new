package com.copler.crm.services;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.env.Environment;
import org.springframework.social.facebook.api.Reference;
import org.springframework.social.facebook.api.User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

/**
 * Created by Andrew on 12/23/2016.
 */
@Service
public class FacebookService {

    private final RestTemplate restTemplate;

    public FacebookService(RestTemplateBuilder restTemplateBuilder, Environment environment) {
        this.restTemplate = restTemplateBuilder.rootUri(
                environment.getProperty("social.bridge.baseUrl")).build();
    }

    public List<Reference> searchUsers(String query) {
        Reference[] list = this.restTemplate.getForObject("/facebook/search/users?query={query}",
                Reference[].class, query);
        return Arrays.asList(list);
    }

    public User user(String objectId) {
        return this.restTemplate.getForObject("/facebook/user/{id}", User.class, objectId);
    }

}
