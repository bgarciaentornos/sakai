/**********************************************************************************
 *
 * Copyright (c) 2017 The Sakai Foundation
 *
 * Original developers:
 *
 *   Unicon
 *
 * Licensed under the Educational Community License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.osedu.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 **********************************************************************************/


package org.sakaiproject.rubrics.logic;

import java.util.Map;
import java.util.Optional;

import org.sakaiproject.entity.api.Entity;
import org.sakaiproject.rubrics.logic.model.ToolItemRubricAssociation;

/**
 *
 */
public interface RubricsService {

    public static final String REFERENCE_ROOT = Entity.SEPARATOR + "rubrics";

    boolean hasAssociatedRubric(String toolId,
                                String associatedToolItemId);

    Optional<ToolItemRubricAssociation> getRubricAssociation(String toolId,
                                                             String associatedToolItemId) throws Exception;

    Optional<ToolItemRubricAssociation> getRubricAssociation(String toolId, String associatedToolItemId, String siteId) throws Exception;

    void saveRubricAssociation(String toolId,
                               String associatedToolItemId,
                               Map<String, String> params);

    void saveRubricEvaluation(String toolId,
                              String associatedToolItemId,
                              String evaluatedItemId,
                              String evaluatedItemOwnerId,
                              String evaluatorId,
                              Map<String, String> params);

    String generateJsonWebToken(String tool);

    String getCurrentSessionId();

    String generateLang();

    String getRubricEvaluationObjectId(String associationId, String userId, String toolId);

    void deleteRubricAssociation(String query, String toolId);

    void deleteRubricAssociationsByItemIdPrefix(String itemId, String toolId);
    void softDeleteRubricAssociationsByItemIdPrefix(String itemId, String toolId);
    void restoreRubricAssociationsByItemIdPrefix(String itemId, String toolId);

}
