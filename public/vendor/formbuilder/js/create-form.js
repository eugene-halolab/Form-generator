jQuery(function() {
    $('#visibility').change(function(e) {
        e.preventDefault()
        var ref = $(this)

        if (ref.val() == "" || ref.val() == 'PUBLIC') {
            $('#allows_edit_DIV').hide()
        } else {
            $('#allows_edit_DIV').slideDown()
            $('#allows_edit').val('0')
        }
    });

    const controlOptions = {
        elements: [
        {
            tag: 'input',
            attrs: {
                required: false,
                type: 'text',
                className: '',
                name:''
            },
            config: {
                label: 'Input text',
            },
            meta: {
                group: 'common',
                icon: '<svg class="svg-icon f-i-text-input"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#f-i-text-input"></use></svg>',
                id: 'text-input'
            },
        },
        {
            tag: 'input',
            attrs: {
                required: false,
                type: 'email',
                className: '',
                name:''
            },
            config: {
                label: 'Email',
            },
            meta: {
                group: 'common',
                icon: '@',
                id: 'email'
            },
        },
        {
            tag: 'input',
            attrs: {
                required: false,
                type: 'checkbox',
                className: '',
                name:''
            },
            config: {
                label: 'Checkbox Group',
            },
            meta: {
                group: 'common',
                icon: '<svg class="svg-icon f-i-checkbox"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#f-i-checkbox"></use></svg>',
                id: 'checkbox'
            },
            options: [
            {label: 'Option 1', value: 'opt1', selected: false, neme:''},
            {label: 'Option 2', value: 'opt2', selected: false, neme:''},
            ],
        },
        {
            tag: 'input',
            attrs: {
                required: false,
                type: 'radio',
                className: '',
                name:''
            },
            config: {
                label: 'Radio Group',
            },
            meta: {
                group: 'common',
                icon: '<svg class="svg-icon f-i-radio-group"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#f-i-radio-group"></use></svg>',
                id: 'radio'
            },
            options: [
            {label: 'Option 1', value: 'opt1', selected: false},
            {label: 'Option 2', value: 'opt2', selected: false},
            {label: 'Option 3', value: 'opt3', selected: false},
            ],
        }
        ],
    };

const defaults_formeo = {
    editorContainer: '#formeo-editor',
    svgSprite: 'https://draggable.github.io/formeo/assets/img/formeo-sprite.svg',
    dataType: 'json',
    controls: controlOptions,
    config:{
        fields:{
            all:{
                events:{
                    onRender: element => {
                      if($(element).find("#"+element.id+"-attrs-name").val() === ""){
                          $(element).find("#"+element.id+"-attrs-name").val(element.id);
                      }
                  },
              }
          }
      }
  }
};
const formData = window._form_builder_content ? JSON.parse(window._form_builder_content) : {};

var formeo = new FormeoEditor(defaults_formeo, formData);


    // ___________-------------------------------
    // create the form editor

    var fbClearBtn = $('.fb-clear-btn')
    var fbShowDataBtn = $('.fb-showdata-btn')
    var fbSaveBtn = $('.fb-save-btn')

    // setup the buttons to respond to save and clear
    fbClearBtn.click(function(e) {
        e.preventDefault()

        if ($.isEmptyObject(formeo.formData.fields)) return 
        // if (! formBuilder.actions.getData().length) return 

    sConfirm("Are you sure you want to clear all fields from the form?", function() {
        formBuilder.actions.clearFields()
    })
});

    fbShowDataBtn.click(function(e) {
        e.preventDefault()
        formBuilder.actions.showData()
    });

    fbSaveBtn.click(function(e) {
        e.preventDefault()

        var form = $('#createFormForm')

        // make sure the form is valid
        if ( ! form.parsley().validate() ) return 

            if($.isEmptyObject(formeo.formData.fields)){
                swal({
                    title: "Error",
                    text: "The form builder cannot be empty!!!!!",
                    icon: 'error',
                })
                return
            }
        // make sure the form builder is not empty
    // if (! formBuilder.actions.getData().length) {
    //     swal({
    //         title: "Error",
    //         text: "The form builder cannot be empty",
    //         icon: 'error',
    //     })
    //     return
    // }

        // ask for confirmation
        sConfirm("Save this form definition?", function() {
            fbSaveBtn.attr('disabled', 'disabled');
            fbClearBtn.attr('disabled', 'disabled');

            // var formBuilderJSONData = formBuilder.actions.getData('json')
            var formBuilderJSONData = formeo.json
            // console.log(formBuilder.actions.getData('json'))
            // var formBuilderArrayData = formBuilder.actions.getData()
            // console.log(formBuilderArrayData)

            var postData = {
                name: $('#name').val(),
                visibility: $('#visibility').val(),
                allows_edit: $('#allows_edit').val(),
                is_template: $('#is_template').is(':checked') ? 1 : 0,
                template_name: $('#template_name').val(),
                form_builder_json: formBuilderJSONData,
                _token: window.FormBuilder.csrfToken
            }

            var method = form.data('formMethod') ? 'PUT' : 'POST'
            jQuery.ajax({
                url: form.attr('action'),
                processData: true,
                data: postData,
                method: method,
                cache: false,
            })
            .then(function(response) {
                fbSaveBtn.removeAttr('disabled')
                fbClearBtn.removeAttr('disabled')

                if (response.success) {
                    // the form has been created 
                    // send the user to the form index page
                    swal({
                        title: "Form Saved!",
                        text: response.details || '',
                        icon: 'success',
                    })

                    setTimeout(function() {
                        window.location = response.dest
                    }, 1500);

                    // clear out the form
                    // $('#name').val('')
                    // $('#visibility').val('')
                    // $('#allows_edit').val('0')
                } else {
                    swal({
                        title: "Error",
                        text: response.details || 'Error',
                        icon: 'error',
                    })
                }
            }, function(error) {
                handleAjaxError(error)

                fbSaveBtn.removeAttr('disabled')
                fbClearBtn.removeAttr('disabled')
            })
        })

    })

    // show the clear and save buttons
    $('#fb-editor-footer').slideDown()
})
