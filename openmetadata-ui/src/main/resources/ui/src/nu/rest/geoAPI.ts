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

import { PagingResponse } from 'Models';
import { PAGE_SIZE_MEDIUM } from '../../constants/constants';
import { SearchIndex } from '../../enums/search.enum';
import { Geo } from '../../generated/nu/referenceData/geo';
import { EntityHistory } from '../../generated/type/entityHistory';
import { ListParams } from '../../interface/API.interface';
import APIClient from '../../rest/index';
import { getEncodedFqn } from '../../utils/StringsUtils';

const BASE_URL = '/geos';

export const getGeoList = async (params?: ListParams) => {
  const response = await APIClient.get<PagingResponse<Geo[]>>(BASE_URL, {
    params,
  });

  return response.data;
};

export const getGeoByNuRN = async (fqn: string, params?: ListParams) => {
  const url = `${BASE_URL}/nurn/${getEncodedFqn(fqn)}`;

  const response = await APIClient.get<Geo>(url, {
    params,
  });

  return response.data;
};

export const getGeoVersionsList = async (id: string) => {
  const url = `${BASE_URL}/${id}/versions`;
  const response = await APIClient.get<EntityHistory>(url);

  return response.data;
};

export const getGeoVersionData = async (id: string, version: string) => {
  const url = `${BASE_URL}/${id}/versions/${version}`;
  const response = await APIClient.get<Geo>(url);

  return response.data;
};

export const searchGeos = async (search: string, page = 1) => {
  const apiUrl = `/search/query?q=*${search ?? ''}*`;

  const { data } = await APIClient.get(apiUrl, {
    params: {
      index: SearchIndex.DOMAIN,
      from: (page - 1) * PAGE_SIZE_MEDIUM,
      size: PAGE_SIZE_MEDIUM,
      deleted: false,
      track_total_hits: true,
      getHierarchy: true,
    },
  });

  return data;
};
