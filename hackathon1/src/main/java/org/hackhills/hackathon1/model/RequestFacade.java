package org.hackhills.hackathon1.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class RequestFacade {

	private Long id;

	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
}
