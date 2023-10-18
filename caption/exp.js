// ****************************************************************************
// *                                 Constants                                *
// ****************************************************************************


const N_CLICKS    = 100; 
const TIME_LIMIT  = 100; 
const MOVE_N      = 25;
const SIZE_N      = 50;
const FAKE_N      = 75;

// ****************************************************************************
// *                                  Trials                                  *
// ****************************************************************************

var time_left = 1000000;
var clock_started = false; 
var click_count = 0; 
var pleft = 49; 
var ptop  = 60; 
var fs    = 15; 

var trial = {
  type: "html-button-response",
  stimulus: function() {
    html = '';
    if(clock_started){
      time_left = Math.round(TIME_LIMIT - (Date.now() - start_time)/1000);
      html += `<p style="position:fixed; left:2%; top: 0%"> ${click_count}/${N_CLICKS} clicks done. </p>`;
      html += `<p style="position:fixed; left:90%; top: 0%"> ${time_left} seconds left. </p>`;
    }
    return html;
  },
  choices: function() {
    var options = ['Click Me'];
    if(click_count >= FAKE_N) {
      options.push("Don't Click Me!");
    }
    return options
  },
  button_html: function() {

    if(click_count>=MOVE_N) {
      // started randomly moving button around
      pleft = _.random(0,75);
      ptop  = _.random(5,75);
    }; 

    if(click_count >= SIZE_N) {
      // start changing shape
      fs = _.random(5,15);
    }

    html = [`<button class="jspsych-btn" style="position:fixed; left:${pleft}%; top: ${ptop}%; font-size:${fs}px">%choice%</button>`];

    if(click_count >= FAKE_N) {
      // add fake button that doesn't count
      fake_pleft = _.random(0,75);
      fake_ptop  = _.random(5,75);
      html.push(`<button class="jspsych-btn" style="position:fixed; left:${fake_pleft}%; top: ${fake_ptop}%; font-size:15px">%choice%</button>`)
    }
    return(html);
  },
  prompt: function() {
    html = '';
    if(!clock_started) {
      html += `<p>Welcome! Here's the game: try to click the button below 100 times in under ${TIME_LIMIT} seconds</p>.`; 
      html += `<p>The timer starts when you click the button.</p><p>If you win, you get a prize! Good luck.</p>`;
    }
    return(html); 
  },
  trial_duration: 1000, 
  on_finish: function(data){
    if(data.button_pressed == "0") {
      click_count++;
    }
  }
};

var won_game = false; 
var all_trials = {
  timeline: [trial], 
  loop_function: function() {
    if(click_count >= N_CLICKS || time_left <= 0) {
      if(click_count >= N_CLICKS) won_game = true;
      return false; 
    }
    if(!clock_started && click_count>0) {
      clock_started=true;
      start_time=Date.now();
    }
    return true; 
  }, 
};

var ending = {
    type: 'html-keyboard-response',
    stimulus: function() {

      if(won_game) {
        html = "<audio controls autoplay><source src='stim/accidentally_in_love.mp3' type='audio/mpeg'></audio>";
        html += "<p>You win! Here's your prize: you get to see this pic of a very pretty girl. Isn't she pretty?</p>"
        html += "<img src='stim/bb.jpg' width='600' height='600'>"
      } else {
        html = "<audio controls autoplay><source src='stim/hurt.mp3' type='audio/mpeg'></audio>";
        html += "<p>Oh no you lost! :( Try again by refreshing the page.</p>"
        html += "<img src='stim/sad_cat.jpg' width='500' height='600'>"
      }
      return(html);
    },
    choices: jsPsych.NO_KEYS,
};

timeline = [all_trials, ending]



jsPsych.init({
    timeline: timeline
});
