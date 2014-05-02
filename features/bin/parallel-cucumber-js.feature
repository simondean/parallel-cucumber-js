Feature: The parallel-cucumber-js bin

  Scenario: Passing
    Given the '@passing' tag
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And the stdout should contain JSON matching:
      """
      [
        {
          "id": "Passing",
          "name": "Passing",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/passing.feature",
          "elements": [
            {
              "name": "Passing",
              "id": "Passing;passing",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@passing",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "a passing pre-condition",
                  "line": 5,
                  "keyword": "Given ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                },
                {
                  "name": "a passing action is executed",
                  "line": 6,
                  "keyword": "When ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                },
                {
                  "name": "a post-condition passes",
                  "line": 7,
                  "keyword": "Then ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default"
        }
      ]
      """

  Scenario: Failing
    Given the '@failing' tag
    When executing the parallel-cucumber-js bin
    Then the exit code should be '1'
    And the stdout should contain JSON matching:
      """
      [
        {
          "id": "Failing",
          "name": "Failing",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/failing.feature",
          "elements": [
            {
              "name": "Failing",
              "id": "Failing;failing",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@failing",
                  "line": 3
                }
              ],
              "steps": [
                {
                  "name": "a passing pre-condition",
                  "line": 5,
                  "keyword": "Given ",
                  "result": {
                    "duration": "{duration}",
                    "status": "passed"
                  },
                  "match": {}
                },
                {
                  "name": "a failing action is executed",
                  "line": 6,
                  "keyword": "When ",
                  "result": {
                    "error_message": "Failed",
                    "duration": "{duration}",
                    "status": "failed"
                  },
                  "match": {}
                },
                {
                  "name": "a post-condition passes",
                  "line": 7,
                  "keyword": "Then ",
                  "result": {
                    "status": "skipped"
                  },
                  "match": {}
                }
              ]
            }
          ],
          "profile": "default"
        }
      ]
      """

  Scenario: Empty
    Given the '@does-not-exist' tag
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And the stdout should contain JSON matching:
    """
      [
      ]
      """

  Scenario: Parallel
    Given a profile called 'blue'
    And the 'blue' profile has the tag '@blue'
    And a profile called 'red'
    And the 'red' profile has the tag '@red'
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And the stdout should contain JSON matching:
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

  Scenario: Parallel config
    Given a config file containing:
    """
      module.exports = {
        profiles: {
          blue: {
            tags: ['@blue']
          },
          red: {
            tags: ['@red']
          }
        }
      };
      """
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And the stdout should contain JSON matching:
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
