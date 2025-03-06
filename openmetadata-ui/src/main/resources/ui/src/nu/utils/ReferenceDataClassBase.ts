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
import { t } from 'i18next';
import { SettingMenuItem } from '../../utils/GlobalSettingsUtils';
import { ReactComponent as DataOpsTeamIcon } from '../assets/svg/data-ops-team.svg';
import { ReactComponent as GeoIcon } from '../assets/svg/geo.svg';
import { ReferenceDataMenu } from '../constants/ReferenceData.constants';

/*
Based on GlobalSettingsClassBase
*/

class ReferenceDataClassBase {
  referenceDataCategories: Record<string, { name: string; url: string }> = {
    [ReferenceDataMenu.GEO]: {
      name: t('label.geo'),
      url: ReferenceDataMenu.GEO,
    },
    [ReferenceDataMenu.DATA_OPS_TEAM]: {
      name: t('label.data-ops-team'),
      url: ReferenceDataMenu.DATA_OPS_TEAM,
    },
  };

  protected updateReferenceDataCategories(
    categories: Record<string, { name: string; url: string }>
  ) {
    this.referenceDataCategories = categories;
  }

  public getReferenceDataMenuWithPermission(): Array<SettingMenuItem> {
    return [
      {
        category: t('label.geo-plural'),
        key: ReferenceDataMenu.GEO,
        icon: GeoIcon,
        description: t('message.geo-description'),
        items: [],
      },
      {
        category: t('label.data-ops-team-plural'),
        key: ReferenceDataMenu.DATA_OPS_TEAM,
        icon: DataOpsTeamIcon,
        description: t('message.data-ops-team-description'),
        items: [],
      },
    ];
  }
}

const referenceDataClassBase = new ReferenceDataClassBase();

export default referenceDataClassBase;

export { ReferenceDataClassBase };
