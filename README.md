# Open Distro for Elasticsearch Documentation

This repository contains the documentation for Open Distro for Elasticsearch, a full-featured, open source distribution of Elasticsearch for analytics workloads. You can find the rendered documentation at [opendistro.github.io/for-elasticsearch-docs/](https://opendistro.github.io/for-elasticsearch-docs/).


## Build

1. Navigate to the repository root.

1. Install [Ruby](https://www.ruby-lang.org/en/) if you don't already have it. We recommend [RVM](https://rvm.io/), but use whatever method you prefer:

   ```
   curl -sSL https://get.rvm.io | bash -s stable
   rvm install 2.6
   ruby -v
   ```

1. Install [Jekyll](https://jekyllrb.com/) if you don't already have it:

   ```
   gem install bundler jekyll
   ```

1. Install dependencies:

   ```
   bundle install
   ```

1. Build:

   ```
   bundle exec jekyll serve
   ```

   Alternately, run `build.sh`, which includes some convenience flags and is faster to type.

   You'll probably receive a couple `Invalid theme folder: _sass` warnings from Jekyll. You can safely ignore them.

1. Open [http://localhost:4000/for-elasticsearch-docs/](http://localhost:4000/for-elasticsearch-docs/).


## Contribute

1. Fork this repository.
1. Clone your fork.
1. Edit the Markdown files in `/docs`.
1. Use Jekyll to build the content, and make sure your changes render the way you expect.
1. Push your changes, and submit a pull request.


## Content guidelines

1. Try to stay consistent with existing content.
1. Introduce acronyms before using them.
1. Use **bold** for user interface elements, *italics* for key terms or emphasis, and `monospace` for Bash commands, file names, URIs, and code.
1. Markdown file names should be all lowercase, use hyphens to separate words, and end in `.md`.


## Markdown guidelines

This documentation uses a modified version of the [just-the-docs](https://github.com/pmarsceill/just-the-docs) Jekyll theme, which has some useful classes for labels and buttons:

```
[Get started](#get-started){: .btn .btn-blue }

## Get started
New
{: .label .label-green :}
```

* Labels come in default (blue), green, purple, yellow, and red.
* Buttons come in default, purple, blue, green, and outline.
* Warning, tip, and note blocks are available (`{: .warning }`, etc.).
* If an image has a white background, you can use `{: .img-border }` to add a one pixel border to the image.

These classes can help with readability, but should be used *sparingly*. Each addition of a class damages the portability of the Markdown files and makes moving to a different Jekyll theme (or a different static site generator) more difficult.

Besides, standard Markdown elements suffice for most documentation.

To create an auto-generated table of contents near the top of long pages, use the following snippet:

```
#### Table of contents
1. TOC
{:toc}
```

By design, only `h2` and `h3` headers are included.

If you create a new directory, name its first file `index.md` and make it a parent so that the links stay pretty:

```
---
layout: default
title: Some New Page
nav_order: 4
has_children: true
has_toc: false
---
```


## Code of conduct

This project has adopted an [Open Source Code of Conduct](https://opendistro.github.io/for-elasticsearch/codeofconduct.html).


## Security issue notifications

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public GitHub issue.


## Licensing

See the [LICENSE](./LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.


## Copyright

Copyright 2019 Amazon.com, Inc. or its affiliates. All rights reserved.
