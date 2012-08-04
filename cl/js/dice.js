$(document).ready(function() {
	var prng = uheprng();
	prng.initState();

	var expression_box = $('#expression_box');
	var content = $('#resultant');
	var recalculate_button = $('#recalculate');

	// allow iphone to use links
	$('.head').each(function(index) {
		$(this).attr('href', 'http://danneh.net');
	});
	$('.die').each(function(index) {
		$(this).attr('href', 'http://danneh.net');
	});

	// hide all but #dice_content
	$('.content').each(function(index) {
		if ($(this).attr('id') != 'dice_content') {
			$(this).hide();
		}
	});

	// toggle content
	$(document).on('click', '.head', function(event) {
		event.preventDefault();
		var content_name = '#' + $(this).attr("id") + '_content';
		var content = $(content_name);
		content.slideToggle();
	});

	// dice adder
	$(document).on('click', '.die', function(event) {
		event.preventDefault();
		var new_expression = expression_box.val();
		if (new_expression.replace(' ', '') != '') {
			new_expression += ' +';
		}
		new_expression += ' ' + $(this).attr('dice');
		expression_box.val(new_expression);

		$('#expression_title').text(': ' + expression_box.val());

		calculate_dice();
	});

	// dice recalculate
	$(document).on('click', '#recalculate', calculate_dice);

	// expression box change
	$('#expression_box').change(function () {
		$('#expression_title').text(': ' + expression_box.val());
		calculate_dice();
	});

	// clear expression
	$(document).on('click', '#clear', function () {
		expression_box.val('');
		$('#expression_title').text('');
	});

	// dice calculator
	function calculate_dice() {
		var input_line = expression_box.val();
		var plus_split = input_line.split('+');

		var output_line = '';
		var output_dice = [];

		for (var split in plus_split) {
			var minus_split = plus_split[split].split('-');

			var first_element = minus_split.shift();
			if (first_element != '') {
				output_dice.push('+' + first_element.replace(' ', '').replace(' ', ''));
			}

			if (minus_split.length > 0) {
				for (var minsplit in minus_split) {
					output_dice.push('-' + minus_split[minsplit].replace(' ', ''));
				}
			}
		}

		var result = 0;

		for (var die in output_dice) {
			var sign = output_dice[die].substr(0, 1);
			output_dice[die] = output_dice[die].substr(1);
			var die_result;

			// so the dice thingy below works properly
			if (output_dice[die][0] == 'd') {
				output_dice[die] = '1' + output_dice[die];
			}

			if (output_dice[die].indexOf('d') != -1) { // if dice string contains d
				var dice_num = output_dice[die].substr(0, output_dice[die].indexOf('d'));
				var dice_size = output_dice[die].substr(output_dice[die].indexOf('d')+1);
				
				var current_die = 0;
				die_result = 0;

				if (output_line.substr(output_line.length - 2) != '  ') {
					output_line += ' ';
				}

				// add result of each individual dice
				for (var i=0;i < dice_num;i++) {
					current_die = prng(dice_size);
					die_result += current_die;

					output_line += sign + ' ' + current_die + ' '
				}
				output_line += ' '
			}
			else { // not a dice, just plain number
				die_result = output_dice[die];

				output_line += sign + ' ' + output_dice[die] + ' '
			}

			if (sign == '-') {
				result -= Number(die_result);
			}
			else {
				result += Number(die_result);
			}
		}

		// remove + from front of line
		if (output_line.substr(0, 3) == ' + ') {
			output_line = output_line.substr(3);
		}

		content.text(output_line);
		$('#resultant_title').text(': ' + result);
	}
});








