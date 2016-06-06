Feature: Cucumber events

  Scenario: BeforeFeatures and AfterFeatures only fired once
    Given the environment variable 'LOG_CUCUMBER_EVENTS' is set to 'true'
    And the 'passing' feature
    And a profile called 'test_profile_1'
    And a profile called 'test_profile_2'
    And a './lib/formatters/null_formatter' formatter
    And '1' worker
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain text matching:
    """
      Before features
      Before feature
      Before scenario
      Before step
      Step result
      After step
      Before step
      Step result
      After step
      Before step
      Step result
      After step
      After scenario
      After feature
      Before feature
      Before scenario
      Before step
      Step result
      After step
      Before step
      Step result
      After step
      Before step
      Step result
      After step
      After scenario
      After feature
      After features
      """
    And stderr should be empty

  Scenario: BeforeFeatures and AfterFeatures are not fired when there are no features
    Given the environment variable 'LOG_CUCUMBER_EVENTS' is set to 'true'
    And the 'empty' feature
    And a profile called 'test_profile'
    And the 'test_profile' profile has the tag '@does-not-exist'
    And a './lib/formatters/null_formatter' formatter
    And '1' worker
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain text matching:
    """
      """
    And stderr should be empty

  Scenario: BeforeFeatures and AfterFeatures are not fired when a worker has no work
    Given the environment variable 'LOG_CUCUMBER_EVENTS' is set to 'true'
    And the 'empty' feature
    And a profile called 'test_profile'
    And the 'test_profile' profile has the tag '@does-not-exist'
    And a './lib/formatters/null_formatter' formatter
    And '2' worker
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain text matching:
    """
      """
    And stderr should be empty
