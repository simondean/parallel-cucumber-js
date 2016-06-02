Feature: Scenario outline

  Scenario: Scenario outline
    Given the 'scenario_outline' feature
    And '1' max retries
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "scenario-outline",
          "name": "Scenario outline",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/scenario_outline.feature",
          "elements": [
            {
              "name": "Scenario outline",
              "id": "scenario-outline;scenario-outline",
              "line": 8,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '0'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "status": "passed",
                    "duration": "{duration}"
                  },
                  "match": {
                    "location": "{location}"
                  }
                }
              ]
            },
            {
              "name": "Scenario outline",
              "id": "scenario-outline;scenario-outline",
              "line": 9,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '1'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "status": "failed",
                    "duration": "{duration}",
                    "error_message": "Failed on retry 0"
                  },
                  "match": {
                    "location": "{location}"
                  }
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 0
        },
        {
          "id": "scenario-outline",
          "name": "Scenario outline - retry 1",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/scenario_outline.feature",
          "elements": [
            {
              "name": "Scenario outline",
              "id": "scenario-outline;scenario-outline",
              "line": 9,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '1'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "status": "passed",
                    "duration": "{duration}"
                  },
                  "match": {
                    "location": "{location}"
                  }
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 1
        }
      ]
      """
    And stderr should be empty
