package com.copler.crm.controller;

import com.copler.crm.dto.Urls;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Ivan_Zhuravel
 */
@RestController
@RequestMapping("/resources/ports")
public class ServerUrlsController {

    @Autowired
    private Environment env;

    @RequestMapping(method = RequestMethod.GET)
    public Urls getUrls() {
        return new Urls(env.getProperty("crm.legacy.baseUrl"),
                         env.getProperty("social.bridge.baseUrl"));
    }
}
