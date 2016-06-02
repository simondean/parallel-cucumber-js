Feature: Profile environment variable

  Scenario: Profile environment variable
    Given the 'profile_environment_variable' feature
    And a profile called 'test_profile'
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "profile-environment-variable",
          "name": "Profile environment variable",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/profile_environment_variable.feature",
          "elements": [
            {
              "name": "Profile environment variable",
              "id": "profile-environment-variable;profile-environment-variable",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "the environment variable 'PARALLEL_CUCUMBER_PROFILE' equals 'test_profile'",
                  "line": 4,
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
          "profile": "test_profile",
          "retry": 0
        }
      ]
      """
    And stderr should be empty
