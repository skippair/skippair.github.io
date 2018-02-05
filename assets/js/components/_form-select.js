/**
 * SearchAutoComplete Module
 */
SearchAutoComplete = (function() {
    Constructor = function(element, baseUrl, getLiData, getLi) {
        // ================== PRIVATE VAR ================== //
        var _baseUrl = baseUrl;
        var _lastToken = 0;
        var _inputText = $(element).find('input');
        var _resultContainer = $(element).find('ul');
        var _getLiData = getLiData || _getLiData_super;
        var _getLi = getLi || _getLi_super;

        _inputText.on('keyup', _onKeyUp);
        _inputText.on('focus', _onFocus);

        // ================== PRIVATE METHOD ================== //
        function _onFocus() {
            _doSearch('');
        }

        function _onKeyUp(event) {
            _lastToken += 1;
            var currentToken = _lastToken;
            window.setTimeout(function() {
                if (currentToken == _lastToken)
                    _doSearch(event.currentTarget.value);
            }, 250);
        }

        function _doSearch(query) {
            var url = _baseUrl + '?query=' + query;
            $.get(url, _onGetResults);
        }

        function _onGetResults(data) {
            var resultList = [];
            for (var i = 0; i < data.results.length; i++)
                resultList.push(_getLi(data.results[i]));
            _resultContainer.html(resultList.join(''));
        }

        function _getLi_super(data) {
            return '<li>' + _getLiData(data) + '</li>';
        }

        function _getLiData_super(data) {
            return '<a href="' + data.search_url + '">' + data.name + '</a>'
        }
    };
    return Constructor;
})();


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

/**
 * Form Select Autocomplete
 */
FormSelectAutoComplete = (function() {
    Constructor = function(element, base_url) {
        function getLi(data) {
            result = '<li data-value="' + data.slug + '" class="parent">' + data.name + '</li>';
            if (data.location_set) {
                for (var i = 0; i < Math.min(5, data.location_set.length); i++)
                    result += '<li data-value="' + data.location_set[i].slug + '" class="child">' + data.location_set[i].name + '</li>';
            }
            return result;
        }
        SearchAutoComplete(element, base_url, undefined, getLi);
        FormSelect(element);
    };

    return Constructor;
})();


$(document).ready(function() {
    // Create all search autocomplete module.
    $('.search-autocomplete:not(.manual)').each(function() {
        SearchAutoComplete(this, $(this).data('url'));
    });

    // Create all select input.
    $('.form-select').each(function() {
        FormSelect(this);
    });

    // Create all select input.
    $('.form-select--autocomplete').each(function() {
        FormSelectAutoComplete(this, $(this).data('url'));
    });
});
