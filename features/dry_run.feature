Feature: Dry run

  Scenario: Dry run does not execute step definitions
    Given the 'failing' feature
    And a 'json' formatter
    And dry run mode
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "failing",
          "name": "Failing",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/failing.feature",
          "elements": [
            {
              "name": "Failing",
              "id": "failing;failing",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "a passing pre-condition",
                  "line": 4,
                  "keyword": "Given ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {
                    "location": "{location}"
                  }
                },
                {
                  "arguments": [],
                  "name": "a failing action is executed",
                  "line": 5,
                  "keyword": "When ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {
                    "location": "{location}"
                  }
                },
                {
                  "arguments": [],
                  "name": "a post-condition passes",
                  "line": 6,
                  "keyword": "Then ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
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
        }
      ]
      """
    And stderr should be empty
