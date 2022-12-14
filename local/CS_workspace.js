// workspace
var ws = {
  setSize: 12,
  n_rep: 8,
  p_rep: 1,
  CS_mu: [90, 3.1],
  CS_range: [80, 3.2],
  n_test_level: 5,
  stim_present: 500,
  ISI: 500,
  n_block: 4,
  nGrid: 16
}

// basic parmeters based on measured screen information

// function run after the resize trial
var after_resize = function (trial) {
  jsPsych.data.addProperties({ SID: jsPsych.data.getURLVariable('SID') });
  jsPsych.getDisplayContainerElement().style.overflow = 'hidden';  // lock scroll

  ws.pxpd = pixelperdegree(600, jsPsych.data.get().filter({ trial_type: 'virtual-chinrest' }).values()[0].px2mm)
  ws.canvas_size = [window.innerWidth, window.innerHeight];
  ws.cx = ws.canvas_size[0] / 2;
  ws.cy = ws.canvas_size[1] / 2;
  ws.grid_interval = 4 * ws.pxpd;

  ws.resp_bar_index = range(101, 0);
  ws.stim_range = ws.CS_range.map(function (x) { return (x * 1.3) })
  ws.bg_color = 'grey';
  ws.stim_level = {
    color: range(ws.n_test_level, 0, ws.stim_range[0] / (ws.n_test_level - 1)).map(function (x) { return (x - ws.stim_range[0] / 2) }),
    size: range(ws.n_test_level, 0, ws.stim_range[1] / (ws.n_test_level - 1)).map(function (x) { let result = (x - ws.stim_range[1] / 2).toFixed(4); return (Number(result)) }),
  }
  ws.resp_bar_width = 20 * ws.pxpd;
  ws.resp_bar_height = 1 * ws.pxpd;
  ws.resp_bar_range = ws.CS_range.map(function (x) { return (x * 1.6) });
  ws.resp_bar_cxy = [ws.cx, ws.cy + 4 * ws.pxpd];
  ws.resp_bar_xbound = [ws.resp_bar_cxy[0] - ws.resp_bar_width / 2, ws.resp_bar_cxy[0] + ws.resp_bar_width / 2].map(function (x) { return (Math.round(x)) });;
  ws.resp_bar_ybound = [ws.resp_bar_cxy[1] - ws.resp_bar_height / 2, ws.resp_bar_cxy[1] + ws.resp_bar_height / 2].map(function (x) { return (Math.round(x)) });;
  ws.resp_pos_range = range(101, ws.resp_bar_xbound[0], ws.resp_bar_width / 100);

  ws.color_patch_side = 5 * ws.pxpd;

  img_scale = Math.pow(((0.5 * ws.canvas_size[1]) / 500), 2);
}


var fixation_obj = {
  obj_type: 'cross',
  line_color: '#000000',
  line_length: function () { return (0.5 * ws.pxpd) },
  startX: 'center',
  startY: 'center',
  origin_center: 'true'
}

var cursor_obj = {
  obj_type: 'cross',
  line_color: '#ffffff',
  line_length: function () {
    if (jsPsych.currentTrial().data.content == 'test_resp') {
      return (0)
    }
    else {
      return (0.5 * ws.pxpd)
    }
  },
  startX: function () { return (current_X) },
  startY: function () { return (current_Y) },
  show_start_time: function () {
    if (jsPsych.currentTrial().data.content == 'test_resp') {
      return (500)
    }
    else {
      return (0)
    }
  },
}

// intro screen 
var instruction = {
  type: 'psychophysics',
  response_type: 'mouse',
  canvas_width: function () { return ws.canvas_size[0] },
  canvas_height: function () { return ws.canvas_size[1] },
  vert_button_margin: 0,
  horiz_button_margin: 0,
  background_color: ws.bg_color,
  on_start: function () {
    jsPsych.getDisplayContainerElement().style.backgroundColor = ws.bg_color;
    jsPsych.getDisplayContainerElement().style.cursor = '';
  },
  mouse_down_func: function (event) {
    current_X = event.offsetX;
    current_Y = event.offsetY;
  },
  stimuli: [{
    obj_type: 'text',
    font: "20px 'Arial'",
    text_color: '#000000',
    content: function () {
      if (p_done == 0) {
        return ('This is practice. \n If you are ready, click anywhere to start.')
      } else if (p_done == 1) { return ('Practice is over. \n If you are ready to start the main experiment, click anywhere.') }
    },
    startX: 'center',
    startY: 'center',
    origin_center: 'true'
  }],
  on_finish: function () { }
};

// closing screen 
var closing = {
  type: 'html-button-response',
  on_start: function () { jsPsych.getDisplayContainerElement().style.backgroundColor = '',
  jsPsych.getDisplayContainerElement().style.cursor = ''},
  stimulus: function () {
      return ('Thank you for participation! <br> Please copy the confirmation code below and paste on the mTurk page. <br><br> Your confirmation code: ' + jsPsych.data.get().values()[0].confirm_code + '<br><br>')
  },
  prompt: 'If you surely recorded the confirmation code, you may press the button to close the experiment',
  choices: ['Done'],
  margin_vertical: '10px'

};

// break screen 
var break_screen = {
  type: 'psychophysics',
  response_type: 'mouse',
  canvas_width: function () { return ws.canvas_size[0] },
  canvas_height: function () { return ws.canvas_size[1] },
  vert_button_margin: 0,
  horiz_button_margin: 0,
  background_color: ws.bg_color,
  on_start: function () {
    jsPsych.getDisplayContainerElement().style.backgroundColor = ws.bg_color,
      jsPsych.getDisplayContainerElement().style.cursor = '';
  },
  stimuli: [{
    obj_type: 'text',
    font: "20px 'Arial'",
    text_color: '#000000',
    content: 'Take a break and click anywhere to start the next block.',
    startX: 'center',
    startY: 'center',
    origin_center: 'true'
  }]
};

// display tutorial images
tutorial_obj = {
  obj_type: 'image',
  file: './src/tutorial-1.png',
  startX: 'center',
  startY: 'center',
  origin_center: 'true',
  scale: 0
}

// ? shape icon for tutorial display
tutorial_icon = {
  obj_type: 'text',
  content: '?',
  font: "100px 'Arial'",
  startX: function () { return ws.canvas_size[0] - 100 },
  startY: function () { return ws.canvas_size[1] - 100 },

  // origin_center: 'true'
}
