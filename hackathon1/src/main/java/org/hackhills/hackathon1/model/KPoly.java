package org.hackhills.hackathon1.model;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class KPoly implements Serializable{

	private static final long serialVersionUID = 1L;
	private String Name;
    private String[] Cords;
    
    public KPoly(){}

	public String getName() {
		return Name;
	}
	public void setName(String name) {
		Name = name;
	}

	public String[] getCords() {
		return Cords;
	}
	public void setCords(String[] cords) {
		Cords = cords;
	}
}
