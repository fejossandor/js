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
        choices: ['a', 'l']
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



jsPsych.run(timeline)