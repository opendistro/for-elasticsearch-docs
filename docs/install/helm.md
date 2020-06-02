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
   cd opendistro-build/helm/opendistro-es/
   ```

1. Package the Helm chart:

   ```bash
   helm package .
   ```

1. Deploy Elasticsearch:

   ```bash
   helm install opendistro-es opendistro-es-1.8.0.tgz
   ```

If you see a `namespaces "default" is forbidden` error, create a Tiller service account and deploy with a cluster binding role, as shown in the following example. See the [Tiller documentation](https://tiller.readthedocs.io/en/latest/) for more information.


```bash
$ kubectl create serviceaccount --namespace kube-system tiller
$ kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
$ kubectl patch deploy --namespace kube-system tiller-deploy -p'{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
```


The output shows you the specifications instantiated from the install.
To customize the deployment, pass in the values that you want to override with a custom YAML file:

```bash
helm install --values=customevalues.yaml opendistro-es-1.8.0.tgz
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
opendistro-es-client-988fb9fbf-ph8fd    1/1     Running   0          111m
opendistro-es-client-988fb9fbf-xsz8n    1/1     Running   0          111m
opendistro-es-data-0                    1/1     Running   0          111m
opendistro-es-data-1                    1/1     Running   0          110m
opendistro-es-data-2                    1/1     Running   0          110m
opendistro-es-kibana-786f547486-75gw4   1/1     Running   0          111m
opendistro-es-master-0                  1/1     Running   0          111m
opendistro-es-master-1                  1/1     Running   0          106m
```

To access the Elasticsearch shell:

```bash
$ kubectl exec -it opendistro-es-master-1 -- /bin/bash
```

You can send requests to the pod to verify that Elasticsearch is up and running:

```bash
$ curl -XGET https://localhost:9200 -u admin:admin --insecure
```

To set up port forwarding to access Kibana, exit the Elasticsearch shell and run the following command:

```bash
$ kubectl port-forward deployment/opendistro-es-kibana 5601
```

You can now access Kibana from your browser at: http://localhost:5601.

## Uninstall using Helm

To delete or uninstall this deployment, run the following command:

```bash
helm delete opendistro-es
```
