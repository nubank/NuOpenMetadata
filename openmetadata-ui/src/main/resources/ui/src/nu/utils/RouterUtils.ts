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
import {
  PLACEHOLDER_ROUTE_FQN,
  PLACEHOLDER_ROUTE_TAB,
  PLACEHOLDER_ROUTE_VERSION,
} from '../../constants/constants';
import { getEncodedFqn } from '../../utils/StringsUtils';
import {
  NU_ROUTES,
  PLACEHOLDER_REFERENCE_DATA,
} from '../constants/Nu.Constants';

export const getReferenceDataPath = (
  category?: string,
  tab?: string,
  withFqn = false,
  withAction = false
) => {
  let path = NU_ROUTES.REFERENCE_DATA;

  if (tab && category) {
    if (withFqn) {
      path = withAction
        ? NU_ROUTES.REFERENCE_DATA_WITH_TAB_FQN_ACTION
        : NU_ROUTES.REFERENCE_DATA_WITH_TAB_FQN;
    } else {
      path = NU_ROUTES.REFERENCE_DATA_WITH_TAB;
    }

    path = path.replace(PLACEHOLDER_ROUTE_TAB, tab);
    path = path.replace(PLACEHOLDER_REFERENCE_DATA, category);
  } else if (category) {
    path = withFqn
      ? NU_ROUTES.REFERENCE_DATA_WITH_CATEGORY_FQN
      : NU_ROUTES.REFERENCE_DATA_WITH_CATEGORY;

    path = path.replace(PLACEHOLDER_REFERENCE_DATA, category);
  }

  return path;
};

export const getReferenceDataCategoryPath = (referenceData: string) => {
  let path = NU_ROUTES.REFERENCE_DATA_WITH_TAB;

  if (referenceData) {
    path = path.replace(PLACEHOLDER_REFERENCE_DATA, referenceData);
  }

  return path;
};

export const getGeoPath = (fqn?: string) => {
  let path = NU_ROUTES.GEO;
  if (fqn) {
    path = NU_ROUTES.GEO_DETAILS;
    path = path.replace(PLACEHOLDER_ROUTE_FQN, getEncodedFqn(fqn));
  }

  return path;
};

export const getGeoVersionsPath = (domainFqn: string, version: string) => {
  let path = NU_ROUTES.GEO_VERSION;
  path = path
    .replace(PLACEHOLDER_ROUTE_FQN, getEncodedFqn(domainFqn))
    .replace(PLACEHOLDER_ROUTE_VERSION, version);

  return path;
};

export const getGeoDetailsPath = (fqn: string, tab?: string) => {
  let path = tab ? NU_ROUTES.GEO_DETAILS_WITH_TAB : NU_ROUTES.GEO_DETAILS;

  path = path.replace(PLACEHOLDER_ROUTE_FQN, getEncodedFqn(fqn));

  if (tab) {
    path = path.replace(PLACEHOLDER_ROUTE_TAB, tab);
  }

  return path;
};
