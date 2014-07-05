Feature: Empty

  Scenario: Empty
    Given the 'empty' feature
    Given the '@does-not-exist' tag
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
      ]
      """
    And stderr should be empty

