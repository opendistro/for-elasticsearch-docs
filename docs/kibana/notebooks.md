---
layout: default
title: Notebooks
parent: Kibana
nav_order: 2
---

# Notebooks

Kibana Notebooks enable data-driven, interactive data analytics and collaborative documents to be created and used as live notes in Kibana. They allow devops, support specialists, solution and presales specialists, customer success experts and engineers to create and share stories. They facilitate combining visualizations, timelines and text, code and adding annotations. Here are a few Kibana Notebooks use-cases:

- Create post-mortem documents
- Design runbooks
- Build Live infrastructure reports
- Foster data driven explorative collaborations

Notebooks are browser-based REPL built upon a number of popular open-source libraries

Notebooks are stored as Elasticsearch indices in the default backend. If backend adaptors are used by user, the storage is switched to storage options provided by the external backend service.
For example: Apache Zeppelin backend service supports files, Git, Amazon S3, mongo and other storage options.


Motivation

Existing Solution: Kibana Dashboards offer a solution for a few selected use cases, and are a great tool if you’re focused on monitoring a known set of metrics over time. Current issues include:
Dashboards are static in nature and are not user-friendly to make quick changes in iterations
Dashboards lack context for visualizations
Dashboards do not have multi-timeline support which are needed for post-mortem and cause analysis
Dashboards are restricted to data sources within the Elasticsearch environment

Our Solution: Kibana Notebooks provide:
Familiar notebooks user-interface for faster iterations as live notes
Markdown/Code interpreters for contextual use of data with detailed explanations by allowing a user to combine saved visualizations, text and graphs
Adaptors to embellish existing data in Elasticsearch with other reference data sources.
Support multiple timelines to compare and contrast visualizations

Glossary

Notebooks: An interface for on-the-go code writing and execution
Paragraphs: Each notebook consists on multiple paragraphs with allows users to input code or embed a visualization
Input Cell: Each paragraph consists an input cell that contains code for execution in supported interpreters such as markdown, SQL and DSL.
Output Cell: Each paragraph consists an output cell that contains execution result of code or an embeded visualization with its time-range
Backend Adaptor: An add-on to the existing default backend that provides additional interpreters and storage options.


Dashboards offer a solution for a few selected use cases, and are a great tool if you’re focused on monitoring a known set of metrics over time. Notebooks enables contextual use of data with detailed explanations by allowing a user to combine saved visualizations, text, graphs and decorate data in elastic with other reference data sources.

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
