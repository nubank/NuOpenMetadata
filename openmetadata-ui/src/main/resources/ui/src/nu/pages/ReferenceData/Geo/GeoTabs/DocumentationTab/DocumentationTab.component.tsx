/*
 *  Copyright 2025 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
import { Col, Row, Space, Typography } from 'antd';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import DescriptionV1 from '../../../../../../components/common/EntityDescription/DescriptionV1';
import ResizablePanels from '../../../../../../components/common/ResizablePanels/ResizablePanels';
import { EntityField } from '../../../../../../constants/Feeds.constants';
import { COMMON_RESIZABLE_PANEL_CONFIG } from '../../../../../../constants/ResizablePanel.constants';
import {
  EntityType,
  TabSpecificField,
} from '../../../../../../enums/entity.enum';
import { ChangeDescription } from '../../../../../../generated/nu/referenceData/geo';
import { getEntityName } from '../../../../../../utils/EntityUtils';
import {
  getEntityVersionByField,
  getOwnerVersionLabel,
} from '../../../../../../utils/EntityVersionUtils';
import {
  DocumentationEntity,
  DocumentationTabProps,
} from './DocumentationTab.interface';

const DocumentationTab = ({
  geo,

  isVersionsView = false,
  type = DocumentationEntity.GEO,
}: DocumentationTabProps) => {
  const description = useMemo(
    () =>
      isVersionsView
        ? getEntityVersionByField(
            geo.changeDescription as ChangeDescription,
            EntityField.DESCRIPTION,
            geo.description
          )
        : geo.description,

    [geo, isVersionsView]
  );

  return (
    <>
      <ResizablePanels
        className="geo-height-with-resizable-panel"
        firstPanel={{
          className: 'geo-resizable-panel-container',
          children: (
            <div className="p-md geo-content-container">
              <DescriptionV1
                removeBlur
                description={description}
                entityName={getEntityName(geo)}
                entityType={EntityType.GEO}
                isEdit={false}
                showCommentsIcon={false}
              />
            </div>
          ),
          ...COMMON_RESIZABLE_PANEL_CONFIG.LEFT_PANEL,
        }}
        secondPanel={{
          children: (
            <>
              <Row gutter={[0, 40]}>
                <Col data-testid="geo-owner-name" span="24">
                  <div className="d-flex items-center m-b-xss">
                    <Typography.Text className="right-panel-label">
                      {t('label.owner-plural')}
                    </Typography.Text>
                  </div>
                  <Space className="m-r-xss" size={4}>
                    {getOwnerVersionLabel(
                      geo,
                      isVersionsView,
                      TabSpecificField.OWNERS
                    )}
                  </Space>
                </Col>
              </Row>
            </>
          ),
          ...COMMON_RESIZABLE_PANEL_CONFIG.RIGHT_PANEL,
          className:
            'entity-resizable-right-panel-container geo-resizable-panel-container',
        }}
      />
    </>
  );
};

export default DocumentationTab;
