package org.example.rest.authFilter;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.security.Principal;

@Data
@AllArgsConstructor
public class UserPrincipal implements Principal {
    private Long id;
    private String name;
}
