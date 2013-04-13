package org.hackhills.hackathon1.service;

import java.io.IOException;

import javax.enterprise.context.RequestScoped;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.ObjectWriter;
import org.codehaus.jackson.map.annotate.JsonSerialize.Inclusion;
import org.hackhills.hackathon1.model.JsonViews;
import org.hackhills.hackathon1.model.ResponseFacade;


/**
 * @author Edward H. Seufert
 * Licensed under Eclipse Public License 1.0 (EPL-1.0)
 */
@RequestScoped
public class UtilSvc {

	public String writeResponseMember(ResponseFacade response){
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.setSerializationInclusion(Inclusion.NON_NULL);
		ObjectWriter w = objectMapper.writerWithView(JsonViews.JsonMember.class);
		try {
			return w.writeValueAsString(response);
		} catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return "{\"status\":\"ERROR\",\"statusMessage\":\"JSON write error check Stack Trace\"}";
	}
}
