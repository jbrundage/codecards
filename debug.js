
function fetch_latest_ecl() {
    fetchWorkunits(1000, json => {
        const wuidArr = json.WUQueryResponse.Workunits.ECLWorkunit.map(
            n => n.Wuid
        );
        console.log("wuidArr", wuidArr);
        let responseCount = 0;
        wuidArr.forEach(wuid => {
            fetchWUInfo(wuid, json => {
                responseCount++;
                g_data[wuid] = json.WUInfoResponse.Workunit.Query.Text;
                if (responseCount === wuidArr.length) {
                    try {
                        localStorage.setItem("wuid_data", JSON.stringify(g_data));
                    } catch (e) {
                        console.error("Error setting localStorage wuid_data");
                        console.error(e);
                    }
                    let html = "";
                    Object.keys(g_data).forEach(wuid => {
                        html += insertCodeCard(wuid, g_data[wuid]);
                    });
                    contentWrapper.innerHTML = html;
                    document.getElementById("filter_count").textContent = g_count;
                    document.getElementById("total_count").textContent = Object.keys(g_data).length;
                    showStep(2);
                }
            });
        });
    });
}

function fetchWUInfo(wuid, callback) {
    fetch("https://play.hpccsystems.com:18010/WsWorkunits/WUInfo.json", {
        credentials: "include",
        headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            pragma: "no-cache"
        },
        referrer: "https://play.hpccsystems.com:18010/",
        referrerPolicy: "no-referrer-when-downgrade",
        body: "Wuid=" +
            wuid +
            "&TruncateEclTo64k=false&IncludeExceptions=false&IncludeGraphs=false&IncludeSourceFiles=false&IncludeResults=false&IncludeResultsViewNames=false&IncludeVariables=true&IncludeTimers=false&IncludeResourceURLs=false&IncludeDebugValues=false&IncludeApplicationValues=false&IncludeWorkflows=false&IncludeXmlSchemas=false&SuppressResultSchemas=true&rawxml_=true",
        method: "POST",
        mode: "cors"
    })
        .then(resp => resp.json())
        .then(json => callback(json));
}

function fetchWorkunits(count, callback) {
    fetch(`https://play.hpccsystems.com:18010/WsWorkunits/WUQuery.json?Count=${count}`)
        .then(resp => resp.json())
        .then(json => callback(json));
}