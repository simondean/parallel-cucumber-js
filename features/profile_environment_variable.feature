Feature: Profile environment variable

  Scenario: Profile environment variable
    Given a 'profile_environment_variable' feature
    And a profile called 'test_profile'
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Profile-environment-variable",
          "name": "Profile environment variable",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/profile_environment_variable.feature",
          "elements": [
            {
              "name": "Profile environment variable",
              "id": "Profile-environment-variable;profile-environment-variable",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "the environment variable 'PARALLEL_CUCUMBER_PROFILE' equals 'test_profile'",
                  "line": 5,
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
          "profile": "test_profile"
        }
      ]
      """
    And stderr should be empty
