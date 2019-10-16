window.contentWrapper = document.querySelector("#content");
window.cardSizeElement = document.querySelector("#card_size");
window.g_data = window.g_data || {
    "W20190924-161621": "IMPORT $.^ AS CR_SP;\r\n\r\n//some records are related to the same crime, but is related to different person\r\nall_records := CR_SP.clean_bo.File;\r\ntheft_records := all_records(RUBRICA = 'ESTUPRO DE VULNERAVEL (ART.217-A)' OR RUBRICA = 'A.I.-ESTUPRO DE VULNERAVEL (ART.217-A)');\r\n//first chance the hour to the hour interval of each record\r\nCR_SP.clean_bo.Layout colectHourInterval(CR_SP.clean_bo.File info) := TRANSFORM\r\n\tSELF.HORA_OCORRENCIA_BO := IF(info.HORA_OCORRENCIA_BO <=-1, -1, CR_SP.fGetHourInterval(info.HORA_OCORRENCIA_BO));\r\n\tSELF := info;\r\nEND;\r\nrecords_hour_interval := SORT(PROJECT(all_records(DESCR_TIPO_PESSOA IN CR_SP.person_type.crime_victim), colectHourInterval(LEFT)),HORA_OCORRENCIA_BO);\r\ntheft_hour_interval := SORT(PROJECT(theft_records(DESCR_TIPO_PESSOA IN CR_SP.person_type.crime_victim),colectHourInterval(LEFT)),HORA_OCORRENCIA_BO);\r\n//after this is made a group of hours.\r\n\r\nHOUR_CRIME := RECORD\r\n\trecords_hour_interval.HORA_OCORRENCIA_BO;\r\n\ttotal := COUNT(GROUP);\r\nEND;\r\n\r\nTHEFT_HOUR_CRIME := RECORD\r\n\ttheft_hour_interval.HORA_OCORRENCIA_BO;\r\n\ttotal := COUNT(GROUP);\r\nEND;\r\n\r\nhour_hotspot := TABLE(records_hour_interval,HOUR_CRIME,HORA_OCORRENCIA_BO);\r\ntheft_hour_hotspot :=  TABLE(theft_hour_interval,THEFT_HOUR_CRIME,HORA_OCORRENCIA_BO);\r\nOUTPUT(hour_hotspot);\r\nOUTPUT(theft_hour_hotspot);\r\n\r\n",
    "W20190924-160902-3": "IMPORT STD;\nIMPORT DataPatterns;\nfilePath := '~asdf::test::NY_SampleInput.csv';\nds := DATASET(filePath, RECORDOF(filePath, LOOKUP), csv);\nprofileResults := DataPatterns.Profile(ds,,,,'best_ecl_types',5);\nOUTPUT(profileResults, ALL, NAMED('profileResults'));",
    "W20190924-160431": "IMPORT $.^ AS CR_SP;\r\n\r\n//some records are related to the same crime, but is related to different person\r\nall_records := CR_SP.clean_bo.File;\r\ntheft_records := all_records(RUBRICA = 'ESTUPRO DE VULNERAVEL (ART.217-A)' OR RUBRICA = 'A.I.-ESTUPRO DE VULNERAVEL (ART.217-A)');\r\n//first chance the hour to the hour interval of each record\r\nCR_SP.clean_bo.Layout colectHourInterval(CR_SP.clean_bo.File info) := TRANSFORM\r\n\tSELF.HORA_OCORRENCIA_BO := IF(info.HORA_OCORRENCIA_BO <=-1, -1, CR_SP.fGetHourInterval(info.HORA_OCORRENCIA_BO));\r\n\tSELF := info;\r\nEND;\r\nrecords_hour_interval := SORT(PROJECT(all_records, colectHourInterval(LEFT)),HORA_OCORRENCIA_BO);\r\ntheft_hour_interval := SORT(PROJECT(theft_records,colectHourInterval(LEFT)),HORA_OCORRENCIA_BO);\r\n//after this is made a group of hours.\r\n\r\nHOUR_CRIME := RECORD\r\n\trecords_hour_interval.HORA_OCORRENCIA_BO;\r\n\ttotal := COUNT(GROUP);\r\nEND;\r\n\r\nTHEFT_HOUR_CRIME := RECORD\r\n\ttheft_hour_interval.HORA_OCORRENCIA_BO;\r\n\ttotal := COUNT(GROUP);\r\nEND;\r\n\r\nhour_hotspot := TABLE(records_hour_interval,HOUR_CRIME,HORA_OCORRENCIA_BO);\r\ntheft_hour_hotspot :=  TABLE(theft_hour_interval,THEFT_HOUR_CRIME,HORA_OCORRENCIA_BO);\r\nOUTPUT(hour_hotspot);\r\nOUTPUT(theft_hour_hotspot);\r\n\r\n",
    "W20190924-135513": "OUTPUT('Hello World');\n\n<label> := <activity>;",
    "W20190924-135442": "OUTPUT('Hello World');",
    "W20190924-131122": "/*\n    Example code - use without restriction.  \n*/\nLayout_Person := RECORD\n  UNSIGNED1 PersonID;\n  STRING15  FirstName;\n  STRING25  LastName;\nEND;\n\nallPeople := DATASET([ {1,'Fred','Smith'},\n                       {2,'Joe','Blow'},\n                       {3,'Jane','Smith'}],Layout_Person);\n\nsomePeople := allPeople(LastName = 'Smith');\n\n//  Outputs  ---\nsomePeople;\n",
    "W20190924-082456": "MyRec := RECORD\n\tINTEGER2 Value1;\n\tINTEGER2 Value2;\nEND;\n\nSomeFile := DATASET([{10,0},\n\t\t\t\t\t {20,0},\n\t\t\t\t\t {30,0},\n\t\t\t\t\t {40,0},\n\t\t\t\t\t {50,0}],MyRec);\n\nMyRec AddThem(MyRec L, MyRec R) := TRANSFORM\n\tSELF.Value2 := L.Value2 + R.Value1;\n\tSELF := R;\nEND;\n\nAddedRecs := ITERATE(SomeFile,AddThem(LEFT,RIGHT));\n\noutput(AddedRecs);\n\n/* Processes as:\n\tLEFT.Value2   RIGHT.Value1\n\t\t0 (0)\t\t\t1 (10)\t\t- 0 + 10 = 10\n\t\t1 (10)\t\t\t2 (20)\t\t- 10 + 20 = 30\n\t\t2 (30)\t\t\t3 (30)\t\t- 30 + 30 = 60\n\t\t3 (60)\t\t\t4 (40)\t\t- 60 + 40 = 100\n\t\t4 (100)\t\t\t5 (50)\t\t- 100 + 50 = 150\n\nAddedRecs result set is:\n\tRec#\tValue1\tValue2\n\t1\t\t10\t\t10\n\t2\t\t20\t\t30\t\n\t3\t\t30\t\t60\n\t4\t\t40\t\t100\n\t5\t\t50\t\t150\n*/",
    "W20190923-201741": "\nIMPORT STD.DataPatterns;\n\nfilePath := '~stock_data::full_data';\nds := DATASET(filePath, RECORDOF(filePath, LOOKUP), flat);\nprofileResults := DataPatterns.Profile(ds);\nOUTPUT(profileResults, ALL, NAMED('profileResults'));\n    ",
    "W20190923-201339": "\nIMPORT STD.DataPatterns;\n\nfilePath := '~hthor::erm::crimes_sp::clean::bo_20132';\nds := DATASET(filePath, RECORDOF(filePath, LOOKUP), flat);\nprofileResults := DataPatterns.Profile(ds);\nOUTPUT(profileResults, ALL, NAMED('profileResults'));\n    "
};

