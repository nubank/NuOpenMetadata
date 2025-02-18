package org.openmetadata.service.resources.nu.referencedata;

import io.swagger.v3.oas.annotations.ExternalDocumentation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;


import org.openmetadata.schema.api.nu.referencedata.CreateGeo;
import org.openmetadata.schema.entity.nu.referencedata.Geo;
import org.openmetadata.schema.type.Include;
import org.openmetadata.schema.utils.EntityInterfaceUtil;
import org.openmetadata.service.Entity;
import org.openmetadata.service.jdbi3.ListFilter;
import org.openmetadata.service.jdbi3.nu.referencedata.GeoRepository;
import org.openmetadata.service.limits.Limits;
import org.openmetadata.service.resources.Collection;
import org.openmetadata.service.resources.EntityResource;

import org.openmetadata.service.security.Authorizer;
import org.openmetadata.service.util.ResultList;

import javax.json.JsonPatch;
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.util.UUID;

@Path("/v1/geos")
@Tag(
        name = "Geos",
        description = "A `Geo` ")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Collection(name = "geos")
public class GeoResource extends EntityResource<Geo, GeoRepository> {

    public static final String COLLECTION_PATH = "/v1/geos/";
    private final GeoMapper mapper = new GeoMapper();
    static final String FIELDS = "extension";

    public GeoResource(Authorizer authorizer, Limits limits) {
        super(Entity.GEO, authorizer, limits);
    }

    @Override
    public Geo addHref(UriInfo uriInfo, Geo geo) {
        super.addHref(uriInfo, geo);
        Entity.withHref(uriInfo, geo.getEntityReference());
        return geo;
    }

    public static class GeoList extends ResultList<Geo> {
        @SuppressWarnings("unused")
        public GeoList() {
            /* Required for serde */
        }
    }

