/**
 * @file
 * HERE Maps processor.
 */

(function ($) {
  Drupal.behaviors.here_maps_formatter = {};

  Drupal.behaviors.here_maps_formatter.attach = function (context, settings) {
    // Initialize the platform object:
    var platform = new H.service.Platform({
      'app_id': 'DemoAppId01082013GAL',
      'app_code': 'AJKnXv84fjrb0KIHawS0Tg',
      useCIT: true
    });

    // Obtain the default map types from the platform object.
    var maptypes = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new H.Map(
      document.getElementById('here-maps'),
      maptypes.normal.map,
      {
        zoom: 12,
        center: { lat: 14, lng: 121 }
      }
    );

    // Activate map behaviors/events.
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, maptypes);

    var marker = new H.map.Marker({lat: 14, lng: 121});
    map.addObject(marker);
  }
})(jQuery);