window.g_colors = [
    "#f1c40f",
    "#2c3e50",
    "#7f8c8d",
    "#8e44ad",
    "#2980b9",
    "#27ae60",
];

window.g_count = 0;
window.g_card_size = [320, 200];
init_cards();

function searchKeyup(input) {
    if(event.key === "Enter"){
        search_filter(search_input.value);
    }
}
function init_cards() {
    let html = "";
    let wuid_data_str = "";
    let wuid_data;
    try {
        wuid_data_str = localStorage.getItem("wuid_data");
        wuid_data = JSON.parse(wuid_data_str);
    } catch (e) {
        console.error("Error loading cached wuid_data");
        console.groupCollapsed("Click to view what was in the localStorage for wuid_data");
        console.log(wuid_data_str);
        console.groupEnd();
        console.error(e);
    }
    if (wuid_data) g_data = wuid_data;
    g_count = 0;
    Object.keys(g_data)
        .forEach(wuid => {
            g_count++;
            html += insertCodeCard(wuid, g_data[wuid]);
        });
    contentWrapper.innerHTML = html;

    resize();
    renderAllCards();

    document.getElementById("filter_count").textContent = g_count;
    document.getElementById("total_count").textContent = Object.keys(g_data).length;
}

function search_filter(str) {
    g_count = 0;
    const matchArr = Object.keys(g_data)
        .filter(wuid => {
            return g_data[wuid].includes(str);
        });
    g_count = matchArr.length;
    const selector = "#" + matchArr.join(',#');
    Array.from(document.querySelectorAll(".code-card"))
        .forEach(elm => {
            elm.style.display = "none";
        })
        ;
    document.querySelectorAll(selector)
        .forEach(canvas => {
            canvas.style.display = "block";
            const cw = g_card_size[0];
            const ch = g_card_size[1];
            drawFileContents(canvas, g_data[canvas.id], str, cw, ch);
        })
        ;
    document.getElementById("filter_count").textContent = g_count;
    document.getElementById("total_count").textContent = Object.keys(g_data).length;
}

