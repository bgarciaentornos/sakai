<%@ taglib uri="http://java.sun.com/jsf/core" prefix="f" %>
<%@ taglib uri="http://java.sun.com/jsf/html" prefix="h" %>
<%@ taglib uri="http://sakaiproject.org/jsf2/sakai" prefix="sakai" %>
<%@ taglib uri="http://myfaces.apache.org/tomahawk" prefix="t" %>
<f:view locale="#{UserLocale.locale}">
	<jsp:useBean id="msgs" class="org.sakaiproject.util.ResourceLoader" scope="session">
	   <jsp:setProperty name="msgs" property="baseName" value="signup"/>
	</jsp:useBean>
	<sakai:view_container title="Signup Tool">
		<style type="text/css">
			@import url("/sakai-signup-tool/css/signupStyle.css${Portal.CDNQuery}");
		</style>
		<h:outputText value="#{Portal.latestJQuery}" escape="false"/>
		<script src="/sakai-signup-tool/js/signupScript.js${Portal.CDNQuery}"></script>

        <script>
        $(document).ready( function() {
          var menuLink = $('#signupMainMenuLink');
          menuLink.addClass('current');
          menuLink.html(menuLink.find('a').text());
        });
        </script>
		<sakai:view_content>
			<h:form id="meeting">
				<%@ include file="/signup/menu/signupMenu.jsp" %>
				<h:outputText value="#{msgs.event_error_alerts} #{messageUIBean.errorMessage}" styleClass="alertMessage" escape="false" rendered="#{messageUIBean.error}"/>
				<div class="page-header">
					<sakai:view_title value="#{msgs.event_addSignup_attendee_page_title}"/>
				</div>

				<h:panelGrid columns="2" columnClasses="titleColumn,valueColumn" style="margin-top:20px;">
					<h:outputText value="#{msgs.event_name}" styleClass="titleText" escape="false"/>
					<h:outputText value="#{AttendeeSignupMBean.meetingWrapper.meeting.title}" styleClass="longtext"/>
					
					<h:outputText value="#{msgs.event_location}" styleClass="titleText" escape="false"/>
					<h:outputText value="#{AttendeeSignupMBean.meetingWrapper.meeting.location}" styleClass="longtext"/>
					
					<h:outputText value="#{msgs.event_timeslot}" escape="false"/>					
					<h:panelGroup>				    
		  		   		<h:outputText value="#{AttendeeSignupMBean.timeslotWrapper.timeSlot.startTime}">
							<f:convertDateTime pattern="#{UserLocale.localizedTimeFormat}" timeZone="#{UserTimeZone.userTimeZone}"/>
						</h:outputText>
						<h:outputText value="#{AttendeeSignupMBean.timeslotWrapper.timeSlot.startTime}" rendered="#{AttendeeSignupMBean.meetingWrapper.meeting.meetingCrossDays}">
								<f:convertDateTime pattern=", EEEEEEEE" timeZone="#{UserTimeZone.userTimeZone}"/>
						</h:outputText>	
						<h:outputText value="#{msgs.timeperiod_divider}" escape="false"/>
						<h:outputText value="#{AttendeeSignupMBean.timeslotWrapper.timeSlot.endTime}">
							<f:convertDateTime pattern="#{UserLocale.localizedTimeFormat}" timeZone="#{UserTimeZone.userTimeZone}"/>
						</h:outputText>
						<h:outputText value="#{AttendeeSignupMBean.timeslotWrapper.timeSlot.endTime}" styleClass="longtext">
							<f:convertDateTime pattern=", EEEEEEEE, " timeZone="#{UserTimeZone.userTimeZone}"/>
						</h:outputText>
						<h:outputText value="#{AttendeeSignupMBean.timeslotWrapper.timeSlot.endTime}" styleClass="longtext">
							<f:convertDateTime dateStyle="long" timeZone="#{UserTimeZone.userTimeZone}"/>
						</h:outputText>
					</h:panelGroup>	
					
					<h:outputText value="#{msgs.event_participant_name}" styleClass="titleText" escape="false"/>
					<h:outputText value="#{AttendeeSignupMBean.curUserDisplayName}" styleClass="longtext"/>				
					
					<h:outputText value="&nbsp;" escape="false"/>
					<h:outputText value="&nbsp;" escape="false"/>
					
					<h:outputText value="&nbsp;" escape="false"/>
					<h:outputLabel  onclick="showDetails('','meeting:closeImagne','meeting:commentSetting');signup_resetIFrameHeight('#{AttendeeSignupMBean.iframeId}');"  styleClass="activeTag" >
						<h:graphicImage id="closeImagne" value="/images/open.gif" alt="close" title="Click to hide comment." style="border:none;vertical-align:top;display:none;" styleClass="openCloseImageIcon"/>
						<h:graphicImage value="/images/comments_add.png" alt="#{msgs.event_add_comment_link}" style="border:none"/>
						<h:outputText value="&nbsp;#{msgs.event_add_comment_link}" escape="false"/>
					</h:outputLabel>							
				   	
				  <h:outputText id="commentSetting_1" style="display:none" value="&nbsp;" escape="false"/>
				  <f:verbatim><input type="hidden" id="ckeditor-autosave-context" name="ckeditor-autosave-context" value="signup_addattendee" /></f:verbatim>
				  <h:panelGroup rendered="#{AttendeeSignupMBean.meetingWrapper.meeting.id!=null}"><f:verbatim><input type="hidden" id="ckeditor-autosave-entity-id" name="ckeditor-autosave-entity-id" value="</f:verbatim><h:outputText value="#{AttendeeSignupMBean.meetingWrapper.meeting.id}"/><f:verbatim>"/></f:verbatim></h:panelGroup>

				  <h:panelGroup id="commentSetting_2" style="display:none">		   
				  		<sakai:inputRichText value="#{AttendeeSignupMBean.timeslotWrapper.newAttendee.comments}" height="200" rows="5"  cols="70"/>
				  </h:panelGroup>	
				</h:panelGrid>
				
				<sakai:button_bar>
					<h:commandButton id="save" action="#{AttendeeSignupMBean.attendeeSaveSignup}" value="#{msgs.event_button_finish}"/> 
					<h:commandButton id="Cancel" action="meeting" value="#{msgs.cancel_button}"  immediate="true"/>  
                </sakai:button_bar>

			 </h:form>
  		</sakai:view_content>	
	</sakai:view_container>
</f:view> 
