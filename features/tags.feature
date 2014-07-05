Feature: Tags

  Scenario: Tags
    Given the 'tags' feature
    And the '@tag-1' tag
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Tags",
          "name": "Tags",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/tags.feature",
          "elements": [
            {
              "name": "Tagged",
              "id": "Tags;tagged",
              "line": 4,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@tag-1",
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
          "profile": "default"
        }
      ]
      """
    And stderr should be empty

  Scenario: Tags, combining tags with ANDs
    Given the 'tags' feature
    And the '@tag-1' tag
    And the '@tag-2' tag
    And a 'json' formatter
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stdout should contain JSON matching:
    """
      [
        {
          "id": "Tags",
          "name": "Tags",
          "description": "",
          "line": 1,
          "keyword": "Feature",
          "uri": "{uri}/features/tags.feature",
          "elements": [
            {
              "name": "Tagged twice",
              "id": "Tags;tagged-twice",
              "line": 8,
              "keyword": "Scenario",
              "description": "",
              "type": "scenario",
              "tags": [
                {
                  "name": "@tag-2",
                  "line": 7
                },
                {
                  "name": "@tag-3",
                  "line": 7
                }
              ],
              "steps": [
                {
                  "name": "a passing action is executed",
                  "line": 9,
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
          "profile": "default"
        }
      ]
      """
    And stderr should be empty
    