function insertCodeCard(name, code) {
    return `<canvas id="${name}" class="code-card" onclick="codeCardClick(this)"></canvas>`;
}
function codeCardClick(canvas){
    console.log("clicked canvas");
    console.log(canvas.id);
    console.log(g_data[canvas.id]);
    const _modal = document.getElementById("modal");
    const _modalFade = document.getElementById("modal-fade");
    if(_modal)_modal.remove();
    if(_modalFade)_modalFade.remove();
    const div = document.createElement("div");
    div.id = "modal-fade";
    div.style.position = "fixed";
    div.style.top = 0;
    div.style.right = 0;
    div.style.bottom = 0;
    div.style.left = 0;
    div.style.backgroundColor = "black";
    div.style.opacity = 0.2;
    const h = window.innerHeight;
    const modal = document.createElement("div");
    modal.id = "modal";
    modal.style.position = "fixed";
    modal.style.top = (h * 0.1) + "px";
    modal.style.right =  "200px";
    modal.style.bottom =  (h * 0.1) + "px";
    modal.style.left =  "200px";
    modal.style.backgroundColor = "white";
    div.onclick = function(){
        div.remove();
        modal.remove();
    }
    document.body.appendChild(div);
    document.body.appendChild(modal);
    new hpccjs.codemirror.ECLEditor()
        .target("modal")
        .ecl(g_data[canvas.id])
        .render(w=>{
            const str = document.getElementById("search_input").value;
            w.highlightSubstring(str);
        })
        ;
}
function change_card_sizes(resolutionStr) {
    console.log(resolutionStr);
    const sp = resolutionStr.split(" x ");
    const w = parseInt(sp[0]);
    const h = parseInt(sp[1]);
    g_card_size = [w, h];
    for (const card of document.querySelectorAll(".code-card")) {
        card.style.width = w + "px";
        card.style.height = h + "px";
    }
}

function maximize(id) {
    document.getElementById("content").style.overflowY = "hidden";
    const placeholder = document.getElementById(id);
    const maxButton = document.getElementById(id + "-maximize");
    const unmaxButton = document.getElementById(id + "-unmaximize");
    maxButton.style.display = "none";
    unmaxButton.style.display = "block";
    const cardParent = placeholder.parentElement;
    const cardRect = cardParent.getBoundingClientRect();
    const maximized_card = document.createElement("div");
    maximized_card.id = "maximized_card";
    maximized_card.style.position = "fixed";
    maximized_card.style.top = `${cardRect.top}px`;
    maximized_card.style.left = `${cardRect.left}px`;
    maximized_card.style.width = `${cardRect.width}px`;
    maximized_card.style.height = `${cardRect.height}px`;
    maximized_card.style.backgroundColor = "red";
    maximized_card.style.opacity = 0.3;
    document.body.appendChild(maximized_card);
    setTimeout(function () {
        maximized_card.style.top = `${0}px`;
        maximized_card.style.left = `${0}px`;
        maximized_card.style.width = `${window.innerWidth}px`;
        maximized_card.style.height = `${window.innerHeight}px`;
    }, 1000)

    maximized_card.onclick = function () {
        this.remove();
    }

    // const widget = placeholder
    //     .children[0]
    //     .children[0]
    //     .__data__
    //     ;
    console.log(maximized_card);
    // card.style.position = "fixed";
    // card.style.zIndex = 1000;
    // card.style.width = "auto";
    // card.style.height = "auto";
    // card.style.top = "0";
    // card.style.right = "0";
    // card.style.bottom = "0";
    // card.style.left = "0";
    // card.style.margin = "0";
    // placeholder.style.width = "100%";
    // placeholder.style.height = "calc(100% - var(--card-titlebar-height))";
    // widget.resize().render();
}

