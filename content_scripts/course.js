function getGrade() {
    var grade = $("body>div:nth-child(10)>b").text();
    return grade;
}

function getCategories() {
	var rows = $("td").filter(function() {
		return $(this).text() == "Category" && $(this).siblings().length == 1;
	}).parent().siblings();

    if (rows.length < 1) {
        return null;
    }

    var names = [];
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
        if (request.type == "request") {
            callback({type: "Course Page", categories: getCategories()});
        }
    }
);