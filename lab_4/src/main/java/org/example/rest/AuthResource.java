package org.example.rest;

import lombok.extern.java.Log;
import org.example.beans.AuthBean;
import org.example.exceptions.LoginException;
import org.example.exceptions.RefreshTokenException;
import org.example.exceptions.RegistrationException;
import org.example.models.LoginRequest;
import org.example.models.RefreshTokenRequest;
import org.example.models.RegistrationRequest;
import org.example.models.Tokens;
import org.example.models.Error;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Log
@Stateless
@Path("/auth")
public class AuthResource {
    @EJB
    private AuthBean authBean;

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest request) {
        try {
            log.info("/login");
            Tokens tokens = authBean.login(request);
            return Response.ok().entity(tokens).build();
        } catch (LoginException exception) {
            Error error = AuthResource.transform(exception);
            return Response.status(Response.Status.UNAUTHORIZED).entity(error).build();
        }
    }

    @POST
    @Path("/refresh")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response refreshToken(RefreshTokenRequest request) {
        try {
            log.info("/refresh");
            Tokens tokens = authBean.refreshToken(request);
            return Response.ok().entity(tokens).build();
        } catch (RefreshTokenException exception) {
            Error error = AuthResource.transform(exception);
            return Response.status(Response.Status.UNAUTHORIZED).entity(error).build();
        }
    }

    @POST
    @Path("/registration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registration(RegistrationRequest request) {
        try {
            log.info("/registration");
            authBean.registration(request);
            return Response.ok().build();
        } catch (RegistrationException exception) {
            Error error = AuthResource.transform(exception);
            return Response.status(Response.Status.UNAUTHORIZED).entity(error).build();
        }
    }

    private static Error transform(LoginException exception) {
        String code;
        switch (exception.getCode()) {
            case USER_NOT_FOUND:
                code = "LOGIN_USER_NOT_FOUND";
                break;
            case WRONG_PASSWORD:
                code = "LOGIN_WRONG_PASSWORD";
                break;
            default:
                code = "LOGIN_UNKNOWN";
                break;
        }

        return new Error(code, exception.getMessage());
    }

    private static Error transform(RegistrationException exception) {
        String code;
        switch (exception.getCode()) {
            case NOT_ENOUGH_DATA:
                code = "REGISTRATION_NOT_ENOUGH_DATA";
                break;
            case INVALID_DATA:
                code = "REGISTRATION_INVALID_DATA";
                break;
            case PASSWORDS_NOT_EQUAL:
                code = "REGISTRATION_PASSWORDS_NOT_EQUAL";
                break;
            case USER_ALREADY_EXIST:
                code = "REGISTRATION_USER_ALREADY_EXIST";
                break;
            default:
                code = "REGISTRATION_UNKNOWN";
                break;
        }
        return new Error(code, exception.getMessage());
    }

    private static Error transform(RefreshTokenException exception) {
        return new Error("REFRESH_COMMON", null);
    }
}
