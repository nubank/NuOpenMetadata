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
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import ErrorPlaceHolder from '../../../../../components/common/ErrorWithPlaceholder/ErrorPlaceHolder';
import Loader from '../../../../../components/common/Loader/Loader';
import ResizableLeftPanels from '../../../../../components/common/ResizablePanels/ResizableLeftPanels';
import { EntityDetailsObjectInterface } from '../../../../../components/Explore/ExplorePage.interface';
import { PAGE_SIZE_LARGE } from '../../../../../constants/constants';
import { observerOptions } from '../../../../../constants/Mydata.constants';
import { usePermissionProvider } from '../../../../../context/PermissionProvider/PermissionProvider';
import {
  EntityAction,
  TabSpecificField,
} from '../../../../../enums/entity.enum';
import { Geo } from '../../../../../generated/nu/referenceData/geo';
import { withPageLayout } from '../../../../../hoc/withPageLayout';
import { usePaging } from '../../../../../hooks/paging/usePaging';
import { useElementInView } from '../../../../../hooks/useElementInView';
import { useFqn } from '../../../../../hooks/useFqn';
import Fqn from '../../../../../utils/Fqn';
import { showErrorToast } from '../../../../../utils/ToastUtils';
import { useGeoStore } from '../../../../components/referenceData/Geo/useGeo.store';
import { getGeoByNuRN, getGeoList } from '../../../../rest/geoAPI';
import { getGeoDetailsPath } from '../../../../utils/RouterUtils';
import GeoDetailsPage from '../GeoDetailsPage/GeoDetailsPage.components';
import GeoLeftPanel from '../GeoLeftPanel/GeoLeftPanel.component';

const GeoPage = () => {
  const { t } = useTranslation();
  const { permissions } = usePermissionProvider();
  const { fqn: geoFqn } = useFqn();
  const history = useHistory();

  const { action } = useParams<{ action: EntityAction }>();
  const [initialised, setInitialised] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isMoreGeoLoading, setIsGeoGeoLoading] = useState<boolean>(false);
  const [elementRef, isInView] = useElementInView({
    ...observerOptions,
    rootMargin: '10px',
  });
  const { paging, handlePagingChange } = usePaging();

  const [isRightPanelLoading, setIsRightPanelLoading] = useState(true);
  const [previewAsset, setPreviewAsset] =
    useState<EntityDetailsObjectInterface>();

  const { geos, setGeos, activeGeo, setActiveGeo } = useGeoStore();

  const isGeoActive = useMemo(() => {
    setIsRightPanelLoading(true);
    setActiveGeo({} as Geo);

    if (geoFqn) {
      return Fqn.split(geoFqn).length === 1;
    }

    return true;
  }, [geoFqn]);

  const fetchGeoList = useCallback(async () => {
    try {
      let allGeos: Geo[] = [];
      let nextPage = paging.after;
      let isGeoFound = false;
      setInitialised(false);
      setIsLoading(true);

      do {
        const { data, paging: geoPaging } = await getGeoList({
          fields: [TabSpecificField.OWNERS, TabSpecificField.TAGS],
          limit: PAGE_SIZE_LARGE,
          ...(nextPage && { after: nextPage }),
        });

        allGeos = [...allGeos, ...data];

        if (geoFqn) {
          isGeoFound = allGeos.some(
            (item) => item.fullyQualifiedName === geoFqn
          );
        } else {
          isGeoFound = true; // limit to first 50 records only if no geoFqn
        }

        nextPage = geoPaging?.after;

        handlePagingChange(geoPaging);
      } while (nextPage && !isGeoFound);

      setGeos(allGeos);
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setIsLoading(false);
      setInitialised(true);
    }
  }, [paging.after, geoFqn]);

  useEffect(() => {
    if (!initialised) {
      fetchGeoList();
    }
  }, [initialised]);

  const fetchGeoDetail = useCallback(async () => {
    setIsRightPanelLoading(true);
    try {
      const response = await getGeoByNuRN(geoFqn, {
        fields: [TabSpecificField.EXTENSION],
      });
      setActiveGeo(response as Geo);
    } catch (error) {
      showErrorToast(error as AxiosError);
    } finally {
      setIsRightPanelLoading(false);
    }
  }, [geoFqn]);

  useEffect(() => {
    setIsRightPanelLoading(true);
    if (geos.length) {
      if (!isGeoActive) {
        fetchGeoDetail();
      } else {
        setActiveGeo(
          geos.find((geo) => geo.fullyQualifiedName === geoFqn) || geos[0]
        );

        !geoFqn &&
          geos[0].fullyQualifiedName &&
          history.replace(getGeoDetailsPath(geos[0].fullyQualifiedName));

        setIsRightPanelLoading(false);
      }
    }
  }, [isGeoActive, geoFqn, geos]);

  const geoPageRender = useMemo(() => {
    if (isLoading) {
      return <Loader />;
    } else if (!activeGeo) {
      return <ErrorPlaceHolder />;
    } else {
      return <GeoDetailsPage geo={activeGeo} />;
    }
  }, [isLoading, activeGeo]);

  if (isLoading) {
    return <Loader />;
  }

  if (geos.length === 0 && !isLoading) {
    return (
      <div className="d-flex justify-center items-center full-height">
        <ErrorPlaceHolder
          buttonId="add-geo"
          className="mt-0-important"
          heading={t('label.geo')}
        />
      </div>
    );
  }

  return (
    <div className="m--t-sm">
      <ResizableLeftPanels
        className="content-height-with-resizable-panel"
        firstPanel={{
          className: 'content-resizable-panel-container',
          minWidth: 280,
          flex: 0.13,
          children: <GeoLeftPanel geos={geos} />,
        }}
        pageTitle={t('label.domain')}
        secondPanel={{
          children: geoPageRender,
          className: 'content-resizable-panel-container p-t-sm',
          minWidth: 800,
          flex: 0.87,
        }}
      />
    </div>
  );
};

export default withPageLayout('geo')(GeoPage);
