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
1. Then add permissions as desired.

   For example, you might give a role no cluster permissions, `read` permissions to two indices, `unlimited` permissions to a third index, and read permissions to the `analysts` tenant.

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


## Predefined roles

The Security plugin includes several predefined roles that serve as useful defaults.

Role | Description
:--- | :---
`all_access` | Grants full access to the cluster: all cluster-wide operations, write to all indices, write to all tenants.
`kibana_read_only` | A special role that prevents users from making changes to visualizations, dashboards, and other Kibana objects. See `opendistro_security.readonly_mode.roles` in `kibana.yml`. Pair with the `kibana_user` role.
`kibana_user` | Grants permissions to use Kibana: cluster-wide searches, index monitoring, and write to various Kibana indices.
`logstash` | Grants permissions for Logstash to interact with the cluster: cluster-wide searches, cluster monitoring, and write to the various Logstash indices.
`manage_snapshots` | Grants permissions to manage snapshot repositories, take snapshots, and restore snapshots.
`readall` | Grants permissions for cluster-wide searches like `msearch` and search permissions for all indices.
`readall_and_monitor` | Same as `readall`, but with added cluster monitoring permissions.
`security_rest_api_access` | A special role that allows access to the REST API. See `opendistro_security.restapi.roles_enabled` in `elasticsearch.yml` and [Access control for the API](../api/#access-control-for-the-api).

For more detailed summaries of the permissions for each role, reference their action groups against the descriptions in [Default action groups](../default-action-groups/).

## Sample roles

The following examples show how you might set up a read-only and a bulk access role.

### Set up a read-only role in Kibana

Create a new `read_only_index` role:

1. Open **Kibana**.
1. Choose **Security**, **Roles**.
1. Choose the *+* button, enter a role name `read_only_index`.
1. Choose the **Cluster Permissions** tab, select **Add Action Group**.
1. In **Permissions: Action Groups**, select `cluster_composite_ops_ro` and choose **Add Action Group**.
1. Choose the **Index Permissions** tab, select **Add index permissions** and add your index pattern `my-index-*`.
1. In **Permissions: Action Groups**, choose **Add Action Group** and select `read`.
1. Choose **Save Role Definition**.

Map `kibana_user` and `kibana_read_only` roles to the `read_only_index` role:

1. Choose **Security**, **Role Mappings**.
1. Next to `kibana_user`, choose the **Edit** button.
- If you don't already have a `kibana_user` role, choose the *+* button and create the role.
1. In the **Users** field, add your `read_only_index` role and choose **Submit**.
1. Next to `kibana_read_only`, choose the **Edit** button.
- If you don't already have a `kibana_read_only` role, choose the *+* button and create the role.
1. In the **Users** field, add your `read_only_index` role and choose **Submit**.

Create a new tenant and grant role access:

1. Choose **Security**, **Tenants**, enter your desired name.
1. Choose the *+* button, enter your desired tenant name.
1. Choose **Submit**.
1. Choose **Security**, **Roles**.
1. Next to the `read_only_index` role, choose **Edit**.
1. Choose the **Tenants Permissions** tab, in **Permissions**, select `kibana_all_read`.
1. Add a tenant pattern to select all required tenants.
1. Choose **Save Role Definition**.
1. For the global tenant, make sure the permission is set to `kibana_all_read`.

### Set up a bulk access role in Kibana

Create a new `bulk_access` role:

1. Open **Kibana**.
1. Choose **Security**, **Roles**.
1. Choose the *+* button, enter a role name `bulk_access`.
1. Choose the **Cluster Permissions** tab, select **Add Action Group**.
1. In **Permissions: Action Groups**, select `cluster_composite_ops` and choose **Add Action Group**.
1. Choose the **Index Permissions** tab, select **Add index permissions** and your index patterns `my-index-*`.
1. In **Permissions: Action Groups**, choose **Add Action Group** and select `write`.
1. Choose **Save Role Definition**.

Map bulk access permissions to the `bulk_access` role:

1. Choose **Security**, **Role Mappings**.
1. Choose the *+* button, select the `bulk_access` role.
1. In **Users**, choose **Add User** and add your `bulk_access` user.
1. Choose **Submit**.
