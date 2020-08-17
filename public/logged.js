// it is the same as the app.js file but the only difference is that i removed
// the document id of the login and signup
document.getElementById('fileUp').addEventListener("change", () => {
    const arty = document.getElementById('fileUp');
    const fileList = arty.files[0].name;
    JSON.stringify(fileList);
    console.log(fileList)
    let list = document.getElementById('aboutToUpload')
    if (list.childNodes.length > 1) {
        list.removeChild(list.childNodes[1])
        let node = document.createElement("li");
        let textnode = document.createTextNode(fileList);
        node.appendChild(textnode);
        document.getElementById('aboutToUpload').appendChild(node);
    } else {
        let node = document.createElement("li");
        let textnode = document.createTextNode(fileList);
        node.appendChild(textnode);
        document.getElementById('aboutToUpload').appendChild(node);
    }
})
document.getElementById('chart_title').addEventListener("click", () => {
    document.getElementById('chart_title').value = ''
})
let xaxis = [];
let yaxis = []
let filename = ['']
let first_row_multiplied = [];
let big_chart_y = [];
chartIt();
async function chartIt() {
    //function to check if file is uploaded
    async function getData() {
        if (filename.length >= 2) {
            filename.splice(0, 1)
            xaxis.splice(0, xaxis.length);
            yaxis.splice(0, yaxis.length);
            setTimeout(updateChart, 3500);
            console.log("works")
            console.log(filename)
        } else {
            console.log("im being called again")
            console.log(filename)
            const response = await fetch('test.csv');
            const data = await response.text();
            // '\n' = means line break or the row of the data, so it wll separate the data in rows
            let rows = data.split('\n');
            let first_row = rows.slice(0, 1);
            first_row = first_row[0].split(',');
            first_row.splice(0, 1);
            rows = rows.slice(1);
            for (i = 0; i < rows.length; i++) {
                for (j = 0; j < first_row.length; j++) {
                    first_row_multiplied.push([first_row[j]]);
                }
            }
            console.log(first_row_multiplied);
            rows.forEach((element) => {
                rows = element.split(',');
                let first_column = rows[0];
                xaxis.push(first_column);
                let g = []
                for (i = 1; i < rows.length; i++) {
                    g.push(parseFloat(rows[i]));
                }
                g = g.reduce((a, b) => a + b, 0) / g.length;
                yaxis.push(g.toString());
                let y = []
                for (i = 1; i < rows.length; i++) {
                    y.push(rows[i]);
                }
                big_chart_y.push(y);
            });
            console.log(yaxis);
            big_chart_y = [].concat.apply([], big_chart_y)
            console.log(big_chart_y);
        }
        async function updateChart() {
            const response = await fetch('/uploaded');
            const dataJson = await response.json();
            const data = dataJson[0].name.toString();
            let rows = data.split('\n');
            big_chart_y = [];
            first_row_multiplied = [];
            let first_row = rows.slice(0, 1);
            first_row = first_row[0].split(',');
            first_row.splice(0, 1);
            rows = rows.slice(1);
            for (i = 0; i < rows.length; i++) {
                for (j = 0; j < first_row.length; j++) {
                    first_row_multiplied.push([first_row[j]]);
                }
            }
            console.log(first_row_multiplied);
            rows.forEach((element) => {
                rows = element.split(',');
                let first_column = rows[0];
                xaxis.push(first_column);
                let g = []
                for (i = 1; i < rows.length; i++) {
                    g.push(parseFloat(rows[i]));
                }
                g = g.reduce((a, b) => a + b, 0) / g.length;
                yaxis.push(g.toString());
                let y = []
                for (i = 1; i < rows.length; i++) {
                    y.push(rows[i]);
                }
                big_chart_y.push(y);
            });
            console.log(yaxis);
            big_chart_y = [].concat.apply([], big_chart_y);
            get_rgb();
            myChart.update();
        };
    }
    await getData()
    //function goes after the other function calls so that i can reference xaxis
    function rgbRandom(r, g, b, a) {
        r = Math.floor(Math.random() * 255);
        g = Math.floor(Math.random() * 255);
        b = Math.floor(Math.random() * 255);
        a = Math.random();
        return "rgb(" + r + ", " + g + ", " + b + ", " + a + ")";
    }
    let backArr = [];
    let chart_title = "FILL THIS WITH YOUR OWN CHART TITLE"
    Chart.defaults.global.defaultFontColor = "#fff";
    const ctx = document.getElementById('myChart').getContext('2d');
    let configDefault;
    configDefault = {
        type: 'bar',
        data: {
            labels: xaxis,
            datasets: [{
                label: chart_title,
                data: yaxis,
                backgroundColor: backArr,
                borderColor: 'rgb(0, 0, 0)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {}
                }]
            }
        }
    };
    get_rgb();

    function get_rgb() {
        if (backArr.length > 1) {
            for (let i = 0; i < configDefault.data.labels.length; i++) {
                backArr.push(rgbRandom([i])); //to push into the array
            }
        } else {
            for (let i = 0; i < configDefault.data.labels.length; i++) {
                backArr.push(rgbRandom([i])); //to push into the array
            }
        }
    }
    let myChart = new Chart(ctx, configDefault); // here my chart ends
    document.getElementById('uploadClick').addEventListener("click", () => {
        setTimeout(() => {
            let children = document.getElementById('aboutToUpload').childNodes[1].textContent;
            if (children == undefined) {
                console.log("NO FILEE")
            } else {
                filename.push(children)
                console.log(children)
                getData();
                myChart.clear();
            }
        }, 1000);
    })
    document.getElementById('multiaxial').addEventListener("click", () => {
        configDefault.type = 'line';
        configDefault.data.datasets[0].fill = false;
        myChart.update();
    });
    document.getElementById('vertical').addEventListener("click", () => {
        configDefault.type = 'bar'
        myChart.update();
    })
    document.getElementById('upload_chart_title').addEventListener("click", () => {
        configDefault.data.datasets[0].label = document.getElementById('chart_title').value;
        myChart.update();
    })
    document.getElementById('view_all').addEventListener('click', async () => {
        console.log(big_chart_y);
        configDefault.data.labels = first_row_multiplied;
        configDefault.data.datasets[0].data = big_chart_y;
        get_rgb();
        myChart.update();
    });
}