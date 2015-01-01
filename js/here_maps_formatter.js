/**
 * @file
 * HERE Maps processor.
 */

(function ($) {

  Drupal.behaviors.here_maps_formatter = {
    attach : function (context, settings) {
      if (typeof settings.here_maps_formatter != 'undefined') {
        var mapFeatures = Drupal.settings.here_maps_formatter.features;

        var latitude = mapFeatures.lat;
        var longitude = mapFeatures.lon;

        // Initialize the platform object.
        // @todo Create an Drupal Admin UI for inputting this credentials.
        var platform = new H.service.Platform({
          'app_id': 'DemoAppId01082013GAL',
          'app_code': 'AJKnXv84fjrb0KIHawS0Tg',
          useCIT: true
        });

        // Obtain the default map types from the platform object.
        var maptypes = platform.createDefaultLayers();

        var mapContainer = document.getElementById('here-maps');
        var mapZoom = mapContainer.getAttribute('data-zoom');

        // Instantiate (and display) a map object:
        var map = new H.Map(
          mapContainer,
          maptypes.normal.map,
          {
            zoom: mapZoom,
            center: { lat: latitude, lng: longitude }
          }
        );

        // Activate map behaviors/events.
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // Create the default UI components
        var ui = H.ui.UI.createDefault(map, maptypes);

        var marker = new H.map.Marker({lat: latitude, lng: longitude});
        map.addObject(marker);
      }
    }
  };

})(jQuery);
