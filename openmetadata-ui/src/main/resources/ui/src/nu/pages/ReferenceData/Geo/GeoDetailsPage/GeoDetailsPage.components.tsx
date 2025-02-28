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
import Icon from '@ant-design/icons';
import { Button, Col, Row, Tabs, Tooltip, Typography } from 'antd';
import ButtonGroup from 'antd/lib/button/button-group';
import classNames from 'classnames';
import { t } from 'i18next';
import { toString } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ReactComponent as VersionIcon } from '../../../../../assets/svg/ic-version.svg';
import ResizablePanels from '../../../../../components/common/ResizablePanels/ResizablePanels';
import TabsLabel from '../../../../../components/common/TabsLabel/TabsLabel.component';
import { EntityHeader } from '../../../../../components/Entity/EntityHeader/EntityHeader.component';
import EntitySummaryPanel from '../../../../../components/Explore/EntitySummaryPanel/EntitySummaryPanel.component';
import { EntityDetailsObjectInterface } from '../../../../../components/Explore/ExplorePage.interface';
import AssetsTabs, {
  AssetsTabRef,
} from '../../../../../components/Glossary/GlossaryTerms/tabs/AssetsTabs.component';
import { AssetsOfEntity } from '../../../../../components/Glossary/GlossaryTerms/tabs/AssetsTabs.interface';
import { FQN_SEPARATOR_CHAR } from '../../../../../constants/char.constants';
import { DE_ACTIVE_COLOR } from '../../../../../constants/constants';
import { EntityField } from '../../../../../constants/Feeds.constants';
import { OperationPermission } from '../../../../../context/PermissionProvider/PermissionProvider.interface';
import { EntityType } from '../../../../../enums/entity.enum';
import { SearchIndex } from '../../../../../enums/search.enum';
import { ChangeDescription } from '../../../../../generated/nu/referenceData/geo';
import { useFqn } from '../../../../../hooks/useFqn';
import { searchData } from '../../../../../rest/miscAPI';
import { getEntityVersionByField } from '../../../../../utils/EntityVersionUtils';
import Fqn from '../../../../../utils/Fqn';
import { DEFAULT_ENTITY_PERMISSION } from '../../../../../utils/PermissionsUtils';
import {
  escapeESReservedCharacters,
  getEncodedFqn,
} from '../../../../../utils/StringsUtils';
import { ReactComponent as GeoIcon } from '../../../../assets/svg/geo.svg';
import {
  getGeoDetailsPath,
  getGeoPath,
  getGeoVersionsPath,
} from '../../../../utils/RouterUtils';
import { GeoTabs } from '../GeoPage/GeoPage.interface';
import DocumentationTab from '../GeoTabs/DocumentationTab/DocumentationTab.component';
import { GeoDetailsPageProps } from './GeoDetailsPage.interface';

