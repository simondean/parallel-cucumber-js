Feature: Profiles

  @profile-environment-variable
  Scenario: Profile environment variables
    Given the environment variable 'PARALLEL_CUCUMBER_PROFILE' equals 'test_profile'
