/**
 * @file
 * HERE Maps processor.
 */

(function ($) {

  Drupal.behaviors.here_maps_formatter = {
    attach : function (context, settings) {
      // Filter the POINT features only; we don't want
      // to process LINE and POLYGON features or combination of these.
      // No need to include a check for these:
      // typeof settings.here_maps_formatter != 'undefined'
      // typeof settings.here_maps_formatter.features != 'undefined'
      // since this JS file is only inserted when Geofield has non-empty values.
      if (settings.here_maps_formatter.features[0].geo_type == 'point') {
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

        // Check if the map assets should utilize the secure protocol (https).
        if (settings.here_maps_formatter.connection_protocol == 'https') {
          credentials.useHTTPS = true;
        }

        // Initialize the platform object.
        var platform = new H.service.Platform(credentials);

        // Obtain the default map types from the platform object.
        var mapTypes = platform.createDefaultLayers();

        // Values are either 'Normal', 'Satellite', or 'Terrain'.
        var chosenBaseMap = Drupal.settings.here_maps_formatter.base_map;

        // Convert the string to lowercase as required by the HERE Maps API.
        chosenBaseMap = chosenBaseMap.toLowerCase();

        // Sample base map value: mapTypes.terrain.map.
        var baseMap = mapTypes[chosenBaseMap]['map'];

        // Sample rendered field's markup for the HERE Maps Formatter:
        // <div id="here-maps" data-zoom="10" style="..."></div>
        var mapContainer = document.getElementById('here-maps');

        var mapZoom = mapContainer.getAttribute('data-zoom');

        var mapFeatures = Drupal.settings.here_maps_formatter.features;

        // Get the first Lat/Lon of map features for setting the map's centroid.
        var latitude = mapFeatures[0].lat;
        var longitude = mapFeatures[0].lon;

        // Instantiate (and display) a map object:
        var map = new H.Map(
          mapContainer,
          baseMap,
          {
            zoom: mapZoom,
            center: { lat: latitude, lng: longitude }
          }
        );

        // Activate map behaviors/events.
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

        // Create the default UI components.
        var ui = H.ui.UI.createDefault(map, mapTypes);

        // Check if the map settings button is needed to be displayed.
        if (settings.here_maps_formatter.map_ui.map_settings) {
          // Reposition the Map Settings menu for better visual balance.
          ui.getControl('mapsettings').setAlignment('top-right');
        }

        // Hide the map settings button.
        else {
          ui.getControl('mapsettings').setVisibility(false);
        }

        // Check if the map's scale bar is not to be displayed.
        if (!settings.here_maps_formatter.map_ui.scalebar) {
          ui.getControl('scalebar').setVisibility(false);
        }

        // Create a group/container for the map features.
        var group = new H.map.Group();

        // Retrieve the set marker color.
        var marker_color = settings.here_maps_formatter.marker_color;

        var marker_svg = '<svg xmlns="http://www.w3.org/2000/svg" ' +
          'width="78px" height="56px"><path d="M 19 31 C 19 32.7 16.3 34 13 34 ' +
          'C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19 29.3 19 31 Z" ' +
          'fill="#000" fill-opacity=".2"/><path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 ' +
          'C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8 21.9 L 13 31 L 22.2 21.9 ' +
          'C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/>' +
          '<path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 ' +
          'L 20.8 20.5 C 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="' + marker_color + '"/>' +
          '</svg>';

        // Create a custom icon using the given SVG markup string.
        var icon = new H.map.Icon(marker_svg);

        // Create a new marker for each point feature.
        var length = mapFeatures.length;
        for (var i = 0; i < length; i++) {
          var latitude = mapFeatures[i].lat;
          var longitude = mapFeatures[i].lon;

          // Create a new marker in the specified latitude and longitude,
          // using the custom icon.
          var marker = new H.map.Marker(
            {
              lat: latitude,
              lng: longitude
            },
            {
              icon: icon
            }
          );

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
