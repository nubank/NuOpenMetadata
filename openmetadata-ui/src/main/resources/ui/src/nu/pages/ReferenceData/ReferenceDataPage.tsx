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

/*
Based on the GlobalSettingPage
*/

import { Col, Row } from 'antd';
import { isEmpty } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ErrorPlaceHolder from '../../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import PageHeader from '../../../components/PageHeader/PageHeader.component';
import PageLayoutV1 from '../../../components/PageLayoutV1/PageLayoutV1';
import { useApplicationsProvider } from '../../../components/Settings/Applications/ApplicationsProvider/ApplicationsProvider';
import SettingItemCard from '../../../components/Settings/SettingItemCard/SettingItemCard.component';
import { ERROR_PLACEHOLDER_TYPE } from '../../../enums/common.enum';
import { PAGE_HEADERS } from '../../constants/NuPageHeaders.constant';
import referenceDataClassBase from '../../utils/ReferenceDataClassBase';
import { getReferenceDataPath } from '../../utils/RouterUtils';

const ReferenceDataPage = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const { loading } = useApplicationsProvider();

  const referenceDataItems = useMemo(
    () => referenceDataClassBase.getReferenceDataMenuWithPermission(),
    [loading]
  );

  const handleReferenceDataItemClick = useCallback((category: string) => {
    history.push(getReferenceDataPath(category));
  }, []);

  if (isEmpty(referenceDataItems)) {
    return <ErrorPlaceHolder type={ERROR_PLACEHOLDER_TYPE.PERMISSION} />;
  }

  return (
    <PageLayoutV1 pageTitle={t('label.reference-data-plural')}>
      <Row className="page-container" gutter={[0, 20]}>
        <Col span={24}>
          <PageHeader data={PAGE_HEADERS.REFERENCE_DATA} />
        </Col>

        <Col span={24}>
          <Row gutter={[20, 20]}>
            {referenceDataItems.map((referenceData) => (
              <Col key={referenceData?.key} span={6}>
                <SettingItemCard
                  data={referenceData}
                  onClick={handleReferenceDataItemClick}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </PageLayoutV1>
  );
};

export default ReferenceDataPage;
