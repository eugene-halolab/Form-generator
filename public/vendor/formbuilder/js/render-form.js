jQuery(function() {

	const formData = window._form_builder_content ? JSON.parse(window._form_builder_content) : {};
	const option_formeo = {
		renderContainer: '.formeo-render',
		dataType: 'json',
		events:{
			onRender: element => {
				console.log(element);
			},
		}
	};
	const renderer = new FormeoRenderer(option_formeo);
	renderer.render(formData);
})