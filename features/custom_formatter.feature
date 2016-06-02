Feature: Custom formatter

  Scenario: Custom formatter
    Given the 'passing' feature
    And a './lib/formatters/custom_formatter' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain text matching:
    """
      Start
      Feature passing
      End
      """
    And stderr should be empty
