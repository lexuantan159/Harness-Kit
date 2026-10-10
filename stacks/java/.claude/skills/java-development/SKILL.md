---
name: java-development
description: Java / Spring Boot conventions - project layout, Maven/Gradle wrapper, layering, JPA, validation, testing with JUnit 5 and Testcontainers. Use for any Java code change in this project.
---

# Java development

## Build
Always use the wrapper (`./mvnw` / `./gradlew`, `mvnw.cmd` on Windows) so the project's version is used.
Behind a corporate proxy, configure `~/.m2/settings.xml` / `gradle.properties`, never the repo.

## Code
- Target the project's Java version (check `maven.compiler.release` / toolchain). Use records for
  DTOs, `var` for obvious local types, `Optional` only as a return type, streams when clearer than loops.
- Spring: constructor injection (no field `@Autowired`), `@Transactional` on service methods,
  configuration via `@ConfigurationProperties`, controllers thin.
- JPA: avoid N+1 (fetch joins / entity graphs), `LAZY` by default, no entities in API responses,
  pagination with `Pageable`, Flyway/Liquibase for schema.
- Validation: `jakarta.validation` annotations on request DTOs + `@Valid`; central
  `@RestControllerAdvice` for error mapping.
- Logging: SLF4J with placeholders (`log.info("Order {} placed", id)`), no string concatenation,
  no personal data.
- Nulls: validate at boundaries; `Objects.requireNonNull` for invariants.

## Tests
- JUnit 5 + AssertJ; Mockito only at boundaries.
- `@WebMvcTest` / `@DataJpaTest` slices; `@SpringBootTest` + Testcontainers for integration.
- Run one test: `./mvnw -q test -Dtest=ClassName#method` / `./gradlew test --tests ClassName`.

## Pitfalls
Lombok `@Data` on entities (equals/hashCode on lazy relations), `LocalDateTime` for instants (use
`Instant`/`OffsetDateTime`), catching `Exception`, `@Transactional` on private methods or self-calls.
