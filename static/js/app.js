//Get the data endpoint store as url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
//const url = "./samples.json"

// Fetch the JSON data and console log it
d3.json(url).then((data)=> {
 console.log(data);

});



function init(){

    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data)=> {

        let names = data.names;

        //Using a forloop, forEach or for(let i = 0; i< array.length; i++)
        names.forEach((pick)=> {
            
            console.log(` Outcome:${pick}`);

            dropdownMenu.append("option").text(pick).property("value",pick);


        });

        let defaults = names[0];

        barchart(defaults); 
        bubblechart(defaults);
        metadatachart(defaults);



    });
};



///// Build function for the bar chart
function barchart(searchid){

    d3.json(url).then((data)=> {
        
        //Getting the data from samples array out of the three
        let sampledata = data.samples ;
        console.log(sampledata)
        
        // filtering with options of the func and assigning it a value
        let samplefiltered = sampledata.filter(result => result.id == searchid);
        console.log(samplefiltered)

        // filter down to specific point in data, taking [0] position of the array
        let sampleData = samplefiltered[0];

        console.log(sampleData)

        let sample_values = sampleData.sample_values;
        let otu_ids = sampleData.otu_ids;
        let otu_labels = sampleData.otu_labels;

        //checking each varible
        console.log(`sample_values: ${sample_values}`)
        console.log(`otu_ids: ${otu_ids}`)
        console.log(`otu_labels: ${otu_labels}`)
        

        //Slicing the top 10 for plotting, *noting for horizontal bar chart
        let xdata = sample_values.slice(0,10).reverse();
        let ydata = otu_ids.slice(0,10).map(otu => `OTU ${otu}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        // Setup for the bar chart
        let trace1 ={

            x: xdata,
            y: ydata,
            text: labels,
            type: "bar",
            orientation: "h"
        };
        let traceData = [trace1]
        //Layout for the chart
        let layout = {
            title: "Top 10 OTUs "

        };

        //Ploting
        Plotly.newPlot("bar", traceData, layout )

    });
       
};


// Build function for Bubble Chart

function bubblechart(searchid){

    d3.json(url).then((data)=>{
        
        //Getting the data from samples array out of the three
        let sampledata = data.samples ;
        console.log(sampledata)
        
        // filtering with options of the func and assigning it a value
        let samplefiltered = sampledata.filter(result => result.id == searchid);
        console.log(samplefiltered)

        // filter down to specific point in data, taking [0] position of the array
        let sampleData = samplefiltered[0];
        //tracking with console.
        console.log(sampleData)
        // Setting up variables for plot
        let sample_values = sampleData.sample_values;
        let otu_ids = sampleData.otu_ids;
        let otu_labels = sampleData.otu_labels;

        let trace2 = {

            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker:{
                size: sample_values,
                color: otu_ids,
                colorscale: "earth",

            }

        };





// Testing with value 940
// metadatas(940);





        let layout = {
            
            hovermode: "closest",
            xaxis:{ title: "OTU ID"},

        };

        let traceData2 = [trace2]

        Plotly.newPlot("bubble", traceData2,layout)


    });

};


//Build Meta function

function metadatachart(searchid){

    d3.json(url).then((data)=>{
        //filtering..
        let metadata = data.metadata;
        //filtering...
        let metafiltered = metadata.filter(result => result.id == searchid);

        let metaData = metafiltered[0];
        //tracking with console
        console.log(metaData);

        //removing the codes, to prevent future duplicates
        d3.select("#sample-metadata").html("");
        // retuns an array of key-value pairs
        Object.entries(metaData).forEach(([key,value])=>{
            
            console.log(key,value);

            d3.select("#sample-metadata").append("h4").text(`${key}: ${value}`);

            
        });


    });


};



// call fuction to update the dropdown. Referencing in the HTML. OR 
//d3.selectAll("#selDataset").on("change", optionChanged);
function optionChanged(pick){

    barchart(pick);
    bubblechart(pick);
    metadatachart(pick);
};

init();