// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let lstm;
let textInput;
let tempSlider;
let button;
let array = [];
let count = 0;

function setup() {
    noCanvas();

    // Create the LSTM Generator passing it the model directory
    lstm = ml5.LSTMGenerator('models/data/', modelReady);

    // Grab the DOM elements
    textInput = select('#textInput');
    tempSlider = select('#tempSlider');
    button = select('#generate');

    // DOM element events
    button.mousePressed(generate);
    tempSlider.input(updateSliders);
}

// Update the slider values
function updateSliders() {
    select('#temperature').html(tempSlider.value());
}

function modelReady() {
    select('#status').html('Model Loaded');
}

// Generate new text
function generate() {
    // Update the status log
    select('#status').html('Generating...');

    // Grab the original text
    let original = textInput.value();
    // Make it to lower case
    let txt = original.toLowerCase();

    // Check if there's something to send
    if (txt.length > 0) {
        // This is what the LSTM generator needs
        // Seed text, temperature, length to outputs
        // TODO: What are the defaults?
        let data = {
            seed: txt,
            temperature: tempSlider.value(),
            length: 240
        };

        // Generate text with the lstm
        lstm.generate(data, gotData);

        // When it's done
        function gotData(err, result) {
            select('#status').html('Ready');

            let text = txt.replace(/^\w/, c => c.toUpperCase());
            let res = result.substring(0, result.indexOf('.'));
            //            console.log(result);

            if (res == "") {
                select('#result').html("*");
                array.push("*");
            } else {
                select('#result').html(text + res + ".");
                array.push(text + res + ".");
            }


        }

        if (array.length >= 1) {
            let content = document.createElement('P');
            content.innerHTML = array[count];
            let list = document.querySelector('#list');
            list.insertBefore(content, list.childNodes[0]);
            count++;
        }
    }
}
