var scores;
var totals;
var categories;

function load() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "request"}, (response) => {
            $("#type").text(response.type);

            if (response.type == "Course Page") {
                $("#courseContainer").show();

                categories = response.categories;
                scores = response.points[0];
                totals = response.points[1];

                if (categories === null) {
                    $("#categoryDiv").hide();
                }

                else {
                    let sel = $("#category");
                    $.each(categories, (cat, value) => {
                        sel.append($("<option></option>")
                            .attr("value",cat)
                            .text(cat)); 
                    });
                }
            }

        });
    });
}

function calculate(target, total) {
    target /= 100;

    var points = target * (totals + total) - scores;
    return points;
}

function catCalculate(target, total, category) {
    target /= 100;

    var n = 0;
    var d = 0;
    $.each(categories, (cat, value) => {
        // Skip blank categories
        if (totals[cat] == 0) {
            return true;
        }

        if (cat == category) {
            return true;
        }

        n += (scores[cat] / totals[cat]) * value;
        d += value;
    });

    var catTarget = (target * (d + categories[category]) - n) / categories[category];

    var points = catTarget * (totals[category] + total) - scores[category];
    return points;
}

function submit() {
    var target = +$("#targetGrade").val();
    var total = +$("#pointValue").val();
    var category = $("#category").val();

    var points;
    if (typeof scores == "object") {
        points = catCalculate(target, total, category);
    }
    else {
        points = calculate(target, total);
    }

    $("#grade").text(points);
    $("#percentage").text(points/total*100 + "%");
}

$(document).ready(function () {
    load();

    // Set event handler
    $("#button").click(submit);
});
