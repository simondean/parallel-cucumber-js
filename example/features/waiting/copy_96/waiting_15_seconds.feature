Feature: Waiting 15 seconds

  @waiting
  Scenario: Waiting 15 seconds
    Given I note down the time
    When I wait '15' seconds
    Then '15' to '17' seconds should have elapsed