    @GET
    @Operation(
            operationId = "listGeos",
            summary = "List geos",
            description = "Get a list of Geo.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "List of Geo",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = GeoResource.GeoList.class)))
            })
    public ResultList<Geo> list(
            @Context UriInfo uriInfo,
            @Context SecurityContext securityContext,
            @DefaultValue("10") @Min(0) @Max(1000000) @QueryParam("limit") int limitParam,
            @Parameter(
                    description = "Returns list of Geo before this cursor",
                    schema = @Schema(type = "string"))
            @QueryParam("before")
            String before,
            @Parameter(
                    description = "Returns list of Geo after this cursor",
                    schema = @Schema(type = "string"))
            @QueryParam("after")
            String after,
            @Parameter(
                    description = "Include all, deleted, or non-deleted entities.",
                    schema = @Schema(implementation = Include.class))
            @QueryParam("include")
            @DefaultValue("non-deleted")
            Include include) {
        return listInternal(
                uriInfo, securityContext, "", new ListFilter(include), limitParam, before, after);
    }



    @GET
    @Path("/{id}")
    @Operation(
            operationId = "getGeoByID",
            summary = "Get a geo by Id",
            description = "Get a geo by `Id`.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "The geo",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = Geo.class))),
                    @ApiResponse(responseCode = "404", description = "Geo for instance {id} is not found")
            })
    public Geo get(
            @Context UriInfo uriInfo,
            @Context SecurityContext securityContext,
            @QueryParam("include") @DefaultValue("non-deleted") Include include,
            @Parameter(description = "Id of the geo", schema = @Schema(type = "UUID")) @PathParam("id")
            UUID id) {
        return getInternal(uriInfo, securityContext, id, "", include);
    }

    @GET
    @Path("/nurn/{nurn}")
    @Operation(
            operationId = "getGeoByFQN",
            summary = "Get a geo by nurn",
            description = "Get a geo by `nurn`.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "geo",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = Geo.class))),
                    @ApiResponse(responseCode = "404", description = "Geo for instance {nurn} is not found")
            })
    public Geo getByNuRN(
            @Context UriInfo uriInfo,
            @Context SecurityContext securityContext,
            @Parameter(description = "NuRN of the geo", schema = @Schema(type = "string"))
            @PathParam("nurn")
            String nurn,
            @Parameter(
                    description = "Include all, deleted, or non-deleted entities.",
                    schema = @Schema(implementation = Include.class))
            @QueryParam("include")
            @DefaultValue("non-deleted")
            Include include) {
        return getByNameInternal(
                uriInfo, securityContext, EntityInterfaceUtil.quoteName(nurn), "", include);
    }

    @POST
    @Operation(
            operationId = "createGeo",
            summary = "Create a geo",
            description = "Create a new geo.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "The geo ",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = Geo.class))),
                    @ApiResponse(responseCode = "400", description = "Bad request")
            })
    public Response create(
            @Context UriInfo uriInfo, @Context SecurityContext securityContext, @Valid CreateGeo create) {
        Geo geo = mapper.createToEntity(create, securityContext.getUserPrincipal().getName());
        return create(uriInfo, securityContext, geo);
    }

    @PUT
    @Operation(
            operationId = "createOrUpdateGeo",
            summary = "Create or update a geo",
            description = "Create a geo, if it does not exist. If a geo already exists, update the geo.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "The geo",
                            content =
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = Geo.class))),
                    @ApiResponse(responseCode = "400", description = "Bad request")
            })
    public Response createOrUpdate(
            @Context UriInfo uriInfo, @Context SecurityContext securityContext, @Valid CreateGeo create) {
        Geo geo = mapper.createToEntity(create, securityContext.getUserPrincipal().getName());
        return createOrUpdate(uriInfo, securityContext, geo);
    }

    @PATCH
    @Path("/{id}")
    @Operation(
            operationId = "patchGeo",
            summary = "Update a geo",
            description = "Update an existing geo using JsonPatch.",
            externalDocs =
            @ExternalDocumentation(
                    description = "JsonPatch RFC",
                    url = "https://tools.ietf.org/html/rfc6902"))
    @Consumes(MediaType.APPLICATION_JSON_PATCH_JSON)
    public Response patch(
            @Context UriInfo uriInfo,
            @Context SecurityContext securityContext,
            @Parameter(description = "Id of the geo", schema = @Schema(type = "UUID")) @PathParam("id")
            UUID id,
            @RequestBody(
                    description = "JsonPatch with array of operations",
                    content =
                    @Content(
                            mediaType = MediaType.APPLICATION_JSON_PATCH_JSON,
                            examples = {
                                    @ExampleObject("[{op:remove, path:/a},{op:add, path: /b, value: val}]")
                            }))
            JsonPatch patch) {
        return patchInternal(uriInfo, securityContext, id, patch);
    }

    @PATCH
    @Path("/nurn/{nurn}")
    @Operation(
            operationId = "patchGeo",
            summary = "Update a geo by NuRN.",
            description = "Update an existing geo using JsonPatch.",
            externalDocs =
            @ExternalDocumentation(
                    description = "JsonPatch RFC",
                    url = "https://tools.ietf.org/html/rfc6902"))
    @Consumes(MediaType.APPLICATION_JSON_PATCH_JSON)
    public Response patch(
            @Context UriInfo uriInfo,
            @Context SecurityContext securityContext,
            @Parameter(description = "NuRN of the geo", schema = @Schema(type = "string"))
            @PathParam("nurn")
            String nurn,
            @RequestBody(
                    description = "JsonPatch with array of operations",
                    content =
                    @Content(
                            mediaType = MediaType.APPLICATION_JSON_PATCH_JSON,
                            examples = {
                                    @ExampleObject("[{op:remove, path:/a},{op:add, path: /b, value: val}]")
                            }))
            JsonPatch patch) {
        return patchInternal(uriInfo, securityContext, nurn, patch);
    }

    @DELETE
    @Path("/{id}")
    @Operation(
            operationId = "deleteGeo",
            summary = "Delete a geo by Id",
            description = "Delete a geo by `Id`.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK"),
                    @ApiResponse(responseCode = "404", description = "Geo for instance {id} is not found")
            })
    public Response delete(
            @Context UriInfo uriInfo,
            @Context SecurityContext securityContext,
            @Parameter(description = "Hard delete the entity. (Default = `false`)")
            @QueryParam("hardDelete")
            @DefaultValue("false")
            boolean hardDelete,
            @Parameter(description = "Id of the geo", schema = @Schema(type = "UUID")) @PathParam("id")
            UUID id) {
        return delete(uriInfo, securityContext, id, true, hardDelete);
    }

    @DELETE
    @Path("/nurn/{nurn}")
    @Operation(
            operationId = "deleteGeoByNuRN",
            summary = "Delete a geo by NuRN",
            description = "Delete a geo by `NuRN`.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "OK"),
                    @ApiResponse(responseCode = "404", description = "Geo for instance {nurn} is not found")
            })
    public Response delete(
            @Context UriInfo uriInfo,
            @Context SecurityContext securityContext,
            @Parameter(description = "Hard delete the entity. (Default = `false`)")
            @QueryParam("hardDelete")
            @DefaultValue("false")
            boolean hardDelete,
            @Parameter(description = "NuRN of the geo", schema = @Schema(type = "string"))
            @PathParam("nurn")
            String nurn) {
        return deleteByName(
                uriInfo, securityContext, EntityInterfaceUtil.quoteName(nurn), true, hardDelete);
    }
}
