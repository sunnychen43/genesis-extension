$(document).ready(function() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {type: "categories"}, (response) => {
            if (response === null) {
                $("#categoryDiv").hide();
            }
            else {
                let sel = $("#category");
                $.each(response, (index, value) => {
                    sel.append($("<option></option>")
                        .attr("value",value)
                        .text(value)); 
                });
            }
        });
    });
});