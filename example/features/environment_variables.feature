Feature: Environment variables

  @no-environment-variable
  Scenario: Environment variable has not been set
    Then the environment variable 'EXAMPLE_NAME' is not set

  @environment-variable
  Scenario: Environment variable has been set
    Then the environment variable 'EXAMPLE_NAME' equals 'example_value'

  @old-environment-variable
  Scenario: Environment variable has old value
    Then the environment variable 'EXAMPLE_NAME' equals 'old_example_value'

