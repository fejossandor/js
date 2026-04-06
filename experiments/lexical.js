let jsPsych = initJsPsych();


let timeline = []

let welcometrial = {
    type: jsPsychHtmlKeyboardResponse,

    stimulus: `
    <h1>Welcome to the lexical decision task</h1>
    <p><b>You are about to see a series of characters.</b></p>
    <p>If the characters make up a word, press the F key.</p>
    <p>If the characters do not make up a word, press the J key.</p>
    <p>Press SPACE to begin.</p>`,

    choices: [' ']

};

timeline.push(welcometrial)



let conditions = [{
    title: 'Part 1 ',
    count: 3,
    conditions: [
        { characters: 'cat', isWord: true },
        { characters: 'pin', isWord: true },
        { characters: 'jgb', isWord: false },
        { characters: 'mub', isWord: false }]
},

{
    title: 'Part 2',
    count: 4,
    conditions: [{ characters: 'food', isWord: true },
    { characters: 'burn', isWord: true },
    { characters: 'mnut', isWord: false },
    { characters: 'plut', isWord: false }]
},

{
    title: 'Part 3',
    count: 5,
    conditions: [
        { characters: 'apple', isWord: true },
        { characters: 'jumps', isWord: true },
        { characters: 'pilde', isWord: false },
        { characters: 'kandy', isWord: false },
    ]
}
]

conditions = jsPsych.randomization.repeat(conditions, 1)
for (let block of conditions) {
    let blockCondtions = jsPsych.randomization.repeat(block.conditions, 1);

    let interBlockTrial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
    <h1> You reached the end of ${block.title}. Rest a little bit!</h1>
    <p>Press SPACE to begin the next block</p>
    `,
        choices: [' ']
    };
    timeline.push(interBlockTrial);

    for (let condition of blockCondtions) {
        let conditionTrial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<h1>${condition.characters}</h1>`,
            choices: ['f', 'j'],
            data: { collect: true, }

        };
        let blankScreen = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: ` `,
            trial_duration: 100,
            choices: ['NO KEYS']
        }
        timeline.push(conditionTrial);
        timeline.push(blankScreen);

    }
}

let debriefTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<h1>Thank you for participating</h1>',
    choices: ['NO KEYS'],
    on_start: function () {
        let data = jsPsych.data.get().filter({ collect: true }).csv();
        console.log(data);
    }
}

timeline.push(debriefTrial);
jsPsych.run(timeline);


