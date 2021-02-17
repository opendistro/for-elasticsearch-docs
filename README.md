# Open Distro for Elasticsearch Documentation

This repository contains the documentation for Open Distro for Elasticsearch, a full-featured, open source distribution of Elasticsearch for analytics workloads. You can find the rendered documentation at [opendistro.github.io/for-elasticsearch-docs/](https://opendistro.github.io/for-elasticsearch-docs/).

Developer and community contributions remain essential in keeping this documentation comprehensive, useful, organized, and up-to-date.


## How you can help

- Do you work on one of the various ODFE plugins? Take a look at the documentation for the plugin. Is everything accurate? Will anything change in the near future?

  Often, engineering teams can keep existing documentation up-to-date with minimal effort, thus freeing up the documentation team to focus on larger projects.

- Do you have expertise in a particular area of Elasticsearch? Cluster sizing? The query DSL? Painless scripting? Aggregations? JVM settings? Take a look at the [current content](https://opendistro.github.io/for-elasticsearch-docs/docs/elasticsearch/) and see where you can add value. The [documentation team](#points-of-contact) is happy to help you polish and organize your drafts.

- Are you a Kibana expert? How did you set up your visualizations? Why is a particular dashboard so valuable to your organization? We have [literally nothing](https://opendistro.github.io/for-elasticsearch-docs/docs/kibana/) on how to use Kibana, only how to install it.

- Are you a web developer? Do you want to add an optional dark mode to the documentation? A "copy to clipboard" button for our code samples? Other improvements to the design or usability? See [major changes](#major-changes) for information on building the website locally.

- Our [issue tracker](https://github.com/opendistro/for-elasticsearch-docs/issues) contains documentation bugs and other content gaps, some of which have colorful labels like "good first issue" and "help wanted."


## Points of contact

If you encounter problems or have questions when contributing to the documentation, these people can help:

- [aetter](https://github.com/aetter)
- [ashwinkumar12345](https://github.com/ashwinkumar12345)
- [keithhc2](https://github.com/keithhc2)


## How we build the website

After each commit to this repository, GitHub Pages automatically uses [Jekyll](https://jekyllrb.com) to rebuild the [website](https://opendistro.github.io/for-elasticsearch-docs/). The whole process takes around 20 seconds.

This repository contains many [Markdown](https://guides.github.com/features/mastering-markdown/) files in the `/docs` directory. Each Markdown file correlates with one page on the website. For example, the Markdown file for [this page](https://opendistro.github.io/for-elasticsearch-docs/docs/elasticsearch/) is [here](https://github.com/opendistro/for-elasticsearch-docs/blob/master/docs/elasticsearch/index.md).

Using plain text on GitHub has many advantages:

- Everything is free, open source, and works on every operating system. Use your favorite text editor, Ruby, Jekyll, and Git.
- Markdown is easy to learn and looks good in side-by-side diffs.
- The workflow is no different than contributing code. Make your changes, build locally to check your work, and submit a pull request. Reviewers check the PR before merging.
- Alternatives like wikis and WordPress are full web applications that require databases and ongoing maintenance. They also have inferior versioning and content review processes compared to Git. Static websites, such as the ones Jekyll produces, are faster, more secure, and more stable.

In addition to the content for a given page, each Markdown file contains some Jekyll [front matter](https://jekyllrb.com/docs/front-matter/). Front matter looks like this:

```
---
layout: default
title: Alerting Security
nav_order: 10
parent: Alerting
has_children: false
---
```

If you're making [trivial changes](#trivial-changes), you don't have to worry about front matter.

If you want to reorganize content or add new pages, keep an eye on `has_children`, `parent`, and `nav_order`, which define the hierarchy and order of pages in the lefthand navigation. For more information, see the documentation for [our upstream Jekyll theme](https://pmarsceill.github.io/just-the-docs/docs/navigation-structure/).


## Contribute content

There are three ways to contribute content, depending on the magnitude of the change.

- [Trivial changes](#trivial-changes)
- [Minor changes](#minor-changes)
- [Major changes](#major-changes)


### Trivial changes

If you just need to fix a typo or add a sentence, this method works well:

1. In your web browser, navigate to the appropriate Markdown file. For example, [cluster.md](https://github.com/opendistro/for-elasticsearch-docs/blob/master/docs/elasticsearch/cluster.md).

1. Click the **Edit this file** button (the pencil).

1. Make your changes.

1. Choose **Create a new branch for this commit and start a pull request** and **Commit changes**.


### Minor changes

If you want to add a few paragraphs across multiple files and are comfortable with Git, try this approach:

1. Fork this repository.

1. Download [GitHub Desktop](https://desktop.github.com), install it, and clone your fork.

1. Navigate to the repository root.

1. Create a new branch.

1. Edit the Markdown files in `/docs`.

1. Commit, push your changes to your fork, and submit a pull request.


### Major changes

If you're making major changes to the documentation and need to see the rendered HTML before submitting a pull request, here's how to build locally:

1. Fork this repository.

1. Download [GitHub Desktop](https://desktop.github.com), install it, and clone your fork.

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
   sh build.sh
   ```

1. If the build script doesn't automatically open your web browser (it should), open [http://localhost:4000/for-elasticsearch-docs/](http://localhost:4000/for-elasticsearch-docs/).

1. Create a new branch.

1. Edit the Markdown files in `/docs`.

   If you're a web developer, you can customize `_layouts/default.html` and `_sass/custom/custom.scss`.

1. When you save a file, marvel as Jekyll automatically rebuilds the site and refreshes your web browser. This process takes roughly 20 seconds.

1. When you're happy with how everything looks, commit, push your changes to your fork, and submit a pull request.


## Writing tips

1. Try to stay consistent with existing content and consistent within your new content. Don't call the same plugin KNN, k-nn, and k-NN in three different places.

1. Shorter paragraphs are better than longer paragraphs. Use headers, tables, lists, and images to make your content easier for readers to scan.

1. Use **bold** for user interface elements, *italics* for key terms or emphasis, and `monospace` for Bash commands, file names, REST paths, and code.

1. Markdown file names should be all lowercase, use hyphens to separate words, and end in `.md`.

1. Don't use future tense. Use present tense.

   **Bad**: After you click the button, the process will start.

   **Better**: After you click the button, the process starts.

1. "You" refers to the person reading the page. "We" refers to the ODFE contributors.

   **Bad**: Now that we've finished the configuration, we have a working cluster.

   **Better**: At this point, you have a working cluster, but we recommend adding dedicated master nodes.

1. Don't use "this" and "that" to refer to something without adding a noun.

   **Bad**: This can cause high latencies.

   **Better**: This additional loading time can cause high latencies.

1. Use active voice.

   **Bad**: After the request is sent, the data is added to the index.

   **Better**: After you send the request, the Elasticsearch cluster indexes the data.

1. Introduce acronyms before using them.

   **Bad**: Reducing customer TTV should accelerate our ROIC.

   **Better**: Reducing customer time to value (TTV) should accelerate our return on invested capital (ROIC).

1. Spell out one through nine. Start using numerals at 10. If a number needs a unit (GB, pounds, millimeters, kg, celsius, etc.), use numerals, even if the number if smaller than 10.

   **Bad**: 3 kids looked for thirteen files on a six GB hard drive.

   **Better**: Three kids looked for 13 files on a 6 GB hard drive.


## New releases

1. Branch.
1. Change the `odfe_version` and `es_version` variables in `_config.yml`.
1. Start up a new cluster using the updated Docker Compose file in `docs/install/docker.md`.
1. Update the version table in `version-history.md`.

   Use `curl -XGET https://localhost:9200 -u admin:admin -k` to verify the Elasticsearch version.

1. Update the plugin compatibility table in `docs/install/plugin.md` and `docs/kibana/plugins.md`.

   Use `curl -XGET https://localhost:9200/_cat/plugins -u admin:admin -k` to get the correct version strings.

1. Run a build (`build.sh`), and look for any warnings or errors you introduced.
1. Verify that the individual plugin download links in `docs/install/plugins.md` and `docs/kibana/plugins.md` work.
1. Check for any other bad links (`check-links.sh`). Expect a few false positives for the `localhost` links.
1. Submit a PR.


## Classes within Markdown

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


## Math

If you want to use the sorts of pretty formulas that [MathJax](https://www.mathjax.org) allows, add `has_math: true` to the Jekyll page metadata. Then insert LaTeX math into HTML tags with the rest of your Markdown content:

```
## Math

Some Markdown paragraph. Here's a formula:

<p>
  When \(a \ne 0\), there are two solutions to \(ax^2 + bx + c = 0\) and they are
  \[x = {-b \pm \sqrt{b^2-4ac} \over 2a}.\]
</p>

And back to Markdown.
```


## Code of conduct

This project has adopted an [Open Source Code of Conduct](https://opendistro.github.io/for-elasticsearch/codeofconduct.html).


## Security issue notifications

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public GitHub issue.


## Licensing

See the [LICENSE](./LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.


## Copyright

Copyright Amazon.com, Inc. or its affiliates. All rights reserved.
