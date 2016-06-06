Feature: Custom Cucumber

  Scenario: Custom Cucumber
    Given the 'passing' feature
    And a 'json' formatter
    And the './lib/custom_cucumber' custom version of Cucumber
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "custom_cucumber": true,
          "id": "passing",
          "name": "Passing",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/passing.feature",
          "elements": [],
          "profile": "default",
          "retry": 0
        }
      ]
      """
    And stderr should be empty
