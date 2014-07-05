Feature: Parallel

  Scenario: Parallel
    Given a profile called 'blue'
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
          "id": "Blue",
          "name": "Blue",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/colours/blue.feature",
          "elements": [
            {
              "name": "Blue",
              "id": "Blue;blue",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@blue",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "blue"
        },
        {
          "id": "Purple",
          "name": "Purple",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/colours/purple.feature",
          "elements": [
            {
              "name": "Purple",
              "id": "Purple;purple",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
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
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "red"
        },
        {
          "id": "Purple",
          "name": "Purple",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/colours/purple.feature",
          "elements": [
            {
              "name": "Purple",
              "id": "Purple;purple",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
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
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "blue"
        },
        {
          "id": "Red",
          "name": "Red",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/colours/red.feature",
          "elements": [
            {
              "name": "Red",
              "id": "Red;red",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@red",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "red"
        }
      ]
      """
    And stderr should be empty

  Scenario: Parallel, combining tags with ANDs and ORs
    Given a profile called 'purple'
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
          "id": "Purple",
          "name": "Purple",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/colours/purple.feature",
          "elements": [
            {
              "name": "Purple",
              "id": "Purple;purple",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
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
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "purple"
        },
        {
          "id": "Red",
          "name": "Red",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/colours/red.feature",
          "elements": [
            {
              "name": "Red",
              "id": "Red;red",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@red",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "a passing action is executed",
                  "line": 5,
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
          "profile": "red"
        }
      ]
      """
    And stderr should be empty
