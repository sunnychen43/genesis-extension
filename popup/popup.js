var scores;
var totals;
var categories;

function load() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "request"}, (response) => {
            if (response != undefined) {
                $("#defaultMessage").hide();
            }

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
    var percentage = points/total*100;

    // Round to 2 dp
    points = +points.toFixed(2);
    percentage = +percentage.toFixed(2);

    $("#grade").text(points + "/" + total);
    $("#percentage").text(percentage + "%");

    var colors = getColor(percentage);
    $("#resultContainer").find(".data").css("color", "rgb(" + colors[0] + "," + colors[1] + ",0)");
}

function getColor(grade) {
    var red = 0;
    var green = 220;

    // Cap below 100
    grade = Math.min(grade, 100);
    // Cap above 60
    grade = Math.max(grade, 60);

    // Scale to 0-40
    grade -= 60;
    // Max red and reduce green
    if (grade > 20) {
        red = 220;
        green -= (grade-20)*11;
    }
    // Increase red
    else {
        red += grade*11;
    }

    return [red, green];
}

$(document).ready(function () {
    load();

    // Set event handler
    $("#button").click(submit);
});
