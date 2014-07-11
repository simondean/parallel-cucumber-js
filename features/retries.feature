Feature: Retries

  Scenario: Failing with no max retries
    Given the 'retries' feature
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '1'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Retries",
          "name": "Retries",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "Retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 0",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 0
        }
      ]
      """
    And stderr should be empty

  Scenario: Failing with 0 max retries
    Given the 'retries' feature
    And '0' max retries
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '1'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Retries",
          "name": "Retries",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "Retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 0",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 0
        }
      ]
      """
    And stderr should be empty

  Scenario: Failing with 1 max retries
    Given the 'retries' feature
    And '1' max retries
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '1'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Retries",
          "name": "Retries",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "Retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 0",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 0
        },
        {
          "id": "Retries-retry-1",
          "name": "Retries",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "Retries-retry-1;retries",
              "line": 3,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 1",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 1
        }
      ]
      """
    And stderr should be empty

  Scenario: Passing with 2 max retries
    Given the 'retries' feature
    And '2' max retries
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Retries",
          "name": "Retries",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "Retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 0",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 0
        },
        {
          "id": "Retries-retry-1",
          "name": "Retries",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "Retries-retry-1;retries",
              "line": 3,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 1",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 1
        },
        {
          "id": "Retries-retry-2",
          "name": "Retries",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "Retries-retry-2;retries",
              "line": 3,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "steps": [
                {
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 2
        }
      ]
      """
    And stderr should be empty
