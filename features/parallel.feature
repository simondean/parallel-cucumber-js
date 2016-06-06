Feature: Parallel

  Scenario: Parallel
    Given the 'parallel' features
    And a profile called 'blue'
    And the 'blue' profile has the tag '@blue'
    And a profile called 'red'
    And the 'red' profile has the tag '@red'
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "blue",
          "name": "Blue",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/parallel/blue.feature",
          "elements": [
            {
              "name": "Blue",
              "id": "blue;blue",
              "line": 4,
              "keyword": "Scenario",
              "type": "scenario",
              "tags": [
                {
                  "name": "@blue",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "arguments": [],
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "blue",
          "retry": 0
        },
        {
          "id": "purple",
          "name": "Purple",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/parallel/purple.feature",
          "elements": [
            {
              "name": "Purple",
              "id": "purple;purple",
              "line": 4,
              "keyword": "Scenario",
              "type": "scenario",
              "tags": [
                {
                  "name": "@blue",
                  "line": 3
                },
                {
                  "name": "@red",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "arguments": [],
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "red",
          "retry": 0
        },
        {
          "id": "purple",
          "name": "Purple",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/parallel/purple.feature",
          "elements": [
            {
              "name": "Purple",
              "id": "purple;purple",
              "line": 4,
              "keyword": "Scenario",
              "type": "scenario",
              "tags": [
                {
                  "name": "@blue",
                  "line": 3
                },
                {
                  "name": "@red",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "arguments": [],
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "blue",
          "retry": 0
        },
        {
          "id": "red",
          "name": "Red",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/parallel/red.feature",
          "elements": [
            {
              "name": "Red",
              "id": "red;red",
              "line": 4,
              "keyword": "Scenario",
              "type": "scenario",
              "tags": [
                {
                  "name": "@red",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "arguments": [],
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "red",
          "retry": 0
        }
      ]
      """
    And stderr should be empty

  Scenario: Parallel, combining tags with ANDs and ORs
    Given the 'parallel' features
    And a profile called 'purple'
    And the 'purple' profile has the tag '@blue'
    And the 'purple' profile has the tag '@red'
    And a profile called 'red'
    And the 'red' profile has the tag '@red'
    And the 'red' profile has the tag '~@blue'
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "purple",
          "name": "Purple",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/parallel/purple.feature",
          "elements": [
            {
              "name": "Purple",
              "id": "purple;purple",
              "line": 4,
              "keyword": "Scenario",
              "type": "scenario",
              "tags": [
                {
                  "name": "@blue",
                  "line": 3
                },
                {
                  "name": "@red",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "arguments": [],
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "purple",
          "retry": 0
        },
        {
          "id": "red",
          "name": "Red",
          "tags": [],
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/parallel/red.feature",
          "elements": [
            {
              "name": "Red",
              "id": "red;red",
              "line": 4,
              "keyword": "Scenario",
              "type": "scenario",
              "tags": [
                {
                  "name": "@red",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "arguments": [],
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "red",
          "retry": 0
        }
      ]
      """
    And stderr should be empty
