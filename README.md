# diplomacy

```bash
docker-compose -f ./docker-compose.yaml up -d
curl http://localhost:8080/ping
```

---

Structure of application is partially taken from [here](https://github.com/golang-standards/project-layout)

: /internal
Private application and library code. This is the code you don't want others importing in their applications or libraries. Note that this layout pattern is enforced by the Go compiler itself. 

: /api
OpenAPI/Swagger specs, JSON schema files, protocol definition files.

: /web
Web application specific components: static web assets, server side templates and SPAs.

: /test
Unit tests.