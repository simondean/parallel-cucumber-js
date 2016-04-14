Feature: Scenario outline

  Scenario Outline: Scenario outline
    When an action is executed that passes on retry '<retry>'

    Examples:
      | retry |
      | 0     |
      | 1     |
