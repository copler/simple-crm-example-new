package com.copler.crm.dto;

/**
 * @author Ivan_Zhuravel
 */
public class Urls {

    private String serverUrl;
    private String socialUrl;

    public Urls(String serverUrl, String socialUrl) {
        this.serverUrl = serverUrl;
        this.socialUrl = socialUrl;
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public String getSocialUrl() {
        return socialUrl;
    }
}
