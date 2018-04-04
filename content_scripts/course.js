function getGrade() {
    var grade = $("body > div:nth-child(10) > b").text();
    return grade;
}

function getCategories() {
    if ($("body > table.notecard > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(10) > td > div > table > tbody").length != 1) {
        return null;
    }

    var names = [];
    var rows = $("body > table.notecard > tbody > tr:nth-child(2) > td > div > table > tbody > tr:nth-child(10) > td > div > table > tbody > tr");
    rows.each(function() {
        if (!$(this).hasClass("listheading")) {
            var name = $(this).find("td").eq(0).text();
            names.push(name);
        }
    });
    return names;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, callback) {
        if (request.type == "grade") {
            callback(getGrade());
        }

        if (request.type == "categories") {
            callback(getCategories());
        }
    });