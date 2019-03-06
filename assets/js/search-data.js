---
---
{% assign id = 0 %}
var json_documents = [
  {% for page in site.html_pages %}{% if page.search_exclude != true %}
    {
      "id": "{{ id }}",
      "title": "{{ page.title | xml_escape }}",
      "content": "{{ page.content | newline_to_br | replace: '<br />', ' ' | replace: '</h1>', ' ' | strip_newlines | markdownify | strip_html | remove: 'Table of contents' | xml_excape | escape | replace: '\', ' ' | replace: '```', '' | replace: '   ', ' ' | replace: '    ', ' ' | remove: '---' | remove: '#####' | remove: '####' | remove: '###' | remove: '##' | strip_newlines }}",
      "url": "{{ page.url | absolute_url | xml_escape }}",
      "relUrl": "{{ page.url | xml_escape }}"
    }{% unless forloop.last %},{% endunless %}
  {% assign id = id | plus: 1 %}{% endif %}{% endfor %}
];
