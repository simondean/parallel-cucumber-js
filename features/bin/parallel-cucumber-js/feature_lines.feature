Feature: Feature lines

  Scenario: Feature lines
    Given the '@feature-lines' tag
    And a 'json' formatter
    And the 'features/feature_lines.feature:4' feature path
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Feature-lines",
          "name": "Feature lines",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/feature_lines.feature",
          "elements": [
            {
              "name": "Scenario 1",
              "id": "Feature-lines;scenario-1",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type":"scenario",
              "tags": [
                {
                  "name": "@feature-lines",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "a passing action is executed",
                  "line": 5,
                  "keyword": "When ",
                  "result": {
                    "duration":596095,
                    "status":"passed"
                  },
                  "match": {}
                }
              ]
            },
          ],
          "profile":"default"
        }
      ]
      """
    And stderr should be empty

