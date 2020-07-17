//Function makePlot takes the IDs from the JSON and creates a bar graph, a bubble chart, and a gauge chart using the data in the JSON for the specific ID
function makePlot(id) {

// Read samples.json using D3 library
   d3.json("data/samples.json").then(function(data)  {
    
    // Sets the Washing Frequency from the metadata where the ID matches the selected ID from the menu
    var wFreq = data.metadata.filter(d => d.id.toString() === id).map(d => d.wfreq);
    
    // Filters the data to only include the samples from the selected ID in the menu
    var samples = data.samples.filter(d => d.id.toString() === id)[0];
    
    // Sets the sample values from the desired ID to a variable
    // Uses slice function to only set the top 10 values to an array.
    // Uses the reverse function to set them in descending order
    var sampleValues = samples.sample_values.slice(0,10).reverse();
    console.log(`Sample values for id ${samples.id}: ${sampleValues}`);
    
    // Sets the OTU IDs from the desired ID to a variable
    // Uses slice function to only set the top 10 values to an array.
    // Uses the reverse function to set them in descending order
    var otuIDs = samples.otu_ids.slice(0,10).reverse().map(d => "OTU " + d);
    console.log(`OTU Ids for id ${samples.id}: ${otuIDs}`);
    
    // Sets the labels from the desired data to a variable
    // Uses slice function to only set the top 10 values to an array.
    // Uses the reverse function to set them in descending order
    var labels = samples.otu_labels.slice(0,10).reverse();

    //Create the trace for the bar graph using the sample value, OTU ID, and labels variables. Orientation is set to 'h' for horizontal
    trace1 = {
        type: 'bar',
        x: sampleValues,
        y: otuIDs,
        text: labels,
        orientation: "h"
    };

    //Sets the trace to an array to be plotted
    var data = [trace1];

    //Sets the layout for the plot
    var layout = {
        title: `Top 10 OTU for ID ${samples.id}`,
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 20
        }
    };

    //Creates the bar plot in the bar ID in the HTML
    Plotly.newPlot("bar", data, layout);

    // Create the trace for the bubble chart using the the created variables
    var trace2 = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        text: samples.otu_labels

    };

    // Sets the trace to an array object for plotting
    var data2 = [trace2];

    // set the layout for the bubble plot
    var layout2 = {
        autosize: true,
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1000
    };

    

    // Make the plot in the bubble ID on the HTML
    Plotly.newPlot("bubble", data2, layout2); 

    
    //Make the data set for the gauge chart using washing frequency
    var data3 = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wFreq),
        title: { text: `Weekly Washing Frequency ` },
        type: "indicator",
        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] },
                bar: {color: "rgb(230,100,0)"},
                 steps: [
                  { range: [0, 2], color: "rgb(240,230,215)" },
                  { range: [2, 4], color: "rgb(210,206,145)" },
                  { range: [4, 6], color: "rgb(170,202,42)" },
                  { range: [6, 8], color: "rgb(14,150,13)" },
                  { range: [8, 9], color: "rgb(0,105,11)" },
                ]}
            
        }
      ];
      
      var layout3 = { 
          width: 700, 
          height: 600, 
          margin: { t: 20, b: 40, l:100, r:100 } 
        };
    
      //Plots the gauge chart on the gauge ID in the HTML
      Plotly.newPlot("gauge", data3, layout3);


});

};

// Function makeMetadata takes the metadata JSON info from the desired ID and prints them in a box on the page
function makeMetadata(id) {
    d3.json('data/samples.json').then(function(data) {

        //Sets the metadata object to a variable
        var meta = data.metadata;
        
        // Filters the metadata object to the desired ID from the dropdown menu
        var meta_id = meta.filter(data => data.id.toString() === id)[0];
        
        //Selects the demographic info box
        var demoBox = d3.select("#sample-metadata");
        
        //Clears the box of any data
        demoBox.html("");
        //Appends one line to the box for each metadata key found, and prints out the keys and values of them
        Object.entries(meta_id).forEach((key) => {
            demoBox.append("p").text(`${key[0]}: ${key[1]}`);
        });
    });
}

// Function optionChanged makes the new plots and metadata box according to whichever subject ID is selected from the menu
function optionChanged(id) {
   makePlot(id);
   makeMetadata(id);
}

// Function init creates the inital plot and metadata box when the site loads
// And creates the contents of the dropdown menu
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("data/samples.json").then((data)=> {
        console.log("Samples JSON successfully read")

        // Goes through the JSON to get the names of each ID and appends them to the dropdown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        makePlot(data.names[0]);
        makeMetadata(data.names[0]);
    });
}

//Calls init() to create page
init();