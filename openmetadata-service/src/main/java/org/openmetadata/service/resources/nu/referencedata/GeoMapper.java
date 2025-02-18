package org.openmetadata.service.resources.nu.referencedata;

import org.openmetadata.schema.api.nu.referencedata.CreateGeo;
import org.openmetadata.schema.entity.nu.referencedata.Geo;
import org.openmetadata.service.mapper.EntityMapper;

public class GeoMapper implements EntityMapper<Geo, CreateGeo> {

    @Override
    public Geo createToEntity(CreateGeo create, String user) {

        return copy(new Geo(), create, user)
                .withFullyQualifiedName(create.getName());
    }
}
