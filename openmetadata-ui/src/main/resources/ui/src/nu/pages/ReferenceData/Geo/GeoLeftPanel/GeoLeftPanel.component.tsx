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
import { Col, Menu, MenuProps, Row, Typography } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { t } from 'i18next';
import React, { useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import LeftPanelCard from '../../../../../components/common/LeftPanelCard/LeftPanelCard';
import GlossaryV1Skeleton from '../../../../../components/common/Skeleton/GlossaryV1/GlossaryV1LeftPanelSkeleton.component';
import { useFqn } from '../../../../../hooks/useFqn';
import { getEntityName } from '../../../../../utils/EntityUtils';
import Fqn from '../../../../../utils/Fqn';
import { ReactComponent as GeoIcon } from '../../../../assets/svg/geo.svg';
import { getGeoDetailsPath } from '../../../../utils/RouterUtils';
import { GeoLeftPanelProps } from './GeoLeftPanel.interface';

const GeoLeftPanel = ({ geos }: GeoLeftPanelProps) => {
  const { fqn: geoFqn } = useFqn();
  const history = useHistory();
  const menuRef = useRef<Menu>(null);

  const selectedKey = useMemo(() => {
    if (geoFqn) {
      return Fqn.split(geoFqn)[0];
    }

    return geos[0].fullyQualifiedName;
  }, [geoFqn]);

  const menuItems: ItemType[] = useMemo(() => {
    return geos.reduce((acc, geo) => {
      return [
        ...acc,
        {
          key: geo.fullyQualifiedName ?? '',
          label: getEntityName(geo),
          icon: <GeoIcon height={16} width={16} />,
        },
      ];
    }, [] as ItemType[]);
  }, [geos]);

  const handleMenuClick: MenuProps['onClick'] = (event) => {
    history.push(getGeoDetailsPath(event.key));
  };

  useEffect(() => {
    if (menuRef.current && geoFqn) {
      const items = document?.querySelectorAll(
        `[data-testid="geo-left-panel"] > li > span`
      );
      const menuItem = geos.find((item) => item.fullyQualifiedName === geoFqn);

      const itemToScroll = Array.from(items).find(
        (item) =>
          item.textContent === menuItem?.name ||
          item.textContent === menuItem?.displayName
      );

      if (itemToScroll) {
        const rect = itemToScroll.getBoundingClientRect();
        const isVisible =
          rect.top >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight);

        if (!isVisible) {
          const itemIndex = Array.from(items).findIndex(
            (item) => item === itemToScroll
          );
          const blockPosition =
            itemIndex > Array.from(items).length - 10 ? 'nearest' : 'center';
          itemToScroll.scrollIntoView({
            behavior: 'smooth',
            block: blockPosition,
          });
        }
      }
    }
  }, [geoFqn]);

  return (
    <LeftPanelCard id="geo">
      <GlossaryV1Skeleton loading={geos.length === 0}>
        <Row className="p-y-xs" gutter={[0, 16]}>
          <Col className="p-x-sm" span={24}>
            <Typography.Text strong className="m-b-0">
              {t('label.geo')}
            </Typography.Text>
          </Col>

          <Col span={24}>
            {menuItems.length ? (
              <Menu
                className="custom-menu"
                data-testid="geo-left-panel"
                items={menuItems}
                mode="inline"
                ref={menuRef}
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
              />
            ) : (
              <p className="text-grey-muted text-center">
                <span>{t('label.no-geo-found')}</span>
              </p>
            )}
          </Col>
        </Row>
      </GlossaryV1Skeleton>
    </LeftPanelCard>
  );
};

export default GeoLeftPanel;
