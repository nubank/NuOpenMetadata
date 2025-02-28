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
import { create } from 'zustand';
import { Geo } from '../../../../generated/nu/referenceData/geo';

export const useGeoStore = create<{
  geos: Geo[];
  activeGeo: Geo;
  setGeos: (geos: Geo[]) => void;
  setActiveGeo: (geo: Geo) => void;
  updateGeo: (geo: Geo) => void;
  updateActiveGeo: (geo: Partial<Geo>) => void;
}>()((set, get) => ({
  geos: [],
  activeGeo: {} as Geo,
  geoChildTerms: [],

  setGeos: (geos: Geo[]) => {
    set({ geos });
  },
  updateGeo: (geo: Geo) => {
    const { geos } = get();

    const newGlossaries = geos.map((g) =>
      g.fullyQualifiedName === geo.fullyQualifiedName ? geo : g
    );

    set({ geos: newGlossaries });
  },
  setActiveGeo: (geo: Geo) => {
    set({ activeGeo: geo });
  },
  updateActiveGeo: (geo: Partial<Geo>) => {
    const { activeGeo, geos } = get();

    const updatedGeo = {
      ...activeGeo,
      ...geo,
    } as Geo;

    // Update the active geo
    set({ activeGeo: updatedGeo });

    // Update the corresponding geo in the geos list
    const index = geos.findIndex(
      (g) => g.fullyQualifiedName === updatedGeo.fullyQualifiedName
    );

    if (index !== -1) {
      geos[index] = updatedGeo;
    }
  },
}));
