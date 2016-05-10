Feature: Environment variables

  Scenario: Environment variables
    Given the 'environment_variables' feature
    And a profile called 'test_profile_1'
    And the 'test_profile_1' profile has the tag '@no-environment-variable'
    And a profile called 'test_profile_2'
    And the 'test_profile_2' profile has the tag '@environment-variable'
    And the 'test_profile_2' profile has the environment variable 'EXAMPLE_NAME' set to 'example_value'
    And a profile called 'test_profile_3'
    And the 'test_profile_3' profile has the tag '@no-environment-variable'
    And a 'json' formatter
    And '1' worker
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Environment-variables",
          "name": "Environment variables",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/environment_variables.feature",
          "elements": [
            {
              "name": "Environment variable has not been set",
              "id": "Environment-variables;environment-variable-has-not-been-set",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@no-environment-variable",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "the environment variable 'EXAMPLE_NAME' is not set",
                  "line": 5,
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
          "profile": "test_profile_1",
          "retry": 0
        },
        {
          "id": "Environment-variables",
          "name": "Environment variables",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/environment_variables.feature",
          "elements": [
            {
              "name": "Environment variable has been set",
              "id": "Environment-variables;environment-variable-has-been-set",
              "line": 8,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@environment-variable",
                  "line": 7
                }
              ],
              "steps": [
                {
                  "name": "the environment variable 'EXAMPLE_NAME' equals 'example_value'",
                  "line": 9,
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
          "profile": "test_profile_2",
          "retry": 0
        },
        {
          "id": "Environment-variables",
          "name": "Environment variables",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/environment_variables.feature",
          "elements": [
            {
              "name": "Environment variable has not been set",
              "id": "Environment-variables;environment-variable-has-not-been-set",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@no-environment-variable",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "the environment variable 'EXAMPLE_NAME' is not set",
                  "line": 5,
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
          "profile": "test_profile_3",
          "retry": 0
        }
      ]
      """
    And stderr should be empty

  Scenario: Environment variables go back to original value
    Given the environment variable 'EXAMPLE_NAME' is set to 'old_example_value'
    And a profile called 'test_profile_1'
    And the 'test_profile_1' profile has the tag '@old-environment-variable'
    And a profile called 'test_profile_2'
    And the 'test_profile_2' profile has the tag '@environment-variable'
    And the 'test_profile_2' profile has the environment variable 'EXAMPLE_NAME' set to 'example_value'
    And a profile called 'test_profile_3'
    And the 'test_profile_3' profile has the tag '@old-environment-variable'
    And a 'json' formatter
    And '1' worker
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Environment-variables",
          "name": "Environment variables",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/environment_variables.feature",
          "elements": [
            {
              "name": "Environment variable has old value",
              "id": "Environment-variables;environment-variable-has-old-value",
              "line": 12,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@old-environment-variable",
                  "line": 11
                }
              ],
              "steps": [
                {
                  "name": "the environment variable 'EXAMPLE_NAME' equals 'old_example_value'",
                  "line": 13,
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
          "profile": "test_profile_1",
          "retry": 0
        },
        {
          "id": "Environment-variables",
          "name": "Environment variables",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/environment_variables.feature",
          "elements": [
            {
              "name": "Environment variable has been set",
              "id": "Environment-variables;environment-variable-has-been-set",
              "line": 8,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@environment-variable",
                  "line": 7
                }
              ],
              "steps": [
                {
                  "name": "the environment variable 'EXAMPLE_NAME' equals 'example_value'",
                  "line": 9,
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
          "profile": "test_profile_2",
          "retry": 0
        },
        {
          "id": "Environment-variables",
          "name": "Environment variables",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/environment_variables.feature",
          "elements": [
            {
              "name": "Environment variable has old value",
              "id": "Environment-variables;environment-variable-has-old-value",
              "line": 12,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@old-environment-variable",
                  "line": 11
                }
              ],
              "steps": [
                {
                  "name": "the environment variable 'EXAMPLE_NAME' equals 'old_example_value'",
                  "line": 13,
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
          "profile": "test_profile_3",
          "retry": 0
        }
      ]
      """
    And stderr should be empty
