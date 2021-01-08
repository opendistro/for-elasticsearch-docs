# Checks for broken link in the documentation.
# Run `bundle exec jekyll serve` first.
# Uses https://github.com/stevenvachon/broken-link-checker
blc http://127.0.0.1:4000/for-elasticsearch-docs/ -ro
