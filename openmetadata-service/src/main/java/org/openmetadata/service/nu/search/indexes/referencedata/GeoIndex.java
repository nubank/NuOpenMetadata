package org.openmetadata.service.nu.search.indexes.referencedata;


import org.openmetadata.schema.nu.referencedata.entity.Geo;
import org.openmetadata.service.Entity;
import org.openmetadata.service.search.indexes.SearchIndex;
import org.openmetadata.service.search.models.SearchSuggest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public record GeoIndex (Geo geo) implements SearchIndex {
    @Override
    public List<SearchSuggest> getSuggest() {
        List<SearchSuggest> suggest = new ArrayList<>();
        suggest.add(SearchSuggest.builder().input(geo.getName()).weight(5).build());
        suggest.add(SearchSuggest.builder().input(geo.getFullyQualifiedName()).weight(5).build());
        return suggest;
    }


    @Override
    public Object getEntity() {
        return geo;
    }

    @Override
    public Map<String, Object> buildSearchIndexDocInternal(Map<String, Object> doc) {
        Map<String, Object> commonAttributes = getCommonAttributesMap(geo, Entity.DOMAIN);
        doc.putAll(commonAttributes);
        return doc;
    }
}
