---
layout: default
title: Users and Roles
parent: Security - Access Control
nav_order: 1
---

# Users and roles

The Security plugin includes an internal user database. Use this database in place of or in addition to an external authentication system such as LDAP or Active Directory.

Roles are the core way of controlling access to your cluster. Roles contain any combination of cluster-wide permissions, index-specific permissions, document- and field-level security, and tenants. Then you map users to these roles so that users gain those permissions.

Unless you need to create new [read-only or hidden users](../api/#read-only-and-hidden-resources), we **highly** recommend using Kibana or the REST API to create new users, roles, and role mappings. The `.yml` files are for initial setup, not ongoing use.
{: .warning }

---

#### Table of contents
1. TOC
{:toc}


---

## Create users

You can create users using Kibana, `internal_users.yml`, or the REST API.

### Kibana

1. Choose **Security**, **Internal User Database**, and **Add a new internal user**.
1. Provide a username and password. The Security plugin automatically hashes the password and stores it in the `.opendistro_security` index.
1. If desired, specify backend roles and attributes.

   Backend roles differ from security roles. Backend roles are external roles that come from an external authentication system (e.g. LDAP/Active Directory). If you aren't using an external system, you can ignore backend roles.

   Attributes are optional user properties that you can use for variable substitution in index permissions or document-level security.

1. Choose **Submit**.


### internal_users.yml

See [YAML files](../../security-configuration/yaml/#internal_usersyml).


### REST API

See [Create user](../api/#create-user).


## Create roles

Just like users, you can create roles using Kibana, `roles.yml`, or the REST API.


### Kibana

1. Choose **Security**, **Roles**, and **Add a new role**.
1. Provide a name for the role.
1. Then add

   For example, you might give a role no cluster permissions, `READ` permissions to two indices, `UNLIMITED` permissions to a third index, and read permissions to the `analysts` tenant.

1. Choose **Submit**.


### roles.yml

See [YAML files](../../security-configuration/yaml/#rolesyml).


### REST API

See [Create role](../api/#create-role).


## Map users to roles

After creating roles, you map users (or backend roles) to them. Intuitively, people often think of this process as giving a user one or more roles, but in the Security plugin, the process is reversed; you select a role and then map one or more users to it.

Just like users and roles, you create role mappings using Kibana, `roles_mapping.yml`, or the REST API.


### Kibana

1. Choose **Security**, **Role Mappings**, and **Add a new role mapping**.
1. Select the role. If a role is greyed-out, a mapping for it already exists. Return to the **Role Mappings** screen and edit the existing mapping.
1. Specify users, backend roles (roles from from LDAP or Active Directory), and hosts (e.g. `*.devops.my-organization.org`) as desired.
1. Choose **Submit**.


### roles_mapping.yml

See [YAML files](../../security-configuration/yaml/#roles_mappingyml).


### REST API

See [Create role mapping](../api/#create-role-mapping).
