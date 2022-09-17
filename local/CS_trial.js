preparation =  {
    type: 'psychophysics',
    response_type: 'mouse',
    canvas_width: function () { return ws.canvas_size[0] },
    canvas_height: function () { return ws.canvas_size[1] },
    background_color: ws.bg_color, // The HEX color means green.
    stimuli: [fixation_obj, tutorial_obj, tutorial_icon, cursor_obj],
    origin_center: 'true',
    on_start: function () {
        jsPsych.getDisplayContainerElement().style.backgroundColor = ws.bg_color;
        jsPsych.getDisplayContainerElement().style.cursor = 'none';
    },
    data: {
        'content': 'data',
        'trial_num': jsPsych.timelineVariable('trial_num'),
        'corr_cond': jsPsych.timelineVariable('correlation'),
        'test_feat': jsPsych.timelineVariable('test_feature'),
        'test_index': jsPsych.timelineVariable('test_index'),
        'corr_direction': jsPsych.timelineVariable('corr_direction'),
        'set_mu': jsPsych.timelineVariable('set_mu'),
        'block_type': jsPsych.timelineVariable('b_type')
    },
    mouse_up_func: function (event) {
        context = jsPsych.currentTrial().context;

        current_X = event.offsetX
        current_Y = event.offsetY

    },
    mouse_move_func: function (event) {
        context = jsPsych.currentTrial().context;

        current_X = event.offsetX
        current_Y = event.offsetY

    },
    mouse_move_func: function (event) {

        context = jsPsych.currentTrial().context;

        current_X = event.offsetX
        current_Y = event.offsetY

        if ((Math.abs(current_X - ws.cx) < 1 * ws.pxpd) && (Math.abs(current_Y - ws.cy) < 1 * ws.pxpd)) {
            jsPsych.currentTrial().stim_array[0].line_color = "#ffffff";
            jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX = ws.cx;
            jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY = ws.cy;
        } else if ((Math.abs(current_X - jsPsych.currentTrial().stim_array[2].startX)) < 1 * ws.pxpd && (Math.abs(current_Y - jsPsych.currentTrial().stim_array[2].startY)) < 1 * ws.pxpd) {
            jsPsych.currentTrial().stim_array[2].text_color = '#ffffff'
            jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX = current_X
            jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY = current_Y
        } else {
            jsPsych.currentTrial().stim_array[0].line_color = "#000000";
            jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX = current_X
            jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY = current_Y
            jsPsych.currentTrial().stim_array[2].content = "?"
            jsPsych.currentTrial().stim_array[2].text_color = "#000000"
            jsPsych.currentTrial().stim_array[1].scale = 0;
            jsPsych.currentTrial().stim_array[0].line_length = 0.5 * ws.pxpd;
            
            jsPsych.currentTrial().stim_array[1].img.attributes.src.nodeValue = tutorial_images[0] 
        }
    },
    mouse_down_func: function (event) {
        current_X = jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX;
        current_Y = jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY;
        tutorial_path = jsPsych.currentTrial().stim_array[1].img.src;
        if ((Math.abs(current_X - ws.cx) < 1 * ws.pxpd) && (Math.abs(current_Y - ws.cy) < 1 * ws.pxpd)) {
            jsPsych.currentTrial().response_ends_trial = true;
        } else if ((Math.abs(current_X - jsPsych.currentTrial().stim_array[2].startX)) < 1 * ws.pxpd && (Math.abs(current_Y - jsPsych.currentTrial().stim_array[2].startY)) < 1 * ws.pxpd) {
            jsPsych.currentTrial().response_ends_trial = false;
            if (jsPsych.currentTrial().stim_array[2].content == "?") {
                jsPsych.currentTrial().stim_array[1].scale = img_scale;
                jsPsych.currentTrial().stim_array[0].line_length = 0;
                jsPsych.currentTrial().stim_array[2].content = ">"
            } else {
                current_img_index = tutorial_images.indexOf(jsPsych.currentTrial().stim_array[1].img.attributes.src.nodeValue);
                jsPsych.currentTrial().stim_array[1].img.attributes.src.nodeValue = tutorial_images[(current_img_index + 1) % tutorial_images.length]
            }
            } else {
                jsPsych.currentTrial().response_ends_trial = false;
        }
    }
}

