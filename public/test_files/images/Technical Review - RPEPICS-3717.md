# Technical Review - RPEPICS-3717

## Description

### Credential (model)

The model [Credential](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts) will be moved from `redpoints-model-js` to `dms-model-js`.

Besides, the property [`domain`](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts#23) of [Credential](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts) model will be removed.

### CredentialType (model)

The model [CredentialType](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/CredentialType.ts) will be moved from `redpoints-model-js` to `dms-model-js`.

### DomainCredentialController

Instead of using the [DomainCredentialsController.listDomainCredentials](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/domain/DomainCredentialsController.ts#29) we should use the [EnforcementEntityCredentialsController.listEnforcementEntityCredentials](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/enforcemententity/EnforcementEntityCredentialsController.ts#27).

In order to make the call, we need the `enforcementEntityId`. We should use the `domainId`.

This is used in the [Domains screen](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-front-domains/browse/src/modules/DomainDetails/pages/DomainDetails/sections/Credentials/Credentials.jsx#22).

### DomainCredentialTypeController

Instead of using the [DomainCredentialTypeController.list](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/domain/DomainCredentialTypeController.ts) we should use the [EnforcementEntityCredentialTypeController.list](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/enforcemententity/EnforcementEntityCredentialTypeController.ts#15).

In order to make the call, we need the `enforcementEntityId`. We should use the `domainId`.

This is used in the [Domains screen](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-front-domains/browse/src/modules/DomainDetails/pages/DomainDetails/sections/Credentials/Credentials.jsx#23).

## Steps

We should avoid making a Breaking Change. Then:

- **1st. Move the models**:
  - The [Credential](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts) model will be moved from `redpoints-model-js` to `dms-model-js` **without changes**.
  - The [CredentialType](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/CredentialType.ts) model will be moved from `redpoints-model-js` to `dms-model-js`.

- **2nd. Update Controllers in order to use the models of DMS**:
  - The [EnforcementEntityCredentialsController.listEnforcementEntityCredentials](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/enforcemententity/EnforcementEntityCredentialsController.ts#6) should use the [Credential](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts) of DMS.
  - The [EnforcementEntityCredentialTypeController.list](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/enforcemententity/EnforcementEntityCredentialTypeController.ts#1) should use the [CredentialType](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/CredentialType.ts) of DMS.

- **3rd. Adapt Domains screen**:
  - Domains screen should use [EnforcementEntityCredentialsController.listEnforcementEntityCredentials](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/enforcemententity/EnforcementEntityCredentialsController.ts). See this [line](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-front-domains/browse/src/modules/DomainDetails/pages/DomainDetails/sections/Credentials/Credentials.jsx#22). In order to fill `enforcementEntityId` we will use `domainId`.
  - Domains screen should use [EnforcementEntityCredentialTypeController.list](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/enforcemententity/EnforcementEntityCredentialTypeController.ts). See this [line](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-front-domains/browse/src/modules/DomainDetails/pages/DomainDetails/sections/Credentials/Credentials.jsx#23). In order to fill `enforcementEntityId` we will use `domainId`.
  - We should remove the `domain` property of the [Credential](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts) model. See this [line](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-front-domains/browse/src/modules/DomainDetails/pages/DomainDetails/sections/Credentials/Credentials.jsx#90).

- **4rd. Remove old unused connectors**
  - Remove unused connector [DomainCredentialsController.listDomainCredentials](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/domain/DomainCredentialsController.ts).
  - Remove unused connector [DomainCredentialTypeController.list](https://bitbucket.rdpnts.com/projects/RPCSUITE/repos/dms-restapi-connector/browse/src/controller/domain/DomainCredentialTypeController.ts).

- **5rd. Adapt models**
  - Remove unused model [Credential](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts) of `redpoints-model-js`.
  - Remove unused model [CredentialType](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/CredentialType.ts) of `redpoints-model-js`.
  - Remove the property [`domain`](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts#23) of [Credential](https://bitbucket.rdpnts.com/projects/RPBO/repos/redpoints-model-js/browse/src/model/asset/Credential.ts) model of `dms-model-js`.
