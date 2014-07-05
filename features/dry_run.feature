Feature: Dry run

  Scenario: Dry run does not execute step definitions
    Given the '@failing' tag
    And a 'json' formatter
    And dry run mode
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Failing",
          "name": "Failing",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/failing.feature",
          "elements": [
            {
              "name": "Failing",
              "id": "Failing;failing",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@failing",
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
                  "name": "a failing action is executed",
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