const GeoDetailsPage = ({
  geo,
  isVersionsView = false,
}: GeoDetailsPageProps) => {
  const { fqn: geoFqn } = useFqn();
  const [assetCount, setAssetCount] = useState<number>(0);
  const encodedFqn = getEncodedFqn(escapeESReservedCharacters(geoFqn));
  const { tab: activeTab, version } =
    useParams<{ tab: string; version: string }>();
  const history = useHistory();
  const [previewAsset, setPreviewAsset] =
    useState<EntityDetailsObjectInterface>();

  const [geoPermission, setGeoPermission] = useState<OperationPermission>(
    DEFAULT_ENTITY_PERMISSION
  );

  const assetTabRef = useRef<AssetsTabRef>(null);

  const [name, displayName] = useMemo(() => {
    if (isVersionsView) {
      const updatedName = getEntityVersionByField(
        geo.changeDescription as ChangeDescription,
        EntityField.NAME,
        geo.name
      );
      const updatedDisplayName = getEntityVersionByField(
        geo.changeDescription as ChangeDescription,
        EntityField.DISPLAYNAME,
        geo.displayName
      );

      return [updatedName, updatedDisplayName];
    } else {
      return [geo.name, geo.displayName];
    }
  }, [geo, isVersionsView]);

  const iconData = useMemo(() => {
    if (geo.style?.iconURL) {
      return (
        <img
          alt="geo-icon"
          className="align-middle"
          data-testid="icon"
          height={36}
          src={geo.style.iconURL}
          width={32}
        />
      );
    }

    return (
      <GeoIcon
        className="align-middle"
        color={DE_ACTIVE_COLOR}
        height={36}
        name="folder"
        width={32}
      />
    );
  }, [geo]);

  const breadcrumbs = useMemo(() => {
    if (!geoFqn) {
      return [];
    }

    const arr = Fqn.split(geoFqn);
    const dataFQN: Array<string> = [];

    return [
      {
        name: 'Geos',
        url: getGeoPath(arr[0]),
        activeTitle: false,
      },
      ...arr.slice(0, -1).map((d) => {
        dataFQN.push(d);

        return {
          name: d,
          url: getGeoPath(dataFQN.join(FQN_SEPARATOR_CHAR)),
          activeTitle: false,
        };
      }),
    ];
  }, [geoFqn]);

  const fetchGeoAssets = async () => {
    if (geoFqn) {
      try {
        const res = await searchData(
          '',
          1,
          0,
          `(geo.fullyQualifiedName:"${encodedFqn}")`,
          '',
          '',
          SearchIndex.ALL
        );

        setAssetCount(res.data.hits.total.value ?? 0);
      } catch (error) {
        setAssetCount(0);
      }
    }
  };

  const handleTabChange = (activeKey: string) => {
    if (activeKey === 'assets') {
      // refresh geo count when assets tab is selected
      fetchGeoAssets();
    }
    if (activeKey !== activeTab) {
      history.push(getGeoDetailsPath(geoFqn, activeKey));
    }
  };

  const handleAssetClick = useCallback((asset) => {
    setPreviewAsset(asset);
  }, []);

  const handleVersionClick = async () => {
    const path = isVersionsView
      ? getGeoPath(geoFqn)
      : getGeoVersionsPath(geoFqn, toString(geo.version));

    history.push(path);
  };

  useEffect(() => {
    fetchGeoAssets();
  }, [geoFqn]);

  const addAsset = () => {
    // do nothing.
  };

  const tabs = useMemo(() => {
    return [
      {
        label: (
          <TabsLabel
            id={GeoTabs.DOCUMENTATION}
            name={t('label.documentation')}
          />
        ),
        key: GeoTabs.DOCUMENTATION,
        children: (
          <DocumentationTab geo={geo} isVersionsView={isVersionsView} />
        ),
      },
      ...(!isVersionsView
        ? [
            {
              label: (
                <TabsLabel
                  count={assetCount ?? 0}
                  id={GeoTabs.ASSETS}
                  isActive={activeTab === GeoTabs.ASSETS}
                  name={t('label.asset-plural')}
                />
              ),
              key: GeoTabs.ASSETS,
              children: (
                <ResizablePanels
                  className="geo-height-with-resizable-panel"
                  firstPanel={{
                    className: 'geo-resizable-panel-container',
                    children: (
                      <div className="p-x-md p-y-md">
                        <AssetsTabs
                          assetCount={assetCount}
                          entityFqn={geoFqn}
                          isSummaryPanelOpen={false}
                          permissions={geoPermission}
                          ref={assetTabRef}
                          type={AssetsOfEntity.GEO}
                          onAddAsset={addAsset}
                          onAssetClick={undefined}
                        />
                      </div>
                    ),
                    minWidth: 800,
                    flex: 0.87,
                  }}
                  hideSecondPanel={!previewAsset}
                  pageTitle={t('label.geo')}
                  secondPanel={{
                    children: previewAsset && (
                      <EntitySummaryPanel
                        entityDetails={previewAsset}
                        handleClosePanel={() => setPreviewAsset(undefined)}
                      />
                    ),
                    minWidth: 400,
                    flex: 0.13,
                    className:
                      'entity-summary-resizable-right-panel-container geo-resizable-panel-container',
                  }}
                />
              ),
            },
          ]
        : []),
    ];
  }, [geo, previewAsset, handleAssetClick, assetCount, activeTab]);

  return (
    <>
      <Row className="geo-details" data-testid="geo-details" gutter={[0, 12]}>
        <Col className="p-x-md p-l-xl" flex="auto">
          <EntityHeader
            breadcrumb={breadcrumbs}
            entityData={{ ...geo, displayName, name }}
            entityType={EntityType.GEO}
            icon={iconData}
            serviceName=""
            titleColor={geo.style?.color}
          />
        </Col>
        <Col className="p-x-md" flex="320px">
          <div style={{ textAlign: 'right' }}>
            <ButtonGroup className="p-l-xs" size="small">
              {geo?.version && (
                <Tooltip
                  title={t(
                    `label.${
                      isVersionsView
                        ? 'exit-version-history'
                        : 'version-plural-history'
                    }`
                  )}>
                  <Button
                    className={classNames('', {
                      'text-primary border-primary': version,
                    })}
                    data-testid="version-button"
                    icon={<Icon component={VersionIcon} />}
                    onClick={handleVersionClick}>
                    <Typography.Text
                      className={classNames('', {
                        'text-primary': version,
                      })}>
                      {toString(geo.version)}
                    </Typography.Text>
                  </Button>
                </Tooltip>
              )}
            </ButtonGroup>
          </div>
        </Col>
        <Col span={24}>
          <Tabs
            destroyInactiveTabPane
            activeKey={activeTab ?? GeoTabs.DOCUMENTATION}
            className="domain-details-page-tabs"
            data-testid="tabs"
            items={tabs}
            onChange={handleTabChange}
          />
        </Col>
      </Row>
    </>
  );
};

export default GeoDetailsPage;
