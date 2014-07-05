Feature: Passing

  Scenario: Passing
    Given the 'passing' feature
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
              "line": 3,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "a passing pre-condition",
                  "line": 4,
                  "keyword": "Given ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                },
                {
                  "name": "a passing action is executed",
                  "line": 5,
                  "keyword": "When ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                },
                {
                  "name": "a post-condition passes",
                  "line": 6,
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

