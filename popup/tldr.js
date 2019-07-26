var browser = chrome || browser;

browser.runtime.sendMessage({content: "get_current_tab_url"},
(currentTabDomain) => {
    document.getElementById("tab_name").innerHTML = currentTabDomain;
});
