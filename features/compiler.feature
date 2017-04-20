Feature: Compiler

Scenario: Compiler
    Given the 'passing' feature
    And a 'json' formatter
    And 'js:babel-register' compiler is set
    When executing the parallel-cucumber-js bin
    Then the exit code should be '0'
    And stderr should contain text:
    """
    Cannot find module 'babel-register'
    """
