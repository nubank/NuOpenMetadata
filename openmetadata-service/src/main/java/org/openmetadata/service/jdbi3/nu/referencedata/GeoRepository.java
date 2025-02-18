package org.openmetadata.service.jdbi3.nu.referencedata;


import lombok.extern.slf4j.Slf4j;
import org.openmetadata.schema.entity.nu.referencedata.Geo;
import org.openmetadata.service.Entity;
import org.openmetadata.service.jdbi3.EntityRepository;
import org.openmetadata.service.resources.nu.referencedata.GeoResource;
import org.openmetadata.service.util.EntityUtil;

@Slf4j
public class GeoRepository extends EntityRepository<Geo> {
    private static final String UPDATE_FIELDS = "";

    public GeoRepository() {
        super(
                GeoResource.COLLECTION_PATH,
                Entity.GEO,
                Geo.class,
                Entity.getCollectionDAO().geoDAO(),
                UPDATE_FIELDS,
                UPDATE_FIELDS);
        supportsSearch = true;
    }

    @Override
    protected void setFields(Geo entity, EntityUtil.Fields fields) {

    }

    @Override
    protected void clearFields(Geo entity, EntityUtil.Fields fields) {

    }

    @Override
    protected void prepare(Geo entity, boolean update) {

    }

    @Override
    protected void storeEntity(Geo entity, boolean update) {
        store(entity, update);
    }

    @Override
    protected void storeRelationships(Geo entity) {

    }
}
