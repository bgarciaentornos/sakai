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
package org.sakaiproject.webapi.beans;

import org.sakaiproject.announcement.api.AnnouncementMessage;
import org.sakaiproject.announcement.api.AnnouncementService;
import org.sakaiproject.entity.api.EntityPropertyNotDefinedException;
import org.sakaiproject.entity.api.EntityPropertyTypeException;
import org.sakaiproject.entity.api.ResourceProperties;
import org.sakaiproject.site.api.Site;

import org.apache.commons.lang3.BooleanUtils;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnnouncementRestBean {

    private String id;
    private String siteId;
    private String siteTitle;
    private String subject;
    private String author;
    private String url;
    private int order;
    private long date;
    private boolean highlighted;

    public AnnouncementRestBean(Site site, AnnouncementMessage am, String url) {

        id = am.getId();
        siteId = site.getId();
        siteTitle = site.getTitle();
        subject = am.getAnnouncementHeader().getSubject();
        author = am.getAnnouncementHeader().getFrom().getDisplayName();
        date = am.getAnnouncementHeader().getInstant().toEpochMilli();
        order = am.getAnnouncementHeader().getMessage_order();

        ResourceProperties props = am.getProperties();
        highlighted = BooleanUtils.toBoolean(props.getProperty("highlight"));
        try {
            date = props.getInstantProperty(AnnouncementService.RELEASE_DATE).toEpochMilli();
        } catch (EntityPropertyTypeException|EntityPropertyNotDefinedException e) { /*No action needed*/ }

        this.url = url;
    }
}
