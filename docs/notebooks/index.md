---
layout: default
title: Notebook
nav_order: 38
has_children: false
---

# Kibana Notebook

A Kibana notebook is an interface that lets you easily create and share live log data reports.
You can add visualization paragraphs for creating graphs and markdown paragraphs for writing descriptions.

Common use cases include creating postmortem reports, designing runbooks, building live infrastructure reports, and writing documentation.

![Notebook UI](../images/kibana-notebooks.gif)

## Get Started with Notebooks

To get started, choose **Kibana Notebooks** in Kibana.

### Step 1: Create a notebook

A notebook is an interface for creating reports.

1. Choose **Create notebook** and enter a descriptive name.
1. Choose **Create**.

Choose **Notebook actions** to rename, duplicate, or delete a notebook.

### Step 2: Add a paragraph

Paragraphs combine text and visualizations for describing data.

#### Add a markdown paragraph

1. To add text, choose **Add markdown paragraph**.
1. Add rich text with markdown syntax.

#### Add a visualization paragraph

1. To add a visualization, choose **Add Kibana visualization paragraph**.
1. In **Title**, select your visualization and choose a date range.
- You can choose multiple timelines to compare and contrast visualizations.
1. To resize a visualization, unpin the visualization and enter the edit mode. After you resize the visualization, choose **Save**.

To run and save a paragraph, choose **Run**.

You can perform the following actions on paragraphs:

- Add a new paragraph to the top of a report.
- Add a new paragraph to the bottom of a report.
- Run all the paragraphs at the same time.
- Clear the outputs of all paragraphs.
- Delete all the paragraphs.
- Move paragraphs up and down.
