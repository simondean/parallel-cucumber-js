Feature: Require

  Scenario: Require one path
    Given the 'passing' feature
    And a 'json' formatter
    And './features/' is required
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "passing",
          "name": "Passing",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/passing.feature",
          "elements": [
            {
              "name": "Passing",
              "id": "passing;passing",
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
                  "name": "a passing action is executed",
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

  Scenario: Require two paths
    Given the 'passing' feature
    And a 'json' formatter
    And './features/support/' is required
    And './features/step_definitions/' is required
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "passing",
          "name": "Passing",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/passing.feature",
          "elements": [
            {
              "name": "Passing",
              "id": "passing;passing",
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
                  "name": "a passing action is executed",
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
