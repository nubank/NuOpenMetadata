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
Based on SettingsRouter.tsx
*/

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ROUTES } from '../constants/Nu.Constants';
import { ReferenceDataMenu } from '../constants/ReferenceData.constants';
import ReferenceDataPage from '../pages/ReferenceData/ReferenceDataPage';
import { getReferenceDataCategoryPath } from '../utils/RouterUtils';

const ReferenceDataRouter = () => {
  return (
    <Switch>
      <Route exact component={ReferenceDataPage} path={ROUTES.REFERENCE_DATA} />
      <Route
        exact
        component={ReferenceDataPage}
        path={getReferenceDataCategoryPath(ReferenceDataMenu.GEO)}
      />
      <Route
        exact
        component={ReferenceDataPage}
        path={getReferenceDataCategoryPath(ReferenceDataMenu.DATA_OPS_TEAM)}
      />
    </Switch>
  );
};

export default ReferenceDataRouter;
