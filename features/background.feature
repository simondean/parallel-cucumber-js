Feature: Background

  Scenario: Background
    Given the 'background' feature
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "background",
          "keyword": "Feature",
          "line": 1,
          "name": "Background",
          "tags": [],
          "uri": "{uri}/features/background.feature",
          "elements": [
            {
              "id": "background;passing",
              "keyword": "Scenario",
              "line": 6,
              "name": "Passing",
              "steps": [
                {
                  "arguments": [],
                  "keyword": "Given ",
                  "name": "a passing pre-condition",
                  "result": {
                    "status": "passed",
                    "duration": "{duration}"
                  },
                  "line": 4,
                  "match": {
                    "location": "{location}"
                  }
                },
                {
                  "arguments": [],
                  "keyword": "When ",
                  "name": "a passing action is executed",
                  "result": {
                    "status": "passed",
                    "duration": "{duration}"
                  },
                  "line": 7,
                  "match": {
                    "location": "{location}"
                  }
                },
                {
                  "arguments": [],
                  "keyword": "Then ",
                  "name": "a post-condition passes",
                  "result": {
                    "status": "passed",
                    "duration": "{duration}"
                  },
                  "line": 8,
                  "match": {
                    "location": "{location}"
                  }
                }
              ],
              "tags": [],
              "type": "scenario"
            }
          ],
          "profile": "default",
          "retry": 0
        }
      ]
      """
    And stderr should be empty
