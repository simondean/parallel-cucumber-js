Feature: JSON formatter

  Scenario: JSON formatter
    Given the '@passing' tag
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Passing",
          "name": "Passing",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/passing.feature",
          "elements": [
            {
              "name": "Passing",
              "id": "Passing;passing",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@passing",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "a passing pre-condition",
                  "line": 5,
                  "keyword": "Given ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                },
                {
                  "name": "a passing action is executed",
                  "line": 6,
                  "keyword": "When ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                },
                {
                  "name": "a post-condition passes",
                  "line": 7,
                  "keyword": "Then ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default"
        }
      ]
      """
    And stderr should be empty

