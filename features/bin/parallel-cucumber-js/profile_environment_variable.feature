Feature: Profile environment variable

  Scenario: Profile environment variable
    Given a profile called 'test_profile'
    And the 'test_profile' profile has the tag '@profile-environment-variable'
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Profiles",
          "name": "Profiles",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/profiles.feature",
          "elements": [
            {
              "name": "Profile environment variable",
              "id": "Profiles;profile-environment-variable",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@profile-environment-variable",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "the environment variable 'PARALLEL_CUCUMBER_PROFILE' equals 'test_profile'",
                  "line": 5,
                  "keyword": "Given ",
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
