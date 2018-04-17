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

    var categories = [];
    rows.each(function() {
        if (!$(this).hasClass("listheading")) {
            var name = $(this).find("td").eq(0).text();
            var percentage = parseInt($(this).find("td").eq(1).text())/100;
            categories.push([name, percentage]);
        }
    });
    return categories;
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

    var pointsArray = [];
    var rows = header.siblings();

    var a = 0;
    var b = 0;

    rows.each(function() {
        if(!$(this).hasClass("listheading") && String($(this).attr("class")).includes("listrow")) {
            var percentRegex = /(?:100\.|\d{2}\.)\d+%/g;

            var pointEntry = $(this).children().eq(gradeIndex).text().replace(/(?:\s|Recently Updated)/g,'').replace(percentRegex,'').split("/");

            pointsArray.push([+pointEntry[0], +pointEntry[1]])
            a += +pointEntry[0];
            b += +pointEntry[1];
        }
    });
    alert(a/b);
    return pointsArray;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, callback) {
        if (request.type == "request") {
            callback({type: "Course Page", categories: getCategories()});
        }
    }
);

getPoints();