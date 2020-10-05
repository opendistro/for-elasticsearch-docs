---
layout: default
title: Notebooks
parent: Kibana
nav_order: 2
---

# Notebooks

Kibana Notebooks is a Jupyter Notebook-like user interface that lets you run code interactively in the browser with visualizations and markdown text  to explain the process.

Kibana Notebooks allows you to run Jupyter notebooks in Kibana with very little setup.

Kibana notebooks is a web-based notebook that enables data-driven, interactive data analytics and collaborative documents with DSL and SQL.

Kibana notebooks is a web-based notebook which brings data exploration, visualization, sharing and collaboration features to Elasticsearch.

Zeppelin provides the following benefits for your data engineering and data science use cases:

An interactive development environment for writing, testing, and sharing data processing code snippets
The ability to run the notebooks in a local client environment, such as on a laptop
Support for a variety of interpreters for integrating with different backend components
Support for extensible visualization libraries

It provides an environment for notebook documents that contain live code you can run and immediately look at the output and visualize the data without ever leaving the notebook.

This makes it a handy tool for end-to-end monitoring.

With Kibana Notebooks you can examine data, create reports, document what you're thinking and what steps you've taken and you can do all this in DSL or SQL. Write code in DSL or SQL and text in markdown in a cell and when you run the cell, it will execute the code and render markdown.
The notebook is interactive, you can change the code and see what changed in the graph in real time. Notebook supports DSL and SQL. You can also share your notebooks, they can't interact with it but they can load it up and see the notebook. It's designed to work with log data.

It's a great platform for you share what you think and what you're thinking about as you analyzed log data. and get their point across to others.

to create and share stories that have on-the-go coding and execution, embed visualizations and graphs with contextual explanations in markdown, and multi-timeline support to compare and contrast visualizations.

supports markdown, SQL and DSL.Backend Adaptor: An add-on to the existing default backend that provides additional interpreters and storage options.
For example: Apache Zeppelin backend service supports files, Git, Amazon S3, mongo and other storage options.

Apache Zeppelin is the answer of the Apache Foundation to Jupyter notebooks.

notebook that you can use to run queries and code.
the contents of an EMR notebook itself—the equations, queries, models, code, and narrative text within notebook cells—run in a client.

to prepare and visualize data, collaborate with peers, build applications, and perform interactive analysis

EMR Notebooks is a Jupyter Notebook environment built in to the Amazon EMR console that allows you to quickly create Jupyter notebooks, attach them to Spark clusters, and then open the Jupyter Notebook editor in the console to remotely run queries and code.

EMR Notebooks is designed to make it easy for you to experiment and build applications with Apache Spark.

Creating a Notebook

To create an EMR notebook

Open the Amazon EMR console at https://console.aws.amazon.com/elasticmapreduce/.

Choose Notebooks, Create notebook.

Enter a Notebook name and an optional Notebook description.

If you have an active cluster running Hadoop, Spark, and Livy to which you want to attach the notebook, leave the default Choose an existing cluster selected, click Choose, select a cluster from the list, and then click Choose cluster. Only clusters that meet the requirements appear. For more information, see Considerations When Using EMR Notebooks.

In a notebook, you can inject some data, execute snippets of code to perform analysis on the data, and then visualize it.

Accessing and Creating Notebooks in Kibana.
Sharing Kibana Notebook Content

![Notebook UI](../../images/kibana-notebooks.gif)

Notebook Functionalities

![notebook buttons](../../images/notebook-buttons.png)

- Create Notebook - creates a new notebook document
- Rename Notebook - renames the current notebook with new name
- Clone Notebook - clones the current notebook and gives the name <currentNotebook_copy>
- Delete Notebook - deletes the current notebook
- Import Notebook - imports a notebook json file
- Export Notebook - exports the current notebook as a json file

Paragraph Functionalities

![notebook buttons](../../images/paragraph-buttons.png)

Please select a paragraph before using these buttons
{: .note }

