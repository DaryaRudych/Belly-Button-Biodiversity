// Metadata panel returns data for each samle

function buildMetadata(sample) {
  var metadata_url = `/metadata/${sample}`;
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadata_url).then(successHandle).catch(errorHandle)
  
  function successHandle(results) {
    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.html("");

    Object.entries(results).forEach(result => {
      let key = result[0]
      let value = result[1]
    var row = sample_metadata.append("p");
    row.text(`${key}: ${value}`);
  });
  }

  function errorHandle(error) {
    console.log(`error = ${error}`);
  };
};
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // @TODO: Build a Bubble Chart using the sample data
  
  samples_url = `/samples/${sample}`
  d3.json(samples_url).then(successHandle).catch(errorHandle)
  
  function successHandle(result) {
    var bubbleData = result;
    var x_value = bubbleData.otu_ids;
    var y_value = bubbleData.sample_values;
    var msize = bubbleData.sample_values;
    var mcolors = bubbleData.otu_ids;
    var text_value = bubbleData.otu_labels;
    var sample_data = d3.select("#bubble");
    
    var trace1 = {
      x: x_value,
      y: y_value,
      text: text_value,
      mode: 'markers',
      marker: {
          color: mcolors,
          size: msize,
      }
    };

    var data1 = [trace1]
    var layout = {
      title: 'Bubble Chart Hover Text',
      showlegend: false,
    };
    Plotly.newPlot("bubble", data1, layout, {responsive: true});

    // @TODO: Build a Pie Chart
    var pieData = result;

    // Zip all arrays together to sort accordingly 
    var zipped = []
    var s_values = []
    var ids = []
    var labels = []
    for (var i = 0; i < pieData.sample_values.length; i++){
      zipped.push([pieData.sample_values[i], pieData.otu_ids[i], pieData.otu_labels[i]]);
   };
    // Sort the array list in desc order and get top ten elements
    sorted = zipped.sort((a, b) => b[0]-a[0]).slice(0,10)
    for (var i = 0; i < sorted.length; i++){
      s_values.push(sorted[i][0]);
      ids.push(sorted[i][1]);
      labels.push(sorted[i][2]);
    };

    // Trace to plot for a pie chart
    var trace2 = [{
      values: s_values,
      labels: ids,
      hovertext: labels,
      type: 'pie',
    }];
    
    var layout = {
      title: 'Bubble Chart Hover Text',
      showlegend: false,
    };


    Plotly.newPlot("pie", trace2, {responsive: true});
  };

  function errorHandle(error) {
    console.log(`error = ${error}`)
  };
};

    
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();