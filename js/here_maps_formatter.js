/**
 * @file
 * HERE Maps processor.
 */

(function ($) {

  Drupal.behaviors.here_maps_formatter = {
    attach : function (context, settings) {
      if (typeof settings.here_maps_formatter != 'undefined') {
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

        // Sample rendered field's markup for the HERE Maps Formatter:
        //   <div id="here-maps" data-zoom="10" style="..."></div>
        var mapContainer = document.getElementById('here-maps');

        console.log(mapContainer);
        var mapZoom = mapContainer.getAttribute('data-zoom');

        var mapFeatures = Drupal.settings.here_maps_formatter.features;

        // Get the first Lat/Lon of map features for setting the map's centroid.
        var latitude = mapFeatures[0].lat;
        var longitude = mapFeatures[0].lon;

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

        // Create a group/container for the map features.
        var group = new H.map.Group();

        var length = mapFeatures.length;
        for (var i = 0; i < length; i++) {
          var latitude = mapFeatures[i].lat;
          var longitude = mapFeatures[i].lon;

          // Create a new marker in the specified latitude and longitude.
          var marker = new H.map.Marker({lat: latitude, lng: longitude});

          // Add this marker to the group of features.
          group.addObject(marker);
        }

        // Add the group to the map.
        map.addObject(group);

        // If there are more than 1 feature,
        // zoom to a view that will cover all features.
        if (length > 1) {
          // Get the minimum box that will cover all the features.
          var boundingBox = group.getBounds();

          // Set the map view to this box so that all features could be seen
          // and the best zoom level will be auto-computed.
          map.setViewBounds(boundingBox);
        }
      }
    }
  };
})(jQuery);
