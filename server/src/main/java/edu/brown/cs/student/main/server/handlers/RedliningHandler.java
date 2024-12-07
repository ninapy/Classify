package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class RedliningHandler implements Route {

  private String jsonFilePath;

  public RedliningHandler(String jsonFilePath) {
    this.jsonFilePath = jsonFilePath;
  }

  @Override
  public Object handle(Request request, Response response) throws IOException {
    response.type("application/json");
    Map<String, Object> responseMap = new HashMap<>();
    try {
      // Extract query parameters for latitude and longitude range
      String minLonParam = request.queryParams("minLon");
      String maxLonParam = request.queryParams("maxLon");
      String minLatParam = request.queryParams("minLat");
      String maxLatParam = request.queryParams("maxLat");

      // Validate that the parameters are not null or empty
      if (minLonParam == null
          || maxLonParam == null
          || minLatParam == null
          || maxLatParam == null) {
        response.status(400); // Bad request
        responseMap.put(
            "error", "Missing one or more required parameters: minLon, maxLon, minLat, maxLat");
        return serializeJson(responseMap);
      }

      // Convert parameters to numeric values
      double minLon = Double.parseDouble(minLonParam);
      double maxLon = Double.parseDouble(maxLonParam);
      double minLat = Double.parseDouble(minLatParam);
      double maxLat = Double.parseDouble(maxLatParam);

      // Log the values for debugging (optional)
      System.out.println(
          "Filtering by coordinates: MinLon: "
              + minLon
              + ", MaxLon: "
              + maxLon
              + ", MinLat: "
              + minLat
              + ", MaxLat: "
              + maxLat);

      // Read the redlining data from the JSON file
      List<Map<String, Object>> redliningData = readJsonFile(jsonFilePath);

      // Filter the redlining data based on the given coordinates
      List<Map<String, Object>> matchingData = new ArrayList<>();
      for (Map<String, Object> feature : redliningData) {
        Map<String, Object> geometry = (Map<String, Object>) feature.get("geometry");

        // Check if the geometry is of type "MultiPolygon" and contains coordinates
        if (geometry != null && "MultiPolygon".equals(geometry.get("type"))) {
          List<List<List<List<Double>>>> coordinates =
              (List<List<List<List<Double>>>>) geometry.get("coordinates");

          if (coordinates != null) {
            // Iterate through all polygons and their points
            for (List<List<List<Double>>> polygon : coordinates) {
              for (List<List<Double>> ring : polygon) {
                for (List<Double> point : ring) {
                  // Ensure the point has at least two elements (longitude and latitude)
                  if (point.size() >= 2) {
                    double longitude = point.get(0);
                    double latitude = point.get(1);

                    // Check if the point falls within the specified bounds
                    if (longitude >= minLon
                        && longitude <= maxLon
                        && latitude >= minLat
                        && latitude <= maxLat) {
                      matchingData.add(feature);
                      break; // Match found, no need to check further points in this feature
                    }
                  }
                }
                if (!matchingData.isEmpty()) break;
              }
              if (!matchingData.isEmpty()) break;
            }
          }
        }
      }

      // Set the response with the filtered data
      response.status(200); // OK
      responseMap.put("redlinedData", matchingData);

    } catch (Exception e) {
      // Handle any errors during the process
      response.status(500); // Internal server error
      responseMap.put(
          "error", "An error occurred while processing the redlining request: " + e.getMessage());
    }

    return serializeJson(responseMap);
  }

  private String serializeJson(Map<String, Object> map) throws IOException {
    Moshi moshi = new Moshi.Builder().build();
    Type type = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> jsonAdapter = moshi.adapter(type);
    return jsonAdapter.toJson(map); // Convert the map to JSON string
  }

  private List<Map<String, Object>> readJsonFile(String filePath) throws IOException {
    Moshi moshi = new Moshi.Builder().build();

    // Define the type of Map<String, Object> for the root GeoJSON object
    Type type = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(type);

    // Read the JSON file content into a String
    String json = new String(Files.readAllBytes(Paths.get(filePath)));

    // Parse the JSON string into a Map
    Map<String, Object> geoJsonData = adapter.fromJson(json);

    // Extract the "features" key, which is expected to be a List<Map<String, Object>>
    if (geoJsonData != null && geoJsonData.containsKey("features")) {
      return (List<Map<String, Object>>) geoJsonData.get("features");
    } else {
      // Return an empty list if "features" key is not present
      return new ArrayList<>();
    }
  }
}
