package com.copler.crm.controller;

import com.copler.crm.dto.Organization;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/resources/organizations")
public class OrganizationController {
	
	
//	@Autowired
//	OrganizationRepository organizationRepository;
	
	@RequestMapping(method = RequestMethod.POST)
	public Organization create(@RequestBody Organization organization, HttpServletResponse response){
		
		
//		organizationRepository.save(organization);
		
		response.setStatus(HttpServletResponse.SC_CREATED);
		
		return organization;
	}	
	
	@RequestMapping(method = RequestMethod.GET)
	public List<Organization> retrieveOrganizations(){
		
		List<Organization> organizations = new ArrayList<Organization>();
		
//		for(Organization o : organizationRepository.findAll()){
//			organizations.add(o);
//		}
		
		return organizations;
	}
	
	@RequestMapping(value = "{id}",method = RequestMethod.GET)
	public Organization retrieveOrganization(@PathVariable String id){
		
		Organization organization = new Organization();
//		try{
//			 organization = organizationRepository.findOne(new Integer(id));
//		}catch(NumberFormatException e){
//			throw new WrongIdFormatException();
//		}
//
//		if(organization == null){
//			throw new ElementNotFoundException(id);
//		}
		
		return organization;		
	}
	
	@RequestMapping(value = "{id}",method = RequestMethod.PUT)
	public Organization updateOrganization(@PathVariable String id, @RequestBody Organization organization){
		
//		organizationRepository.save(organization);
		
		return organization;
	}
	
	@RequestMapping(value = "{id}",method = RequestMethod.DELETE)
	public void deleteOrganization(@PathVariable String id){
		
//		try{
//			 organizationRepository.delete(new Integer(id));
//		}catch(NumberFormatException e){
//			throw new WrongIdFormatException();
//		}
		
	}

}