- Run Paragraph - Runs the selected paragraph and saves it
- Save Paragraph - Saves the input of selected paragraph/visualization
- Clone Paragraph - Clones the selected paragraph
- Delete Paragraph - Deletes the selected paragraph
- Clear All Paragraph - Clears the output of all the paragraphs
- Hide Inputs - Hides the input cells of all the paragraphs
- Hide Outputs - Hides the output cells of all the paragraphs

Miscellaneous

- Adding a paragraph - Hover between paragraphs to add a new para/visualization
- Editing Visualization Timeline - Edit timeframes in datepicker to add "from" and "to" time range, then refresh the visualization
- Resize Visualizations - To resize a visualization, unpin the visualization to enter the edit mode, once resized pin the visualization and save it with save button on top

## Import Example Notebooks

Import sample notebooks from [example_notebooks](https://github.com/opendistro-for-elasticsearch/kibana-notebooks/tree/dev/example_notebooks)  folder based on your backend.
A notebook from one backend is incompatible to the other

## Kibana Notebooks REST APIs

NOTE: The Notebook/Paragraph structure used in body & responses, are with Zeppelin Backend Adaptor. The structure of noteboook and paragraph changes with change in backend, but format of request body and response body remains the same.

Notebook Examples

- Default Notebook

```json
```

1. Fetch all the notebooks available → returns a list of notebook id and paths

```json
GET api/notebooks/

RESPONSE BODY
{
  "data": [
    {
      "id": "2FF3GW3H8",
      "path": "/Embed Viz"
    },
    {
      "id": "2FHEP953H",
      "path": "/Log Analysis"
    },
    {
      "id": "2FES7PY77",
      "path": "/Post-mortem Report"
    },
    {
      "id": "2FFAMT6VV",
      "path": "/test 1"
    }
  ]
}
```

1. Get all paragraphs of a notebook → returns list of paragraphs

```json
GET api/notebooks/note/<noteId>

RESPONSE BODY // list of Paragraphs

{
  "paragraphs": [
    {
      "text": "%md\n# This is markdown test",
      "user": "anonymous",
      "dateUpdated": "Aug 11, 2020 8:24:38 AM",
      "config": {
        "tableHide": true,
        "editorSetting": {
          "language": "markdown",
          "editOnDblClick": true,
          "completionSupport": false
        },
        "colWidth": 12,
        "editorMode": "ace/mode/markdown",
        "fontSize": 9,
        "editorHide": false,
        "results": {},
        "enabled": true
      },
      "settings": {
        "params": {},
        "forms": {}
      },
      "results": {
        "code": "SUCCESS",
        "msg": [
          {
            "type": "HTML",
            "data": "<div class=\"markdown-body\">\n<h1>This is markdown test</h1>\n\n</div>"
          }
        ]
      },
      "apps": [],
      "runtimeInfos": {},
      "progressUpdateIntervalMs": 500,
      "jobName": "paragraph_1597133766113_507090317",
      "id": "paragraph_1597101740623_82179823",
      "dateCreated": "Aug 11, 2020 8:16:06 AM",
      "dateStarted": "Aug 11, 2020 8:24:38 AM",
      "dateFinished": "Aug 11, 2020 8:24:38 AM",
      "status": "FINISHED"
    },
    {
      "title": "Paragraph inserted",
      "text": "%md\n# markdown cell number 2 ",
      "user": "anonymous",
      "dateUpdated": "Aug 11, 2020 8:24:32 AM",
      "config": {},
      "settings": {
        "params": {},
        "forms": {}
      },
      "results": {
        "code": "SUCCESS",
        "msg": [
          {
            "type": "HTML",
            "data": "<div class=\"markdown-body\">\n<h1>markdown cell number 2</h1>\n\n</div>"
          }
        ]
      },
      "apps": [],
      "runtimeInfos": {},
      "progressUpdateIntervalMs": 500,
      "jobName": "paragraph_1597134223413_576247989",
      "id": "paragraph_1597134223413_576247989",
      "dateCreated": "Aug 11, 2020 8:23:43 AM",
      "dateStarted": "Aug 11, 2020 8:24:32 AM",
      "dateFinished": "Aug 11, 2020 8:24:32 AM",
      "status": "FINISHED"
    }
  ]
}
```

3. Add a Notebook → returns new notebook id

```json
POST api/notebooks/note

REQUEST BODY
{"name": "Demo Notebook"} // new name

RESPONSE BODY
{
    "status": "OK",
    "message": "",
    "body": "2FG6FWGY5"
}
```

4. Rename a Notebook → returns acknowledgement

```json
PUT api/notebooks/note/rename

REQUEST BODY
{
    "noteId": "2FG6FWGY5",
    "name":"Demo 1",
}

RESPONSE BODY
{
    "status": "OK",
    "message": ""
}

```

5. Clone a Notebook → returns new notebook id

```json
POST api/notebooks/note/clone

REQUEST BODY
{
 "noteId": "2FG6FWGY5",
 "name":"Demo 1_copy",
 }

RESPONSE BODY
{
    "status": "OK",
    "message": "",
    "body": "2FFAG7HAQ"
}

```

6. Delete a Notebook → returns acknowledgement

```json
DELETE api/notebooks/note/<noteid>

RESPONSE BODY
{
    "status": "OK",
    "message": ""
}
```

7. Import a Notebook → returns new notebooks Id

```json
POST api/notebooks/note/import

REQUEST BODY

{
  "noteObj": {
    "angularObjects": {},
    "config": {
      "isZeppelinNotebookCronEnable": false
    },
    "defaultInterpreterGroup": "md",
    "id": "2FH5EF6QF",
    "info": {},
    "name": "test 1",
    "noteForms": {},
    "noteParams": {},
    "paragraphs": [
      {
        "apps": [],
        "config": {
          "colWidth": 12,
          "editorHide": false,
          "editorMode": "ace/mode/markdown",
          "editorSetting": {
            "completionSupport": false,
            "editOnDblClick": true,
            "language": "markdown"
          },
          "enabled": true,
          "fontSize": 9,
          "results": {},
          "tableHide": true
        },
        "dateCreated": "2020-08-10 23:22:20.623",
        "dateFinished": "2020-08-11 08:15:21.175",
        "dateStarted": "2020-08-11 08:15:21.150",
        "dateUpdated": "2020-08-11 08:15:21.140",
        "id": "paragraph_1597101740623_82179823",
        "jobName": "paragraph_1597101740623_82179823",
        "progressUpdateIntervalMs": 500,
        "results": {
          "code": "SUCCESS",
          "msg": [
            {
              "data": "<div class=\"markdown-body\">\n<h1>This is markdown test</h1>\n\n</div>",
              "type": "HTML"
            }
          ]
        },
        "runtimeInfos": {},
        "settings": {
          "forms": {},
          "params": {}
        },
        "status": "FINISHED",
        "text": "# This is markdown test",
        "user": "anonymous"
      }
    ],
    "version": "0.9.0-SNAPSHOT"
  }
}

RESPONSE BODY
{
    "status": "OK",
    "message": "",
    "body": "2FF38BHBY"
}
```

8. Export a Notebook → Returns a notebooks object

```json
GET api/notebooks/note/export/<noteid>

RESPONSE BODY

{
  "paragraphs": [
    {
      "text": "# This is markdown test",
      "user": "anonymous",
      "dateUpdated": "2020-08-11 17:08:24.063",
      "config": {
        "tableHide": true,
        "editorSetting": {
          "completionSupport": false,
          "editOnDblClick": true,
          "language": "markdown"
        },
        "colWidth": 12,
        "editorMode": "ace/mode/markdown",
        "editorHide": false,
        "fontSize": 9,
        "results": {},
        "enabled": true
      },
      "settings": {
        "params": {},
        "forms": {}
      },
      "results": {
        "code": "SUCCESS",
        "msg": [
          {
            "type": "HTML",
            "data": "<div class=\"markdown-body\">\n<h1>This is markdown test</h1>\n\n</div>"
          }
        ]
      },
      "apps": [],
      "runtimeInfos": {},
      "progressUpdateIntervalMs": 500,
      "jobName": "paragraph_1597165704063_563073184",
      "id": "paragraph_1597101740623_82179823",
      "dateCreated": "2020-08-11 17:08:24.063",
      "status": "READY"
    }
  ],
  "name": "test 1",
  "id": "2FF38BHBY",
  "defaultInterpreterGroup": "spark",
  "version": "0.9.0-SNAPSHOT",
  "noteParams": {},
  "noteForms": {},
  "angularObjects": {},
  "config": {
    "isZeppelinNotebookCronEnable": false
  },
  "info": {}
}
```

### Paragraph APIs

1. Update and Run a Paragraph → returns the updated paragraph

```json
POST api/notebooks/paragraph/update/run

REQUEST BODY
{
  "noteId": "2FF38BHBY",
  "paragraphId": "paragraph_1597101740623_82179823",
  "paragraphInput": "%md\n# This is markdown test 2"
}

RESPONSE BODY

{
  "text": "%md\n# This is markdown test 2",
  "user": "anonymous",
  "dateUpdated": "Aug 11, 2020 5:35:01 PM",
  "config": {
    "tableHide": true,
    "editorSetting": {
      "completionSupport": false,
      "editOnDblClick": true,
      "language": "markdown"
    },
    "colWidth": 12,
    "editorMode": "ace/mode/markdown",
    "editorHide": false,
    "fontSize": 9,
    "results": {},
    "enabled": true
  },
  "settings": {
    "params": {},
    "forms": {}
  },
  "results": {
    "code": "SUCCESS",
    "msg": [
      {
        "type": "HTML",
        "data": "<div class=\"markdown-body\">\n<h1>This is markdown test 2</h1>\n\n</div>"
      }
    ]
  },
  "apps": [],
  "runtimeInfos": {},
  "progressUpdateIntervalMs": 500,
  "jobName": "paragraph_1597165704063_563073184",
  "id": "paragraph_1597101740623_82179823",
  "dateCreated": "Aug 11, 2020 5:08:24 PM",
  "dateStarted": "Aug 11, 2020 5:35:01 PM",
  "dateFinished": "Aug 11, 2020 5:35:01 PM",
  "status": "FINISHED"
}
```

2. Update a Paragraph → returns the updated paragraph

NOTE: This API call doesn’t execute the paragraph input, should be used to save a partially written code

```json
PUT api/notebooks/paragraph/

    REQUEST BODY
    {
        "noteId": "2FF3GW3H8",
        "paragraphId": "paragraph_1596519508360_932236116",
        "paragraphInput": "%md \n\n### Hi Everyone\n* Here's a demo on **Kibana Notebooks**\n* I was not present in previous input"
    }

    RESPONSE BODY
    {
        "text": "%md \n\n### Hi Everyone\n* Here's a demo on **Kibana Notebooks**\n* I was present in previous input",
        "user": "anonymous",
        "dateUpdated": "Aug 11, 2020 5:52:14 PM",
        "config": {},
        "settings": {
            "params": {},
            "forms": {}
        },
        "results": {
            "code": "SUCCESS",
            "msg": [{
                "type": "HTML",
                "data": "<div class=\"markdown-body\">\n<h3>Hi Everyone</h3>\n<ul>\n<li>Here&rsquo;s a demo on <strong>Kibana Notebooks</strong></li>\n</ul>\n\n</div>"
            }]
        },
        "apps": [],
        "runtimeInfos": {},
        "progressUpdateIntervalMs": 500,
        "jobName": "paragraph_1597104141269_874537409",
        "id": "paragraph_1596519508360_932236116",
        "dateCreated": "Aug 11, 2020 12:02:21 AM",
        "dateStarted": "Aug 11, 2020 5:51:43 PM",
        "dateFinished": "Aug 11, 2020 5:51:43 PM",
        "status": "FINISHED"
    }

```
