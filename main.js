var browser = chrome || browser;


// return the current tab url to the browser action popup
function getCurrentUrl(message, sender, sendRequest) {
    if (message.content !== 'get_current_tab_url') {
        return
    }
    browser.tabs.query(
        {
            active: true,
            windowId: browser.windows.WINDOW_ID_CURRENT
        },
        (tabs) => {
            console.log(tabs)
            browser.tabs.get(tabs[0].id , 
                tab => {
                sendRequest(tab)
                });
            }
    );
    return true;
}

browser.runtime.onMessage.addListener(getCurrentUrl)



// change browser action icon on tab change
browser.tabs.onActivated.addListener((activeTab) => {
    browser.tabs.get(activeTab.tabId,
        (res) => {
            var domain = extractDomain(res.url)
            // @TODO : call to API 
            color = 'red'
            var settingIcon = browser.browserAction.setIcon(
                {
                    path: 'http://www.newdesignfile.com/postpic/2013/01/red-and-green-circle-icon_247687.png'
                }
            )
        }
    )
})

function extractDomain(url) {
    var domain = url.split('//')[1].split('/')[0]
    return domain
}

