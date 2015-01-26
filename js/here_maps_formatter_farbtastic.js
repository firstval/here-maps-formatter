/**
 * @file
 * HERE Maps Formatter Farbtastic Color Picker Handler.
 */

(function ($) {
  Drupal.behaviors.here_maps_formatter_farbtastic = {
    attach : function(context, settings) {
      // Wait the HEX input field to be rendered completely to prevent
      // referencing errors. Pass the context information to speed up
      // DOM traversal/searching.
      $('#here-maps-formatter-color-picker-target', context).ajaxComplete(function() {
        // Prevent multiple processing.
        $('#here-maps-formatter-color-picker-target', context).once('color-picker-target-processed', function() {
          // Create a farbtastic colorpicker in the given DIV container.
          var colorPicker = $.farbtastic('#here-maps-formatter-color-picker');

          // Retrieve the target text field that contains the HEX color strings.
          var colorPickerTarget = $('#here-maps-formatter-color-picker-target');

          // Make the color picker auto-update the contents of the HEX text field.
          colorPicker.linkTo(colorPickerTarget);
        });
      });
    },
  };
})(jQuery);
