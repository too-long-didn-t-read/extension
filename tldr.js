var browser = chrome || browser;


browser.runtime.sendMessage({content: "get_current_tab_url"},
(msg) => {
    document.getElementById("tab_name").innerHTML = extractDomain(msg.url);
});


function extractDomain(url) {
    var domain = url.split('//')[1].split('/')[0]
    return domain
}