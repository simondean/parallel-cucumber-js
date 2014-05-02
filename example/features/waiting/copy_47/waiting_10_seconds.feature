Feature: Waiting 10 seconds

  @waiting
  Scenario: Waiting 10 seconds
    Given I note down the time
    When I wait '10' seconds
    Then '10' to '12' seconds should have elapsed
