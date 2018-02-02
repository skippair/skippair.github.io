/**
 * From radio in a dropdown
 */

RadioDropdown = (function() {
    Constructor = function(element) {
        var _radioElement = $(element).find('[type=radio]');
        var _textButton = $(element).find('.text-button');

        _selectInput($(element).find('[checked]'));

        function _onRadioSelect(event) {
            var input = $(event.currentTarget);
            _selectInput(input);
        }

        function _selectInput(input) {
            if (input.data('default'))
                $(element).removeClass('active')
            else
                $(element).addClass('active')
            _textButton.html(input.data('label'));
        }

        _radioElement.on('change', _onRadioSelect)
    };
    return Constructor;
})();

$(document).ready(function() {
    // Create all select input.
    $('.form-radio--dropdown').each(function() {
        RadioDropdown(this);
    });
});
