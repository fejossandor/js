

let jsPsych = initJsPsych()

let timeline = []


let welcomeTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <h1>Welcome to the response time task</h1>
    <h2>Your task will be to react to the given color appearing on the screen as fast as possible</h2>
    <p>When you see blue, press <b>F</b></p>
    <p>When you see orange, press <b>J</b><p>
    <p><i>Press SPACE to begin</i></p>`,
    choices: [' ']
}

timeline.push(welcomeTrial)






for (let condition of conditions) {
    let conditionTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<img src='${condition}-circle.png'>`,
        choices: ['f', 'j'],
        data: { collect: true },
        on_finish: function (data) {
            if ((data.response == 'f' && condition == 'blue') || (data.response == 'j' && condition == 'orange')) {
                data.correct = true
            } else { data.correct = false }
        }
    };

    let fixationTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `<h1>+</h1>`,
        choices: ['NO KEYS'],
        trial_duration: 500
    }
    timeline.push(fixationTrial)
    timeline.push(conditionTrial)

}


let debriefTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <h1>Thank you for your participation!</h1>`,
    choices: ['NO KEYS'],
    on_start: function () {
        let results = jsPsych
            .data
            .get()
            .filter({ collect: true })
            .ignore(['trial_type', 'plugin_version', 'internal_node_id', 'collect'])
            .csv()
        console.log(results);

    }

}
timeline.push(debriefTrial)
jsPsych.run(timeline)