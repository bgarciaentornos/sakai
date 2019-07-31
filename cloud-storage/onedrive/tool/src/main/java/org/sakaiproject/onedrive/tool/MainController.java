/****************************************************************************** 
 * Copyright 2015 sakaiproject.org Licensed under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License at
 * 
 * http://opensource.org/licenses/ECL-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/
package org.sakaiproject.onedrive.tool;

import javax.inject.Inject;

import lombok.extern.slf4j.Slf4j;
import org.sakaiproject.onedrive.service.OneDriveService;
import org.sakaiproject.tool.api.SessionManager;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * MainController
 * 
 * This is the controller used by Spring MVC to handle requests
 * 
 * @author Miguel Pellicer (mpellicer@edf.globañ)
 *
 */
@Slf4j
@Controller
public class MainController {

	@Inject
	private OneDriveService oneDriveService;
	@Inject
	private SessionManager sessionManager;
	@Inject
	private MessageSource messageSource;

	@RequestMapping(value = {"/", "/index"}, method = RequestMethod.GET)
	public String showIndex(@RequestParam String code, Model model) {
		log.info("OneDriveServlet : Called the main servlet.");
		String userId = sessionManager.getCurrentSessionUserId();
		Object pickerRedirectUrlObject = sessionManager.getCurrentSession().getAttribute(oneDriveService.ONEDRIVE_REDIRECT_URI);
		sessionManager.getCurrentSession().removeAttribute(oneDriveService.ONEDRIVE_REDIRECT_URI);
		String pickerRedirectUrl = pickerRedirectUrlObject != null ? pickerRedirectUrlObject.toString() : null;
		log.info("OneDriveServlet : request code {}", code);
		log.info("OneDriveServlet : sakai user {}", userId);
		log.info("OneDriveServlet : pickerRedirectUrl {}", pickerRedirectUrl);
		boolean configured = false;
		if(code != null && userId != null) {
			configured = oneDriveService.token(userId, code);
		}
		log.info("OneDriveServlet : configured token {} ", configured);
		model.addAttribute("pickerRedirectUrl", pickerRedirectUrl != null ? pickerRedirectUrl : "/portal");
		model.addAttribute("onedriveConfigured", configured);
		log.info("OneDriveServlet : Finished action and returning.");
		return "index";
	}

}