set_display = {
    type: 'psychophysics',
    choices: jsPsych.NO_KEYS,
    canvas_width: function () { return ws.canvas_size[0] },
    canvas_height: function () { return ws.canvas_size[1] },
    background_color: ws.bg_color,
    trial_duration: ws.ISI + ws.stim_present,
    data: {
        'content': 'set_display',
        'trial_num': jsPsych.timelineVariable('trial_num'),
        'corr_cond': jsPsych.timelineVariable('correlation'),
        'test_feat': jsPsych.timelineVariable('test_feature'),
        'test_index': jsPsych.timelineVariable('test_index'),
        'corr_direction': jsPsych.timelineVariable('corr_direction'),
        'set_mu': jsPsych.timelineVariable('set_mu'),
        'block_type': jsPsych.timelineVariable('b_type')
    },

    stimuli: function () {
        var stim = [];
        var set = [];
        var array = [];
        var trial_num = jsPsych.timelineVariable('trial_num', true);
        var corr_cond = jsPsych.timelineVariable('correlation', true);
        var test_feat = jsPsych.timelineVariable('test_feature', true);
        var set_mu = jsPsych.timelineVariable('set_mu', true);
        var corr_direction = jsPsych.timelineVariable('corr_direction', true);
        // console.log(iterator)
        set_stimSet = mk_correlated_set(ws.setSize, set_mu, ws.CS_range, corr_cond * corr_direction);

        //stim location
        // var array_angle = 90 * Math.random()
        // var array = polygonal_coords(ws.setSize, radius = 300, tilt = array_angle, 0, 0, 0, 0)
        var array = mk_grid_coord(ws.nGrid, ws.grid_interval, 0.2 * ws.pxpd, 1);

        var rand_allocate = jsPsych.randomization.shuffle(range(ws.setSize, 0, 1))


        for (i = 0; i < ws.setSize; i++) {

            var tmp_color = lab_color_pick(70, 0, 0, 65, set_stimSet[0][i])
            stim[i] = {
                obj_type: 'circle',
                startX: array[0][rand_allocate[i]], // location in the canvas
                startY: array[1][rand_allocate[i]],

                radius: cvt_psy2phy_area(set_stimSet[1])[i] * ws.pxpd,
                line_color: ws.bg_color, // You can use the HTML color name instead of the HEX color.
                fill_color: tmp_color.hex(),
                show_start_time: ws.ISI,
                show_end_time: ws.ISI + ws.stim_present, // from the trial start (ms),
                origin_center: 'true'
            }
            set.push(stim[i])

        }

        return set
    }

}

