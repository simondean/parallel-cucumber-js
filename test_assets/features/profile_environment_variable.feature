Feature: Profile environment variable

  @profile-environment-variable
  Scenario: Profile environment variable
    Then the environment variable 'PARALLEL_CUCUMBER_PROFILE' equals 'test_profile'
