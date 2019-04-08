import 'style/CustomSelect.css!';
import _ from 'underscore';

import html from 'html/Client/CustomSelect.html!text';
const template = _.template(html);

function CustomSelect(parentId, settings){
	let $el = $(template({
		id: settings.id,
		options: settings.options,
		multiSelect: settings.multiSelect,
		defaultText: settings.defaultText || ''
	}));

	$(`#${parentId}`).append($el);
	let CS = this;

	$el.find('.custom-select-value').on('click', () => {
		$el.find('.custom-select-options').toggle(200);
	})

	$el.find('.custom-select-options button').on('click', (evt) => {
		let value = $(evt.currentTarget).val(),
			label = $(evt.currentTarget).html();

		$el.find('.custom-select-value').html(label);

		CS.value = value;
		$(CS).trigger('change', [value]);

		$el.find('.custom-select-options').hide(200);
	});

	$el.find('.custom-select-options input').on('change', (evt) => {
		values = [];
		$el.find('input').each((i, el) => {
			if(el.checked)
				values.push(el.value);
		});

		CS.values = values;
		$(CS).trigger('change', [values]);
	});
}

export default CustomSelect;