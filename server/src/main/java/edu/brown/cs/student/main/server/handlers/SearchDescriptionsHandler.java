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

public class SearchDescriptionsHandler implements Route {
  private String jsonFilePath;

  public SearchDescriptionsHandler(String jsonFilePath) {
    this.jsonFilePath = jsonFilePath;
  }

  /**
   * Handles the incoming request to search for area descriptions containing a keyword.
   *
   * @param request The incoming request containing query parameters.
   * @param response The response to send back to the client.
   * @return A JSON response containing the matching areas based on the keyword search.
   * @throws IOException If an I/O error occurs during file operations.
   */
  @Override
  public Object handle(Request request, Response response) throws IOException {
    response.type("application/json");
    Map<String, Object> responseMap = new HashMap<>();

    try {
      String keyword = request.queryParams("keyword");

      if (keyword == null) {
        response.status(400);
        responseMap.put("error", "Missing keyword.");
        return serializeJson(responseMap);
      }
      keyword = keyword.toLowerCase();

      List<Map<String, Object>> redliningData = readJsonFile(jsonFilePath);
      List<Map<String, Object>> matchingAreas = new ArrayList<>();

      for (Map<String, Object> feature : redliningData) {
        Map<String, Object> properties = (Map<String, Object>) feature.get("properties");

        if (properties != null) {
          Map<String, Object> areaDescription =
              (Map<String, Object>) properties.get("area_description_data");

          if (areaDescription != null) {
            for (Object value : areaDescription.values()) {
              if (value != null && value.toString().toLowerCase().contains(keyword)) {
                // isMatch = true;
                matchingAreas.add(feature);
                break;
              }
            }
          }
        }
      }

      response.status(200);
      responseMap.put("keywordData", matchingAreas); // Keep this for backward compatibility

    } catch (Exception e) {
      response.status(500);
      responseMap.put(
          "error", "An error occurred while processing the keyword request: " + e.getMessage());
    }
    return serializeJson(responseMap);
  }

  /**
   * Serializes a map to a JSON string.
   *
   * @param map The map to serialize.
   * @return A JSON string representation of the map.
   * @throws IOException If an I/O error occurs during serialization.
   */
  private String serializeJson(Map<String, Object> map) throws IOException {
    Moshi moshi = new Moshi.Builder().build();
    Type type = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> jsonAdapter = moshi.adapter(type);
    return jsonAdapter.toJson(map); // Convert the map to JSON string
  }

  /**
   * Reads a JSON file and parses it into a list of redlining data features.
   *
   * @param filePath The path to the JSON file.
   * @return A list of redlining data features extracted from the JSON file.
   * @throws IOException If an I/O error occurs while reading the file.
   */
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
