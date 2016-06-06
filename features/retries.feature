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
          "id": "retries",
          "name": "Retries",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 0",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {
                    "location": "{location}"
                  }
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
          "id": "retries",
          "name": "Retries",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 0",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {
                    "location": "{location}"
                  }
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
          "id": "retries",
          "name": "Retries",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 0",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {
                    "location": "{location}"
                  }
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 0
        },
        {
          "id": "retries",
          "name": "Retries - retry 1",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 1",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {
                    "location": "{location}"
                  }
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
          "id": "retries",
          "name": "Retries",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 0",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {
                    "location": "{location}"
                  }
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 0
        },
        {
          "id": "retries",
          "name": "Retries - retry 1",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed on retry 1",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {
                    "location": "{location}"
                  }
                }
              ]
            }
          ],
          "profile": "default",
          "retry": 1
        },
        {
          "id": "retries",
          "name": "Retries - retry 2",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/retries.feature",
          "elements": [
            {
              "name": "Retries",
              "id": "retries;retries",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an action is executed that passes on retry '2'",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {
                    "location": "{location}"
                  }
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

  Scenario: A feature with an undefined step is not retried
    Given the 'undefined' feature
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "undefined",
          "name": "Undefined",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/undefined.feature",
          "elements": [
            {
              "name": "Undefined",
              "id": "undefined;undefined",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "an undefined action is executed",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "status": "undefined"
                  }
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

  Scenario: A feature with a pending step is not retried
    Given the 'pending' feature
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "pending",
          "name": "Pending",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/pending.feature",
          "elements": [
            {
              "name": "Pending",
              "id": "pending;pending",
              "line": 3,
              "keyword": "Scenario",
              "tags": [],
              "type": "scenario",
              "steps": [
                {
                  "arguments": [],
                  "name": "a pending action is executed",
                  "line": 4,
                  "keyword": "When ",
                  "result": {
                    "status": "pending"
                  },
                  "match": {
                    "location": "{location}"
                  }
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
