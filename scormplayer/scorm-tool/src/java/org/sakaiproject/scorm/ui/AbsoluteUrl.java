package org.sakaiproject.scorm.ui;

import javax.servlet.http.HttpServletRequest;

import org.apache.wicket.Request;
import org.apache.wicket.protocol.http.WebRequest;

public class AbsoluteUrl {
	private Request request;
	private String relativeUrl;
	private boolean includeServer, includeContext;
	
	public AbsoluteUrl(Request request, String relativeUrl, boolean includeServer, boolean includeContext) {
		this.request = request;
		this.relativeUrl = relativeUrl;
		this.includeServer = includeServer;
		this.includeContext = includeContext;
	}
	
	
	public String toString() {
		StringBuilder builder = new StringBuilder();
	
		WebRequest webRequest = (WebRequest)request;
		HttpServletRequest servletRequest = webRequest.getHttpServletRequest();
		
		if (includeServer) {
			builder.append(servletRequest.getScheme()).append("://")
				.append(servletRequest.getServerName())
				.append(":")
				.append(servletRequest.getServerPort());
		}
		if (includeContext)
			builder.append(servletRequest.getContextPath()).append("/");
		
		builder.append(relativeUrl);
		
		return builder.toString();
	}
	
}
