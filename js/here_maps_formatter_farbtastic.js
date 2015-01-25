/**
 * @file
 * HERE Maps Formatter Farbtastic Color Picker Handler.
 */

(function ($) {
  Drupal.behaviors.here_maps_formatter_farbtastic = {
    attach : function(context, settings) {
      $(context).ajaxComplete(function() {
        // Create a farbtastic colorpicker in the given DIV container.
        var colorPicker = $.farbtastic('#here-maps-formatter-color-picker');

        // Retrieve the target text field that contains the HEX color strings.
        var colorPickerTarget = $('#here-maps-formatter-color-picker-target');

        // Make the color picker auto-update the contents of the HEX text field.
        colorPicker.linkTo(colorPickerTarget);
      });
    }
  };
})(jQuery);
