$(document).ready(function() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "request"}, (response) => {
            $("#type").text(response.type);

            if (response.categories === null) {
                $("#categoryDiv").hide();
            }

            else {
                let sel = $("#category");
                $.each(response.categories, (index, value) => {
                    sel.append($("<option></option>")
                        .attr("value",value)
                        .text(value)); 
                });
            }
        });
    });
});