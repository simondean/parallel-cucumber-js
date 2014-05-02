Feature: Waiting 5 seconds

  @waiting
  Scenario: Waiting 5 seconds
    Given I note down the time
    When I wait '5' seconds
    Then '5' to '7' seconds should have elapsed
