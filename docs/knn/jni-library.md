---
layout: default
title: JNI Library
nav_order: 5
parent: k-NN
has_children: false
---

# JNI Library
In order to integrate nmslib's approximate k-NN functionality, which is implemented in C++, into the k-NN plugin, which is implemented in Java, we created a Java Native Interface library. Check out [this wiki](https://en.wikipedia.org/wiki/Java_Native_Interface) to learn more about JNI. This library allows the k-NN plugin to leverage nmslib's functionality.

## Artifacts
We build and distribute binary library artifacts with Opendistro for Elasticsearch. We build the library binary, RPM and DEB in [this GitHub action](https://github.com/opendistro-for-elasticsearch/k-NN/blob/master/.github/workflows/CD.yml). We use Centos 7 with g++ 4.8.5 to build the DEB, RPM and ZIP. Additionally, in order to provide as much general compatibility as possible, we compile the library without optimized instruction sets enabled. For users that want to get the most out of the library, they should build the library from source in their production environment, so that if their environment has optimized instruction sets, they take advantage of them. The documentation for this can be found [here](https://github.com/opendistro-for-elasticsearch/k-NN#jni-library-artifacts).
