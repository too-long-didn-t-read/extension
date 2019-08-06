var browser = chrome || browser;

browser.runtime.sendMessage({content: "get_current_tab_url"},
(response) => {
    document.getElementById("tab_name").innerHTML = response.domain;
    
});
