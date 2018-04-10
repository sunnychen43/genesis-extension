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

function getPoints() {
    var header = $("td").filter(function() {
        return $(this).text() == "Assignment" && $(this).siblings.length > 1;
    }).parent();

    var gradeIndex;
    header.children().each(function() {
        if($(this).text().includes("Grade")) {
            gradeIndex = $(this).index();
        }
    });

    var rows = header.siblings();

    rows.each(function() {
        if(!$(this).hasClass("listheading") && String($(this).attr("class")).includes("listrow")) {
            var percentRegex = /(?:100\.|\d{2}\.)\d+%/g;

            //Returns cleaned text of grade
            //$(this).children().eq(gradeIndex).text().replace(/\s/g,'').replace(percentRegex,'');
        }
    });
    return "done";
}

chrome.runtime.onMessage.addListener(
    function(request, sender, callback) {
        if (request.type == "request") {
            callback({type: "Course Page", categories: getCategories()});
        }
    }
);
alert(getPoints());