/**
 * Copyright (c) 2003-2017 The Apereo Foundation
 *
 * Licensed under the Educational Community License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *             http://opensource.org/licenses/ecl2
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.sakaiproject.profile2.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import javax.annotation.Resource;

import org.sakaiproject.component.api.ServerConfigurationService;
import org.sakaiproject.event.api.Event;
import org.sakaiproject.exception.IdUnusedException;
import org.sakaiproject.messaging.api.UserNotificationData;
import org.sakaiproject.messaging.api.AbstractUserNotificationHandler;;
import org.sakaiproject.profile2.util.ProfileConstants;
import org.sakaiproject.site.api.Site;
import org.sakaiproject.site.api.SiteService;

import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FriendMessageUserNotificationHandler extends AbstractUserNotificationHandler {

    @Resource
    private ServerConfigurationService serverConfigurationService;

    @Resource
    private SiteService siteService;

    @Override
    public List<String> getHandledEvents() {
        return Arrays.asList(ProfileConstants.EVENT_MESSAGE_SENT);
    }

    @Override
    public Optional<List<UserNotificationData>> handleEvent(Event e) {

        String from = e.getUserId();

        String ref = e.getResource();
        String[] pathParts = ref.split("/");

        String to = pathParts[2];
        String siteId = "~" + to;

        try {
            Site site = siteService.getSite(siteId);
            String toolId = site.getToolForCommonId("sakai.profile2").getId();
            String url = serverConfigurationService.getPortalUrl() + "/site/" + siteId
                                                        + "/tool/" + toolId + "/messages";
            return Optional.of(Collections.singletonList(new UserNotificationData(from, to, siteId, "", url, ProfileConstants.TOOL_ID)));
        } catch (IdUnusedException idue) {
            log.error("No site for id: " + siteId);
        }

        return Optional.empty();
    }
}