function unmaximize(id) {
    document.getElementById("content").style.overflowY = "scroll";
    const maxButton = document.getElementById(id + "-maximize");
    const unmaxButton = document.getElementById(id + "-unmaximize");
    maxButton.style.display = "block";
    unmaxButton.style.display = "none";
    const placeholder = document.getElementById(id);
    const card = placeholder.parentElement;
    // const widget = placeholder
    //     .children[0]
    //     .children[0]
    //     .__data__
    //     ;
    card.style.position = "";
    card.style.zIndex = 1;
    card.style.width = "";
    card.style.height = "";
    card.style.top = "";
    card.style.right = "";
    card.style.bottom = "";
    card.style.left = "";
    card.style.margin = "";
    placeholder.style.width = "";
    placeholder.style.height = "";
    // widget.resize().render();
}

function renderAllCards() {
    Array.from(document.querySelectorAll('canvas.code-card'))
        .forEach(canvas => {
            console.log(canvas);
            const fileId = canvas.id;
            const fileStr = g_data[fileId] || "";
            const cw = 320;
            const ch = 200;
            const lw = 200;
            const lh = ch / fileStr.split('\n').length;
            drawFileContents(canvas, fileStr, "", cw, ch, lw, lh);
            console.groupCollapsed(canvas.id);
            console.log(fileId);
            console.log(g_data[fileId]);
            console.groupEnd();
        })
        ;
}
function renderVisibleCards() {
    visibleCards().forEach(canvas => {
        const fileId = canvas.id;
        const fileStr = g_data[fileId] || "";
        const cw = 320;
        const ch = 200;
        drawFileContents(canvas, fileStr, "", cw, ch);
    });
}
function resize() {
    visibleCards().forEach(canvas => {
        canvas.style.display = "block";
    });
}
function visibleCards(){
    return Array
        .from(document.getElementById("content").children)
        .slice(0, visibleCardCount())
        ;
}
function visibleCardCount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const p = 8;

    const cols = Math.ceil(width / (g_card_size[0] + p));
    const rows = Math.ceil(height / (g_card_size[1] + p));
    return cols * rows;
}
function contentScroll(elm) {
    console.log('elm.scrollTop === ', elm.scrollTop);
}
function log_dump(fileId){
    console.groupCollapsed(fileId);
    console.log(g_data[fileId]);
    console.groupEnd();
}
function showHoverButtons(canvas){
    const rect = canvas.getBoundingClientRect();
    let html = "";
    html += `\
    `;
}
function drawFileContents(canvas, str, substr, canvasWidth, canvasHeight){
    const lineWidth = canvasWidth;
    const maxLineHeight = 20;
    let lineHeight = canvasHeight / str.split('\n').length;
    lineHeight = lineHeight > maxLineHeight ? maxLineHeight : lineHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    let longestLine = 0;
    const lineArr = str.split("\n");
    lineArr.forEach(line=>{
        const len = line.length;
        if(longestLine < len)longestLine = len;
    });
    const charWidth = lineWidth / longestLine;
    const charHeight = lineHeight;
    const charColor = "#AAA";
    const selectColor = g_colors[0];
    lineArr.forEach((line, lineIdx)=>{
        const charArr = line.split('');
        const _x = 0;
        const _y = lineHeight * lineIdx;
        const _w = charArr.length * charWidth;
        const _h = charHeight;
        ctx.fillStyle = charColor;
        ctx.fillRect(_x,_y,_w,_h);
        const substrIdx = line.indexOf(substr);
        if(substrIdx !== -1){
            ctx.fillStyle = selectColor;
            const x = substrIdx * charWidth;
            const w = substr.length * charWidth;
            ctx.fillRect(x,_y,w,_h);
        }
    });
    const specialChars = [
        {"char":"[", "color": g_colors[3]},
        {"char":"]", "color": g_colors[3]},
        {"char":"(", "color": g_colors[4]},
        {"char":")", "color": g_colors[4]},
        {"char":"{", "color": g_colors[2]},
        {"char":"}", "color": g_colors[2]},
        {"char":"'", "color": g_colors[1]},
        {"char":'"', "color": g_colors[1]},
        {"char":' ', "color": "white"}
    ];
    
    lineArr.forEach((line, lineIdx)=>{
        const y = lineHeight * lineIdx;
        const h = charHeight;
        specialChars.forEach(specialChar=>{
            const locArr = substrIdxArr(line, specialChar.char);
            locArr.forEach(loc=>{
                const x = loc * charWidth;
                const w = charWidth;
                ctx.fillStyle = specialChar.color;
                ctx.fillRect(x,y,w,h);
            })
        })
    });
}
function substrIdxArr(str, char){
    var indices = [];
    for(var i=0; i<str.length;i++) {
        if (str[i] === char) indices.push(i);
    }
    return indices;
}