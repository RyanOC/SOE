/**
 * JBoss, Home of Professional Open Source
 * Copyright 2013, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.hackhills.hackathon1.service;

import org.hackhills.hackathon1.model.KPoly;
import org.hackhills.hackathon1.model.Member;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import java.io.File;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Stateless
public class HackathonSvc {

    @Inject private Logger log;
    @Inject private EntityManager em;
    @Inject private Event<Member> memberEventSrc;

    public void register(Member member) throws Exception {
        log.info("Registering " + member.getName());
        em.persist(member);
        memberEventSrc.fire(member);
    }

	public List<KPoly> kmlToJson(String type){
		//TODO: refine parser to accomidate slight deviations in kml format, and figure out why the attribute in the kml node kills the xpath query.
		int polyCount = 0;
		int cordCount = 0;
		String sj = null;

		List<String> sList = null;
		List<KPoly> polyList = new ArrayList<KPoly>();
		String content = "";
		// Load the kml (xml)
		 try {
			 File fXmlFile = null;
			 if (type.equals("schools")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/schools.kml");
			 } else if (type.equals("firestations")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/firestations.kml");
			 } else if (type.equals("hospitals")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/hospitals.kml");
			 } else if (type.equals("libraries")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/libraries.kml");
			 } else if (type.equals("schoolbusstops")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/schoolbusstops.kml");
			 } else if (type.equals("cities")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/cities.kml");
			 } else if (type.equals("commissionerdistricts")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/commissionerdistricts.kml");
			 } else if (type.equals("emergencyshelters")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkmln/emergencyshelters.kml");
			 } else if (type.equals("floodzones")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/floodzones.kml");
			 } else if (type.equals("parks")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/parks.kml");
			 } else if (type.equals("hillscounty")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/hillscounty.kml");
			 } else if (type.equals("zombies")){
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/zombies.kml");
			 } else {
				 fXmlFile = new File("/Users/ryan/Documents/HT_MYFILES/hackathonkml/hillscounty.kml");
			 }
				DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
				DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
				Document doc = dBuilder.parse(fXmlFile);
				doc.getDocumentElement().normalize();
				 
				NodeList nList = doc.getElementsByTagName("Placemark");
				for (int temp = 0; temp < nList.getLength(); temp++) {
					KPoly myPoly = new KPoly();
					Node nNode = nList.item(temp);
					
					if (nNode.getNodeType() == Node.ELEMENT_NODE) {
						 
						Element eElement = (Element) nNode;
						// Name
						myPoly.setName(eElement.getElementsByTagName("name").item(0).getTextContent());
						// Coords
						
						NodeList pointList = eElement.getElementsByTagName("Point");
						NodeList polygonList = eElement.getElementsByTagName("Polygon");
						NodeList pList = null;
						if (pointList != null && pointList.getLength() > 0){
							pList = pointList;
						} else if (polygonList != null && polygonList.getLength() > 0){
							pList = polygonList;
						}
						List<String> myCords = new ArrayList<String>();
						for (int i = 0; i < pList.getLength(); i++) {
							Node pNode = pList.item(i);
							if (pNode.getNodeType() == Node.ELEMENT_NODE){
								Element pElement = (Element) pNode;
								String[] cords = pElement.getElementsByTagName("coordinates").item(0).getTextContent().split(",0");
									//String tempCord = cords[0]+","+cords[1];
								
								for (int j = 0; j < cords.length; j++){
										myCords.add(cords[j]);
								}
							}
						}
						myPoly.setCords(myCords.toArray(new String[myCords.size()]));
					}
					polyList.add(myPoly);
				}
				
				
			/*	File file = new File("/home/eseufert/projects/hackathon/test.out");
				 
				// if file doesnt exists, then create it
				if (!file.exists()) {
					file.createNewFile();
				}
	 
				FileWriter fw = new FileWriter(file.getAbsoluteFile());
				BufferedWriter bw = new BufferedWriter(fw);
				bw.write(content);
				bw.close();*/
				
		 } catch (Exception e) {
			e.printStackTrace();
		 }
		return polyList;
		/*Document doc = XDocument.Load(string.Format("{0}{1}", mapDir, fileName), LoadOptions.PreserveWhitespace);

		// Get the name space uri. Handle case where there isn't a namespace.
		xmlns = doc.Root.Attribute("xmlns");
		XNamespace ns = xmlns == null ? string.Empty : xmlns.Value;

		// Get the Folder element
		var folder = doc.Descendants(ns + @"Document").Single().Element(ns + @"Folder");

		// Loop through all the Placemarks.
		foreach (var xmlRow in folder.Elements(ns + "Placemark")) {
			// Save the name of this placemark.
			var n = xmlRow.Element(ns + @"name");

			var d = "[desc]"; // xmlRow.XPathSelectElement(@"description").Value;
			//sList = new List<string>();

			foreach (XElement xmlRow2 in xmlRow.Descendants(ns + "coordinates")) {
            string cords = xmlRow2.Value;

            string[] lines = Regex.Split(cords, " ");

            List<Point> pointList = new List<Point>();
            List<Coordinate> gCords = new List<Coordinate>();
            string[] c = null;
            Coordinate cc = null;
            StringBuilder sbCords = new StringBuilder();
            // Hmm... Should we do this? GeoTools makes this check. You can't have a polygon with less than 4 points.
            //if (lines != null && lines.Length >= 1 && lines.Length <= 3)
            //{
            //    throw new Exception("Points must be 0 or more than 3!");

            //}
            foreach (string line in lines)
            {
                if (!string.IsNullOrEmpty(Regex.Replace(line, @"\t|\n|\r", "")))
                {
                    c = line.Split(',');
                    cc = new Coordinate();
                    // remove some precision which is causing the map polygons to get jacked. 
                    // 4 places is okay, 5 fails    

                    
                    // this rounds the decimal places
                    double lat;
                    double lon;                            

                    if (Double.TryParse(c[1].ToString(), out lat))
                    {
                        cc.Latitude = Math.Round(lat, 4);
                        // Enable for polygon compression
                        //lat = Math.Round(lat, 4);
                    }

                    if (Double.TryParse(c[0].ToString(), out lon))
                    {
                        cc.Longitude = Math.Round(lon, 4);
                        // Enable for polygon compression
                        //lon = Math.Round(lon, 4);
                    }

                    // Enable for polygon compression
                    //pointList.Add(new Point(lat, lon));


                      
                    string lon = double.Parse(c[0]).ToString("##.####");
                    string lat = double.Parse(c[1]).ToString("##.####");

                    cc.Longitude = double.Parse(lon);
                    cc.Latitude = double.Parse(lat);
                     
                    // To use the coordinates without compression/encryption.
                    //cc.Longitude = double.Parse(string.Format("{0}", c[0]));
                    //cc.Latitude = double.Parse(string.Format("{0}", c[1]));

                    gCords.Add(cc);
                    cordCount++;
                }
            }

            // Enable to start using polygon compression
            
            List<Point> reductionPoints = PolygonCompression.DouglasPeuckerReduction(pointList, AppConstants.PolygonCompressionTolerance);

            foreach(Point point in reductionPoints){
                Coordinate coord = new Coordinate();
                coord.Latitude = point.X;
                coord.Longitude = point.Y;
                cordCount++;
            }
            

            KPoly kp = new KPoly();

            kp.Name = n.Value;// cp;// n.Value;
            // kp.Name = cp;//ROC 7-13-2012: cp is the value from the hack parse of the file above
            // To use the coordinates without compression/encryption.
            //kp.GCords = cords;
            kp.GCords = Encode(gCords);
            kp.Data = d;
            kp.Color = "#FF0000";
            lstKPoly.Add(kp);

            polyCount++;
        }
    }

    sj = SOESoftware.Connect.ENR.WebPublish.JSONSerializer.ToJSON(lstKPoly);
    return sj;*/
	}

/// <summary>
/// Conmress lat and long for smaller json files
/// </summary>
/// <param name="points"></param>
/// <returns></returns>
/*private static string Encode(IEnumerable<Coordinate> points)
{
    var str = new StringBuilder();

    var encodeDiff = (Action<long>)(diff =>
    {
        long shifted = diff << 1;
        if (diff < 0)
            shifted = ~shifted;
        long rem = shifted;
        while (rem >= 0x20)
        {
            str.Append((char)((0x20 | (rem & 0x1f)) + 63));
            rem >>= 5;
        }
        str.Append((char)(rem + 63));
    });
    
    double lastLat = 0.0;
    double lastLon = 0.0;

    foreach (var point in points)
    {
        double latDiff = point.Latitude-lastLat;
        double lonDiff = point.Longitude-lastLon;
        // GRV - If we ever fix encryption to work with 64 bits change multiplier here to number of decimal places we want.
        long lat = (long)Math.Round(latDiff * 1E5);
        long lng = (long)Math.Round(lonDiff * 1E5);
        encodeDiff(lat);
        encodeDiff(lng);
        lastLat = point.Latitude;
        lastLon = point.Longitude;
    }
   
    return str.ToString();
}*/
}