// load searches from local storage
var loadSearches = function() {
    searches = JSON.parse(localStorage.getItem("searches"));

    if (!searches) {
        searches = [];
    }

    // clear out previous searches to get rid of duplicates
    $("#previous-searches").empty();

    // create elements for previous searches
    searches.forEach(function(search) {
        $("previous-searches").append("<button class='btn btn-secondary m-1 searchbtns'>" + search + "</button>")
    })
}

