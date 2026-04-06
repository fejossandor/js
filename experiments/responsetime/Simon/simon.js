let jsPsych = initJsPsych()

let timeline = []


let welcomeTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <h1>Welcome to the Simon Task</h1>
    <h2>You will be presented different colored objects. Your task is to react to the <u>color</u></h2>
    <p> If the color of the object is orange, press <b>A</b></p>
    <p>If the color of the object is blue, press <b>L</b></p>
    <p>Press SPACE to begin</p>`,
    choices: [' ']
}

timeline.push(welcomeTrial)

for (let condition of conditions) {

    let stimulus;
    console.log(condition.stimulus);

    switch (condition) {
        case 'orangeCongruent':
            stimulus = `<img src='orange-circle.png' style='position: absolute; top:275px; left:180px;'>`;
            break;

        case 'orangeIncongruent':
            stimulus = `<img src='orange-circle.png' style='position: absolute; top:275px; right:180px;'>`;
            break;

        case 'blueCongruent':
            stimulus = `<img src='blue-circle.png' style='position: absolute; top:275px; right:180px;'>`;
            break;

        case 'blueIncongruent':
            stimulus = `<img src='blue-circle.png' style='position: absolute; top:275px; left:180px;'>`;
            break;
    }

    let conditionTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: stimulus,
        choices: ['a', 'l'],
        condition: condition,
        data: { collect: true },
        on_finish: function (data) {
            if ((condition == 'orangeCongruent' || condition == 'orangeIncongruent' && data.response == 'a') ||
                (condition == 'blueCongruent' || condition == 'blueIncongruent' && data.response == 'l')) { data.correctResponse = true }
            else { data.correctResponse = false };
            if (condition == 'orangeCongruent' || condition == 'blueCongruent') { data.condition = 'conguent' } else { data.condition = 'incongruent' }
        }

    };
    let fixationTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<p style = 'font-weight: 100; font-size: 110px';>+</p>`,
        choices: ['NO KEY'],
        trial_duration: 400
    }
    let blank = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: ``,
        choices: ['NO KEY'],
        trial_duration: 133
    }
    timeline.push(fixationTrial);
    timeline.push(blank);
    timeline.push(conditionTrial);
}



let resultsTrial = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ['NO KEYS'],
    async: false,
    stimulus: `
        <h1>Please wait...</h1>
        <p>We are saving the results of your inputs.</p>
        `,
    on_start: function () {
        //  ⭐ Update the following three values as appropriate ⭐
        let prefix = 'Simon';
        let dataPipeExperimentId = 'your-experiment-id-here';
        let forceOSFSave = false;

        // Filter and retrieve results as CSV data
        let results = jsPsych.data
            .get()
            .filter({ collect: true })
            .ignore(['collect', 'trial_type', 'internal_node_id', 'stimulus'])
            .csv();

        // Generate a participant ID based on the current timestamp
        let participantId = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '').replace(/:/g, '-');

        // Dynamically determine if the experiment is currently running locally or on production
        let isLocalHost = window.location.href.includes('localhost');

        let destination = '/save';
        if (!isLocalHost || forceOSFSave) {
            destination = 'https://pipe.jspsych.org/api/data/';
        }

        // Send the results to our saving end point
        fetch(destination, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
            },
            body: JSON.stringify({
                experimentID: dataPipeExperimentId,
                filename: prefix + '-' + participantId + '.csv',
                data: results,
            }),
        }).then(data => {
            console.log(data);
            jsPsych.finishTrial();
        })
    }
}
timeline.push(resultsTrial);


let debriefTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<h1>Thank you for your participation!</h1>
    <h2>You may close the tab now!<h2>`,
    choices: ['NO KEY'],
    on_start: function () {
        let results = jsPsych.data.get().filter({ collect: true }).ignore(['collect', 'trial_type', 'internal_node_id', 'stimulus']).csv();
        console.log(results)
    }

}
timeline.push(debriefTrial)

jsPsych.run(timeline)