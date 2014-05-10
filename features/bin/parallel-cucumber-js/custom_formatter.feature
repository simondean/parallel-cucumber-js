Feature: Custom formatter

  Scenario: Custom formatter
    Given the '@passing' tag
    And a './lib/formatters/custom_formatter' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain text matching:
    """
      Start
      Feature Passing
      End
      """
    And stderr should be empty
