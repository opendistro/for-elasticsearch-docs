
  function RESTShorthandToCurl(el) {
    var lines = el.textContent.split('\n');
    var shorthand = /^(PUT|GET|POST|PATCH|DELETE)\s+(.+)/g.exec(lines[0]);
    var out = [];
    var curlOut = document.createElement('pre');
    var curlCode = document.createElement('code');
    var tabSelectors = {
        divider : document.createElement('span'),
        control : document.createElement('div'),
        cURL : document.createElement('span'),
        shorthand : document.createElement('span')
    };
    var tabActiveClass = 'active';
    var tabNormalClass = 'curl-rest-control';
    var tabPattern = [
        ['none','block','remove','add'],
        ['block','none','add','remove']
    ];



    if (shorthand) {
        tabSelectors.control.classList.add('snippet-control-bar');
        [tabSelectors.cURL,tabSelectors.shorthand].forEach(
          function(controlEl) { controlEl.classList.add(tabNormalClass); }
        );
        curlOut.appendChild(curlCode);
        curlOut.classList.add('highlight');
        

        tabSelectors.cURL.innerHTML = 'cURL';
        tabSelectors.shorthand.innerHTML = 'REST';
        tabSelectors.shorthand.classList.add(tabActiveClass);
        tabSelectors.divider.innerHTML = ' &middot; ';
        curlOut.style.display = 'none';



        [tabSelectors.cURL, tabSelectors.shorthand].forEach(function(tabEl,index) {
            tabEl.addEventListener('click', function () {
                el.style.display = tabPattern[index][0];
                curlOut.style.display = tabPattern[index][1];
                tabSelectors.shorthand.classList[tabPattern[index][2]](tabActiveClass);
                tabSelectors.cURL.classList[tabPattern[index][3]](tabActiveClass);
            });
        });
       
        out.push(
            'curl \\',
            '\t-H \'Content-Type: application/json\' \\',
            '\t--user admin:admin -k \\',
            '\t-X '+shorthand[1]+' "https://localhost:9200/'+shorthand[2]+'" \\'
        );

        if ((lines.slice(1).length > 0) && (lines.slice(1)[0].length > 0)) {
            out.push('\t-d \''+lines.slice(1).join(' ')+'\'');
        }
        

        curlCode.innerHTML = out.join('\r\n');

        [tabSelectors.cURL, tabSelectors.divider, tabSelectors.shorthand].forEach(
            function(el) { tabSelectors.control.appendChild(el); }
        );

        el.parentNode.appendChild(curlOut);
        el.parentNode.appendChild(tabSelectors.control);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll(".highlight .highlight").forEach(function(el) {
        RESTShorthandToCurl(el);
    });
});