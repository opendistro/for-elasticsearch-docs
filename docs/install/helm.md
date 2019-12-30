---
layout: default
title: Helm
parent: Install and Configure
nav_order: 5
---

# Helm

Helm is a package manager that allows you easily install and manage Elasticsearch in a Kubernetes cluster. You can define your Elasticsearch configurations in a YAML file and use Helm to deploy your applications in a version-controlled and reproducible way.

The Helm chart contains the following resources:

Resource | Description
:--- | :---
`Chart.yaml` |  Information about the chart.
`values.yaml` |  Default configuration values for the chart.
`templates` |  Templates that combine with values to generate the Kubernetes manifest files.

The specification in the default Helm chart caters to a number of standard use cases and setups. You can modify the default chart to configure your desired specifications and set Transport Layer Security (TLS) and role-based access control (RBAC).

For information about the default configuration, steps to configure security, and configurable parameters, see the
[README](https://github.com/opendistro-for-elasticsearch/community/tree/master/open-distro-elasticsearch-kubernetes/helm).

The instructions here assume you have a Kubernetes cluster with Helm preinstalled. See the [Kubernetes documentation](https://kubernetes.io/docs/setup/) for steps to configure a Kubernetes cluster and the [Helm documentation](https://helm.sh/docs/intro/install/) to install Helm.
Run the `helm init` command to make sure you also have the Tiller server installed. For more information about Tiller, see the [Tiller documentation](https://tiller.readthedocs.io/en/latest/).
{: .note }

## Install using Helm

1. Clone the [opendistro-build](https://github.com/opendistro-for-elasticsearch/opendistro-build) repository:

   ```bash
   git clone https://github.com/opendistro-for-elasticsearch/opendistro-build
   ```

1. Change to the `opendistro-es` directory:

   ```bash
   cd helm/opendistro-es/
   ```

1. Package the Helm chart:

   ```bash
   helm package .
   ```

1. Deploy Elasticsearch:

   ```bash
   helm install opendistro-es opendistro-es-1.3.0.tgz
   ```

If you see a `namespaces "default" is forbidden` error, create a tiller service account and deploy with a cluster binding role.
For example:

```bash
$ kubectl create serviceaccount --namespace kube-system tiller
$ kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
$ kubectl patch deploy --namespace kube-system tiller-deploy -p'{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
```
See the [Tiller documentation](https://tiller.readthedocs.io/en/latest/) for more information.

The output shows you the specifications instantiated from the install.
To customize the deployment, pass in the values that you want to override with a custom YAML file:

```bash
helm install --values=customevalues.yaml opendistro-es-1.3.0.tgz
```

#### Sample output

```yaml
NAME:   opendistro-es
LAST DEPLOYED: Tue Dec 17 14:33:48 2019
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod(related)
NAME                                   AGE
opendistro-es-client-77b988f547-ddbvc  1s
opendistro-es-client-77b988f547-gtgtx  1s
opendistro-es-data-0                   1s
opendistro-es-kibana-f785fdb84-8czxb   1s
opendistro-es-master-0                 1s

==> v1/RoleBinding
NAME                               AGE
opendistro-es-elastic-rolebinding  1s
opendistro-es-kibana-rolebinding   1s

==> v1/Secret
NAME                     AGE
opendistro-es-es-config  1s

==> v1/Service
NAME                          AGE
opendistro-es-client-service  1s
opendistro-es-data-svc        1s
opendistro-es-discovery       1s
opendistro-es-kibana-svc      1s

==> v1/ServiceAccount
NAME                  AGE
opendistro-es-es      1s
opendistro-es-kibana  1s

==> v1beta1/Deployment
NAME                  AGE
opendistro-es-client  1s
opendistro-es-kibana  1s

==> v1beta1/Ingress
NAME                          AGE
opendistro-es-client-service  1s

==> v1beta1/PodSecurityPolicy
NAME               AGE
opendistro-es-psp  1s

==> v1beta1/Role
NAME                  AGE
opendistro-es-es      1s
opendistro-es-kibana  1s

==> v1beta1/StatefulSet
NAME                  AGE
opendistro-es-data    1s
opendistro-es-master  1s
```

To make sure your Elasticsearch cluster is up and running:

```bash
$ kubectl get pods

NAME                                       READY   STATUS    RESTARTS   AGE
opendistro-es-13-client-5f87767448-6b6h6   1/1     Running   0          15m
opendistro-es-13-client-5f87767448-9rvrr   1/1     Running   0          15m
opendistro-es-data-0                       1/1     Running   0          15m
opendistro-es-kibana-54d4b996c6-g2rxb      1/1     Running   0          15m
opendistro-es-master-0                     1/1     Running   0          15m
```

## Uninstall using Helm

To delete or uninstall this deployment:

```bash
helm delete opendistro-es
```
