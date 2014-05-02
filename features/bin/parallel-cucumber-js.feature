Feature: The parallel-cucumber-js bin

  Scenario: Passing
    When executing the '@passing' scenarios with the parallel-cucumber-js bin
    Then the exit code should be '0'
    And the stdout should contain JSON matching:
      """
      [
        {
          "id": "Passing",
          "name": "Passing",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}",
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

  Scenario: Failing
    When executing the '@failing' scenario with the parallel-cucumber-js bin
    Then the exit code should be '1'
    And the stdout should contain JSON matching:
      """
      [
        {
          "id": "Failing",
          "name": "Failing",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}",
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
                    "error_message": "Failed",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {}
                },
                {
                  "name": "a post-condition passes",
                  "line": 7,
                  "keyword": "Then ",
                  "result": {
                    "status": "skipped"
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

  Scenario: Empty
    When executing the '@does-not-exist' scenario with the parallel-cucumber-js bin
    Then the exit code should be '0'
    And the stdout should contain JSON matching:
    """
      [
      ]
      """