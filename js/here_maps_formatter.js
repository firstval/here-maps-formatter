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

        var credentials = {};

        // Retrieve the set credentials in 'variable' table via the admin form.
        credentials.app_id = settings.here_maps_formatter.app_id;
        credentials.app_code = settings.here_maps_formatter.app_code;

        // Delete the credentials so that other people could not access it
        // in browser's console via Drupal.settings global object.
        delete settings.here_maps_formatter.app_id;
        delete settings.here_maps_formatter.app_code;

        // Check if the page is using the demo credentials.
        // Include the CIT (Customer Integration Testing) flag of demo tiles.
        // Otherwise, demo version will not work.
        if (credentials.app_id == 'DemoAppId01082013GAL') {
          credentials.useCIT = true;
        }

        // Initialize the platform object.
        // @todo Create an Drupal Admin UI for inputting this credentials.
        // @todo Include the 'useHTTPS' platform option.
        var platform = new H.service.Platform(credentials);

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
