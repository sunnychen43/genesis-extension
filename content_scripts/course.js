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

    var categories = {};
    rows.each(function() {
        if (!$(this).hasClass("listheading")) {
            var name = $(this).find("td").eq(0).text();
            var percentage = parseInt($(this).find("td").eq(1).text())/100;
            categories[name] = percentage;
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

    var categoryIndex;
    header.children().each(function() {
        if($(this).text().includes("Category")) {
            categoryIndex = $(this).index();
        }
    });

    var categories = getCategories();

    if (categories != null) {
        var scores = {};
        var totals = {};

        for (var cat in categories) {
            if (categories.hasOwnProperty(cat)) {
                scores[cat] = 0;
                totals[cat] = 0;
            }
        }
    }
    
    else {
        var scores = 0;
        var totals = 0;
    }


    var rows = header.siblings();
    rows.each(function() {
        if(!$(this).hasClass("listheading") && String($(this).attr("class")).includes("listrow")) {
            var regexp = /[\d,.]+/g;
            var matches = $(this).children().eq(gradeIndex).text().match(regexp);
            $(this).children().eq(categoryIndex).find("div").remove();
            var category = $(this).children().eq(categoryIndex).text().replace(/(?<!\w)\s|\s(?!\w)/g,'');
            
            if (categories != null) {
                scores[category] += +matches[0];
                totals[category] += +matches[1];
            }
            else {
                scores += +matches[0];
                totals += +matches[1];
            }
        }
    });

    return [scores, totals];
}

chrome.runtime.onMessage.addListener(
    function(request, sender, callback) {
        if (request.type == "request") {
            callback({type: "Course Page", categories: getCategories(), points: getPoints()});
        }
    }
);