test_resp = {
    type: 'psychophysics',
    response_type: 'mouse',
    canvas_width: function () { return ws.canvas_size[0] },
    canvas_height: function () { return ws.canvas_size[1] },
    background_color: ws.bg_color, // The HEX color means green.
    show_start_time: function () { return (ws.ISI) }, // ISI
    origin_center: 'true',
    data: {
        'content': 'test_resp',
        'trial_num': jsPsych.timelineVariable('trial_num'),
        'corr_cond': jsPsych.timelineVariable('correlation'),
        'test_feat': jsPsych.timelineVariable('test_feature'),
        'test_index': jsPsych.timelineVariable('test_index'),
        'corr_direction': jsPsych.timelineVariable('corr_direction'),
        'set_mu': jsPsych.timelineVariable('set_mu'),
        'block_type': jsPsych.timelineVariable('b_type')
    },
    mouse_move_func: function (event) {
        context = jsPsych.currentTrial().context;
        jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].line_length = 0.5 * ws.pxpd;

        if (((event.offsetX >= (ws.resp_bar_xbound[0])) && (event.offsetX <= (ws.resp_bar_xbound[1]))) && ((event.offsetY >= (ws.resp_bar_ybound[0] - 0.5 * ws.pxpd)) && (event.offsetY <= (ws.resp_bar_ybound[1] + 0.5 * ws.pxpd)))) {
            current_X = event.offsetX;

            current_Y = ws.resp_bar_cxy[1];
        } else {
            current_X = event.offsetX
            current_Y = event.offsetY
        }

        jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX = current_X;
        jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY = current_Y;

        var test_feat = jsPsych.timelineVariable('test_feature', true);
        var trial_num = jsPsych.timelineVariable('trial_num', true);

        var set_mu = jsPsych.timelineVariable('set_mu', true);


        var dist_array = ws.resp_pos_range.map(function (x) { return (Math.abs(x - current_X)) });
        var resp_index = dist_array.indexOf(jStat.min(dist_array));
        if (test_feat == 'color') {
            var resp_range = (range(101, -ws.resp_bar_range[1] / 2, ws.resp_bar_range[1] / 100).map(function (x) { return (Number((x + set_mu[1]).toFixed(4))) }));
            updated_size = resp_range[resp_index];

            if ((current_X >= ws.resp_bar_xbound[0]) && (current_X <= ws.resp_bar_xbound[1]) && (current_Y >= ws.resp_bar_ybound[0]) && (current_Y <= ws.resp_bar_ybound[1])) {
                jsPsych.currentTrial().stim_array[0].width = 0;
                jsPsych.currentTrial().stim_array[0].height = 0;
                jsPsych.currentTrial().stim_array[1].radius = cvt_psy2phy_area([updated_size]) * ws.pxpd;
            }

            else {
                jsPsych.currentTrial().stim_array[0].width = ws.color_patch_side;
                jsPsych.currentTrial().stim_array[0].height = ws.color_patch_side;
                jsPsych.currentTrial().stim_array[1].radius = 0;
            }
        }

        else if (test_feat == 'size') {
            var resp_range = (range(101, -ws.resp_bar_range[0] / 2, ws.resp_bar_range[0] / 100).map(function (x) { return (Number((x + set_mu[0]).toFixed(4))) }));
            updated_color = resp_range[resp_index];

            if ((current_X >= ws.resp_bar_xbound[0]) && (current_X <= ws.resp_bar_xbound[1]) && (current_Y >= ws.resp_bar_ybound[0]) && (current_Y <= ws.resp_bar_ybound[1])) {

                jsPsych.currentTrial().stim_array[0].fill_color = lab_color_pick(70, 0, 0, 65, updated_color).hex()

            } else {
                jsPsych.currentTrial().stim_array[0].fill_color = '#000000'
            }
        }
    },
    mouse_down_func: function (event) {
        current_X = event.offsetX
        current_Y = event.offsetY
        var test_feat = jsPsych.timelineVariable('test_feature', true);
        var set_mu = jsPsych.timelineVariable('set_mu', true);
        var trial_num = jsPsych.timelineVariable('trial_num', true);
        if (test_feat == 'color') {
            var resp_range = (range(101, -ws.resp_bar_range[1] / 2, ws.resp_bar_range[1] / 100).map(function (x) { return (Number((x + set_mu[1]).toFixed(4))) }));
        }
        else {
            var resp_range = (range(101, -ws.resp_bar_range[0] / 2, ws.resp_bar_range[0] / 100).map(function (x) { return (Number((x + set_mu[0]).toFixed(4))) }));
        }



        var dist_array = ws.resp_pos_range.map(function (x) { return (Math.abs(x - current_X)) });
        var resp_index = dist_array.indexOf(jStat.min(dist_array));

        if ((current_X >= ws.resp_bar_xbound[0]) && (current_X <= ws.resp_bar_xbound[1]) && (current_Y >= (ws.resp_bar_ybound[0] - 0.5 * ws.pxpd)) && (current_Y <= (ws.resp_bar_ybound[1] + 0.5 * ws.pxpd))) {

            jsPsych.data.get().filter({ 'trial_num': trial_num, 'content': 'data' }).addToAll({ resp_index: resp_index })
            jsPsych.currentTrial().response_ends_trial = true;
        }
        else {
            jsPsych.currentTrial().response_ends_trial = false;
        }
    },
    stimuli: function () {
        var stim = []

        var corr_cond = jsPsych.timelineVariable('correlation', true);
        var test_feat = jsPsych.timelineVariable('test_feature', true);
        var test_index = jsPsych.timelineVariable('test_index', true);
        var set_mu = jsPsych.timelineVariable('set_mu', true);


        // var set_mu = [jsPsych.data.get().filter({ 'trial_num': iterator + 1, 'content': 'data' }).values()[0].c_mu,
        // jsPsych.data.get().filter({ 'trial_num': iterator + 1, 'content': 'data' }).values()[0].s_mu];



        test_level = ws.stim_level[test_feat][test_index]; // test probe level


        if (test_feat == 'color') {
            var current_color = lab_color_pick(70, 0, 0, 65, set_mu[0] + test_level).hex();


            test_probe = {
                obj_type: 'rect',
                startX: 0 * ws.pxpd, // location in the canvas
                startY: 0 * ws.pxpd,
                show_start_time: ws.ISI,
                width: ws.color_patch_side, // of the rectangle
                height: ws.color_patch_side,
                line_color: ws.bg_color, // You can use the HTML color name instead of the HEX color.
                fill_color: current_color,
                origin_center: 'true'
            }

            updated_probe = {
                obj_type: 'circle',
                startX: 0 * ws.pxpd, // location in the canvas
                startY: 0 * ws.pxpd,
                show_start_time: ws.ISI,
                radius: 0,
                line_color: ws.bg_color, // You can use the HTML color name instead of the HEX color.
                fill_color: current_color,
                origin_center: 'true'
            }


            var resp_range = (range(101, -ws.resp_bar_range[1] / 2, ws.resp_bar_range[1] / 100).map(function (x) { return (Number((x + set_mu[1]).toFixed(4))) }));
            stim.push(test_probe, updated_probe)
        }
        else if (test_feat == 'size') {
            var current_color = '#000000'

            var current_size = set_mu[1] + test_level;

            test_probe = {
                obj_type: 'circle',
                show_start_time: ws.ISI,
                startX: 0 * ws.pxpd, // location in the canvas
                startY: 0 * ws.pxpd,
                radius: cvt_psy2phy_area([current_size]) * ws.pxpd,
                line_color: ws.bg_color, // You can use the HTML color name instead of the HEX color.
                fill_color: current_color,
                origin_center: 'true'
            }


            var resp_range = (range(101, -ws.resp_bar_range[0] / 2, ws.resp_bar_range[0] / 100).map(function (x) { return (Number((x + set_mu[0]).toFixed(4))) }));

            stim.push(test_probe)
        }



        var resp_bar = {
            obj_type: 'manual',
            show_start_time: ws.ISI,
            // startX: window.outerWidth /2,
            // startY: window.outerHeight /2,
            // origin_center: 'true',
            // 여기 해결하기
            // origin_center: 'true',
            drawFunc: function (stimulus) {
                context = jsPsych.currentTrial().context;

                context.beginPath();


                var grad = context.createLinearGradient(ws.resp_bar_xbound[0], ws.resp_bar_ybound[0], ws.resp_bar_xbound[1], ws.resp_bar_ybound[1]);
                //(x_start, y_start, x_end, yend)
                if (test_feat == 'color') {
                    grad.addColorStop(0, 'black')
                    grad.addColorStop(1, 'black')
                }

                else if (test_feat == 'size') {
                    for (var i = 0; i < ws.resp_bar_index.length; i++) {
                        grad.addColorStop(Number((i / 101).toFixed(4)), lab_color_pick(70, 0, 0, 65, resp_range[i]).hex());
                    }
                }


                context.fillStyle = grad;
                context.rect(ws.resp_bar_xbound[0], ws.resp_bar_ybound[0], ws.resp_bar_width, ws.resp_bar_height); // (x_start, y_start, x_length, y_length)
                context.fill();
                context.closePath();
            }
        }

        stim.push(resp_bar)

        stim.push(cursor_obj)

        return stim

        // iterator++;
    }
}