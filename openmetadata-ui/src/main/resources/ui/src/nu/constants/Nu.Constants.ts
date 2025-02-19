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
  PLACEHOLDER_ACTION,
  PLACEHOLDER_ROUTE_FQN,
  PLACEHOLDER_ROUTE_TAB,
} from '../../constants/constants';

export const PLACEHOLDER_REFERENCE_DATA = ':referenceData';

export const ROUTE_REFERENCE_DATA = 'reference-data';

export const ROUTES = {
  // Reference Data
  REFERENCE_DATA: `/${ROUTE_REFERENCE_DATA}`,
  REFERENCE_DATA_GEO: `/${ROUTE_REFERENCE_DATA}/geo`,
  REFERENCE_DATA_DATA_OPS_TEAM: `/${ROUTE_REFERENCE_DATA}/data-ops-team`,

  REFERENCE_DATA_WITH_CATEGORY: `/${ROUTE_REFERENCE_DATA}/${PLACEHOLDER_REFERENCE_DATA}`,
  REFERENCE_DATA_WITH_CATEGORY_FQN: `/${ROUTE_REFERENCE_DATA}/${PLACEHOLDER_REFERENCE_DATA}/${PLACEHOLDER_ROUTE_FQN}`,
  REFERENCE_DATA_WITH_TAB: `/${ROUTE_REFERENCE_DATA}/${PLACEHOLDER_REFERENCE_DATA}/${PLACEHOLDER_ROUTE_TAB}`,
  REFERENCE_DATA_WITH_TAB_FQN: `/${ROUTE_REFERENCE_DATA}/${PLACEHOLDER_REFERENCE_DATA}/${PLACEHOLDER_ROUTE_TAB}/${PLACEHOLDER_ROUTE_FQN}`,
  REFERENCE_DATA_WITH_TAB_FQN_ACTION: `/${ROUTE_REFERENCE_DATA}/${PLACEHOLDER_REFERENCE_DATA}/${PLACEHOLDER_ROUTE_TAB}/${PLACEHOLDER_ROUTE_FQN}/${PLACEHOLDER_ACTION}`,
};

export const REFERENCE_DATA = {
  GEO: 'geo',
  DATA_OPS_TEAM: 'data-ops-team',
};
