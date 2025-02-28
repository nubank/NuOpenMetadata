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
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NU_ROUTES } from '../constants/Nu.Constants';
import GeoPage from '../pages/ReferenceData/Geo/GeoPage/GeoPage.component';

const GeoRouter = () => {
  return (
    <Switch>
      <Route exact component={GeoPage} path={NU_ROUTES.GEO} />

      <Route
        exact
        component={GeoPage}
        path={[NU_ROUTES.GEO_DETAILS, NU_ROUTES.GEO_DETAILS_WITH_ACTION]}
      />

      <Route
        exact
        component={GeoPage}
        path={[NU_ROUTES.GEO_DETAILS_WITH_TAB, NU_ROUTES.GEO_DETAILS_WITH_TAB]}
      />
    </Switch>
  );
};

export default GeoRouter;
