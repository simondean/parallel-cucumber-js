Feature: Progress formatter

  Scenario: Progress formatter
    Given the 'passing' feature
    And a 'progress' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain new line separated YAML matching:
    """
    {scenario: {worker: "{zeroOrGreaterNumber}", status: passed, profile: default, uri: features/passing_feature/Passing, duration: "{duration}"}}
    {feature: {worker: "{zeroOrGreaterNumber}", status: finished, profile: default, uri: features/passing_feature, duration: "{duration}"}}
    {summary: {status: finished, duration: "{duration}", elapsed: "{duration}", saved: "{duration}", savings: "{percentage}"}}
      """
    And stderr should be empty

  Scenario: Progress formatter with undefined step
    Given the 'undefined' feature
    And a 'progress' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain new line separated YAML matching:
    """
    {scenario: {worker: "{zeroOrGreaterNumber}", status: undefined, profile: default, uri: features/undefined_feature/Undefined, duration: "{duration}"}}
    {feature: {worker: "{zeroOrGreaterNumber}", status: finished, profile: default, uri: features/undefined_feature, duration: "{duration}"}}
    {summary: {status: finished, duration: "{duration}", elapsed: "{duration}", saved: "{duration}", savings: "{percentage}"}}
      """
    And stderr should be empty
