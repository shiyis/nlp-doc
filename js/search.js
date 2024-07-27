document.addEventListener('DOMContentLoaded', function() {
    searchFunc('/search.xml', 'local-search-input', 'local-search-result');
});

var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function(xmlResponse) {
            console.log('Search XML loaded successfully'); // Log success

            // Get the contents from search data
            var datas = $("entry", xmlResponse).map(function() {
                return {
                    title: $("title", this).text(),
                    content: $("content", this).text(),
                    url: $("url", this).text()
                };
            }).get();

            console.log('Entries:', datas); // Log entries to check data

            var $input = document.getElementById(search_id);
            var $resultContent = document.getElementById(content_id);

            $input.addEventListener('input', function() {
                var str = '<ul class="search-result-list">';
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                $resultContent.innerHTML = "";
                if (this.value.trim().length <= 0) {
                    return;
                }
                // Perform local searching
                datas.forEach(function(data) {
                    var isMatch = true;
                    var content_index = [];
                    if (!data.title || data.title.trim() === '') {
                        data.title = "Untitled";
                    }
                    var data_title = data.title.trim().toLowerCase();
                    var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                    var data_url = data.url;
                    var index_title = -1;
                    var index_content = -1;
                    var first_occur = -1;
                    // Only match articles with not empty contents
                    if (data_content !== '') {
                        keywords.forEach(function(keyword, i) {
                            index_title = data_title.indexOf(keyword);
                            index_content = data_content.indexOf(keyword);

                            if (index_title < 0 && index_content < 0) {
                                isMatch = false;
                            } else {
                                if (index_content < 0) {
                                    index_content = 0;
                                }
                                if (i == 0) {
                                    first_occur = index_content;
                                }
                                // content_index.push({index_content:index_content, keyword_len:keyword_len});
                            }
                        });
                    } else {
                        isMatch = false;
                    }
                    // Show search results
                    if (isMatch) {
                        str += "<p><a href='" + data_url + "' class='search-result-title'>" + data_title + "</a>";
                        var content = data.content.trim().replace(/<[^>]+>/g, "");
                        if (first_occur >= 0) {
                            // Cut out 100 characters
                            var start = first_occur - 20;
                            var end = first_occur + 80;

                            if (start < 0) {
                                start = 0;
                            }

                            if (start == 0) {
                                end = 100;
                            }

                            if (end > content.length) {
                                end = content.length;
                            }

                            var match_content = content.substr(start, end);

                            // Highlight all keywords
                            keywords.forEach(function(keyword) {
                                var regS = new RegExp(keyword, "gi");
                                match_content = match_content.replace(regS, "<em class='search-keyword'>" + keyword + "</em>");
                            });

                            str += "<p class='search-result'>" + match_content + "...</p>"
                        }
                        str += "</p>";
                    }
                });
                str += "</ul>";
                $resultContent.innerHTML = str;
            });
        },
        error: function(error) {
            console.error('Error fetching search.xml:', error); // Log error if fetch fails
        }
    });
}
