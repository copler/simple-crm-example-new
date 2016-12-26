package com.copler.crm.controller;

import com.copler.crm.dto.OrganizationType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/resources/organizationtypes")
public class OrganizationTypeController {
	
	
//	@Autowired
//	OrganizationTypeRepository organizationTypeRespository;
	
	@RequestMapping(method = RequestMethod.GET)
	public List<OrganizationType> retrieveOrganizationTypes(){
		
		List<OrganizationType> organizationTypes = new ArrayList<OrganizationType>();
		
//		for(OrganizationType organizationType : organizationTypeRespository.findAll()){
//			organizationTypes.add(organizationType);
//		}
		
		return organizationTypes;
	}
	
}
