/**
 * Form Select Module
 */
FormSelect = (function() {
    Constructor = function(element) {
        // ================== PRIVATE VAR ================== //
        var _inputText = $(element).find('input[type=hidden]');
        var _displayContainer = $(element).find('.form-control');
        var _collapse = $(element).find('.collapse');
        var _options = $(element).find('ul');
        var _span = $(element).find('.form-control');
        var _remove = $(element).find('.remove');
        $(element)[0].oldLabels = {};

        if ($(element).find('ul').find('.selected')) {
            var choice = $(element).find('ul').find('.selected');
            _selectChoice(choice.html(), choice.data('value'));
        }

        // ================== PRIVATE METHOD ================== //
        function _selectChoice(label, value) {
            if (_displayContainer[0].tagName != 'INPUT')
                _displayContainer.html(label);
            else
                _displayContainer.val(label);
            _inputText.val(value);
            _inputText.text(value);
            $(element)[0].oldLabels[value] = label;
        }

        function _selectOldValue(value) {
            _selectChoice($(element)[0].oldLabels[value], value);
        }

        // ================== EVENT METHOD ================== //
        function _onChoiceClick(event) {
            var choice = $(event.target);
            if (choice[0].tagName != 'LI')
                return;
            _selectChoice(choice.html(), choice.data('value'));
            _inputText.trigger('change');
            _collapse.collapse('hide');
        }

        function _onCollapseOpen() { $(element).addClass('open'); }

        function _onCollapseClose() { $(element).removeClass('open'); }

        function _onDocumentClick(event) {
            if (event.target != _span)
                _collapse.collapse('hide');
        }

        function _onRemove() {
            if (_displayContainer[0].tagName != 'INPUT')
                _displayContainer.html(_inputText.data('placeholder'));
            else
                _displayContainer.val(_inputText.data('placeholder'));
            _inputText.val('');
            _inputText.text('');
            _inputText.trigger('change');
        }

        // When choosing an option select it.
        _options.on('click', _onChoiceClick);

        // On collapse open toogle open class on parent.
        _collapse.on('show.bs.collapse', _onCollapseOpen);
        _collapse.on('hide.bs.collapse', _onCollapseClose);

        // When user click outside of the choices close it.
        $(document).on('click', _onDocumentClick);

        // If the user click on the remove X, reset.
        _remove.on('click', _onRemove);

        $(element)[0].selectOldValue = _selectOldValue;
    };
    return Constructor;
})();

$(document).ready(function() {
    // Create all select input.
    $('.form-select').each(function() {
        FormSelect(this);
    });
});
