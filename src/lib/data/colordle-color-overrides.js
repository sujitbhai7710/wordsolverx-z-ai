// Upstream Colordle occasionally ships names that are missing or misspelled in color-name-list.
// These aliases keep the solver, today page, and archive stable when that happens.
export const colordleColorOverrides = {
	bloodred: { name: 'Blood Red', hex: '#980002' },
	oceanblue: { name: 'Ocean Blue', hex: '#009dc4' },
	shadow: { name: 'Shadow', hex: '#837050' },
	chili: { name: 'Chili', hex: '#be4b41' },
	redwine: { name: 'Red Wine', hex: '#8c0034' },
	coralred: { name: 'Coral Red', hex: '#ff4040' },
	bubble: { name: 'Bubble', hex: '#eaf5e7' },
	patinagreen: { name: 'Patina Green', hex: '#b9eab3' },
	// These future-source entries do not exist in color-name-list, so we map them to sensible
	// canonical swatches instead of letting the site degrade into broken placeholders.
	nude: { name: 'Nude', hex: '#f2d2bd' },
	brightpink: { name: 'Bright Pink', hex: '#ff007f' },
	vermillion: { name: 'Vermilion', hex: '#f4320c' }
};
