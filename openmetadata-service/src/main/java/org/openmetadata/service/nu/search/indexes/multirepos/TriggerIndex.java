package org.openmetadata.service.nu.search.indexes.multirepos;


import org.openmetadata.schema.nu.multirepos.entity.Trigger;
import org.openmetadata.service.Entity;
import org.openmetadata.service.search.indexes.SearchIndex;
import org.openmetadata.service.search.models.SearchSuggest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public record TriggerIndex (Trigger trigger) implements SearchIndex {
    @Override
    public List<SearchSuggest> getSuggest() {
        List<SearchSuggest> suggest = new ArrayList<>();
        suggest.add(SearchSuggest.builder().input(trigger.getName()).weight(5).build());
        suggest.add(SearchSuggest.builder().input(trigger.getFullyQualifiedName()).weight(5).build());
        return suggest;
    }


    @Override
    public Object getEntity() {
        return trigger;
    }

    @Override
    public Map<String, Object> buildSearchIndexDocInternal(Map<String, Object> doc) {
        Map<String, Object> commonAttributes = getCommonAttributesMap(trigger, Entity.DOMAIN);
        doc.putAll(commonAttributes);
        return doc;
    }
}
