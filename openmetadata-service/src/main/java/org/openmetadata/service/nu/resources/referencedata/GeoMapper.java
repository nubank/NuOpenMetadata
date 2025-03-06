package org.openmetadata.service.nu.resources.referencedata;

import org.openmetadata.schema.nu.referencedata.api.CreateGeo;
import org.openmetadata.schema.nu.referencedata.entity.Geo;
import org.openmetadata.service.mapper.EntityMapper;

public class GeoMapper implements EntityMapper<Geo, CreateGeo> {

    @Override
    public Geo createToEntity(CreateGeo create, String user) {

        return copy(new Geo(), create, user)
                .withFullyQualifiedName(create.getName());
    }
}
