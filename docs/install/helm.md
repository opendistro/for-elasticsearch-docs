---
layout: default
title: Helm
parent: Install and Configure
nav_order: 4
---

# Helm

Helm is a package manager that allows you to easily install and manage Elasticsearch in a Kubernetes cluster. You can define your Elasticsearch configurations in a YAML file and use Helm to deploy your applications in a version-controlled and reproducible way.

The Helm chart contains the resources described in the following table.

Resource | Description
:--- | :---
`Chart.yaml` |  Information about the chart.
`values.yaml` |  Default configuration values for the chart.
`templates` |  Templates that combine with values to generate the Kubernetes manifest files.

The specification in the default Helm chart supports many standard use cases and setups. You can modify the default chart to configure your desired specifications and set Transport Layer Security (TLS) and role-based access control (RBAC).

For information about the default configuration, steps to configure security, and configurable parameters, see the
[README](https://github.com/opendistro-for-elasticsearch/opendistro-build/blob/main/helm/README.md).

The instructions here assume you have a Kubernetes cluster with Helm preinstalled. See the [Kubernetes documentation](https://kubernetes.io/docs/setup/) for steps to configure a Kubernetes cluster and the [Helm documentation](https://helm.sh/docs/intro/install/) to install Helm.
{: .note }

## Install using Helm

Open Distro is no longer being developed and exists only as an archive. Please visit [OpenSearch documentation](https://opensearch.org/docs/latest) to get started with OpenSearch.
{: .warning}

1. Clone the [opendistro-build](https://github.com/opendistro-for-elasticsearch/opendistro-build) repository:

   ```bash
   git clone https://github.com/opendistro-for-elasticsearch/opendistro-build
   ```

   You can use the release tag (e.g. `v1.7.0` or `v1.8.0`) to get the specific Open Distro version.

1. Change to the `opendistro-es` directory:

   ```bash
   cd opendistro-build/helm/opendistro-es/
   ```

1. Package the Helm chart:

   ```bash
   helm package .
   ```

1. Deploy Elasticsearch:

   ```bash
   helm install --generate-name opendistro-es-{{site.odfe_version}}.tgz
   ```

The output shows you the specifications instantiated from the install.
To customize the deployment, pass in the values that you want to override with a custom YAML file:

```bash
helm install --values=customvalues.yaml opendistro-es-{{site.odfe_version}}.tgz
```

#### Sample output

```yaml
NAME: opendistro-es
LAST DEPLOYED: Fri Jan 17 14:44:19 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

To make sure your Elasticsearch pod is up and running, run the following command:

```bash
$ kubectl get pods
NAME                                    READY   STATUS    RESTARTS   AGE
opendistro-es-client-988fb9fbf-ph8f     1/1     Running   0          3m30s
opendistro-es-data-0                    1/1     Running   0          3m30s
opendistro-es-kibana-786f547486-75gw4   1/1     Running   0          3m31s
opendistro-es-master-0                  1/1     Running   0          3m30s
```

To access the Elasticsearch shell:

```bash
$ kubectl exec -it opendistro-es-master-0 -- /bin/bash
```

You can send requests to the pod to verify that Elasticsearch is up and running:

```bash
$ curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
```

To set up port forwarding to access Kibana, exit the Elasticsearch shell and run the following command:

```bash
$ kubectl port-forward deployment/opendistro-es-kibana 5601
```

You can now access Kibana from your browser at: http://localhost:5601.

## Uninstall using Helm

To identify the opendistro-es deployment to be deleted:

```bash
helm list
```

To delete or uninstall this deployment, run the following command:

```bash
helm delete <opendistro-es deployment>
```
