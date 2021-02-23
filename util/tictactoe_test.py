from tictactoe import *
import unittest


class TestTicTacToeMethods(unittest.TestCase):

    def test_transpose(self):
        self.assertEqual(
            transpose([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ]), [
                [1, 4, 7],
                [2, 5, 8],
                [3, 6, 9]
            ])

    def test_check_rows(self):
        self.assertEqual(check_rows([
            ['X', 'X', 'X'],
            ['X', 'O', 'O'],
            ['O', 'X', 'O']
        ]), 'X')
        self.assertEqual(check_rows([
            ['X', 'O', 'O'],
            ['X', 'X', 'X'],
            ['O', 'X', 'O']
        ]), 'X')
        self.assertEqual(check_rows([
            ['X', 'O', 'O'],
            ['O', 'O', 'X'],
            ['X', 'X', 'X'],
        ]), 'X')
        self.assertIsNone(check_rows([
            ['X', 'O', 'O'],
            ['O', 'X', 'O'],
            ['O', 'X', 'X']
        ]))  # this should be none, since it's only checking rows
        self.assertIsNone(check_rows([
            ['X', 'O', 'O'],
            ['O', 'X', 'O'],
            ['X', 'O', 'X']
        ]))  # this should be none, since it's only checking rows
        self.assertEqual(check_rows([
            ['O', 'O', 'O'],
            ['O', 'X', 'X'],
            ['X', 'O', 'X']
        ]), 'O')
        self.assertEqual(check_rows([
            ['O', 'X', 'X'],
            ['O', 'O', 'O'],
            ['X', 'O', 'X']
        ]), 'O')
        self.assertEqual(check_rows([
            ['O', 'X', 'X'],
            ['X', 'X', 'O'],
            ['O', 'O', 'O'],
        ]), 'O')
        self.assertIsNone(check_rows([
            ['O', 'X', 'X'],
            ['X', 'O', 'X'],
            ['X', 'O', 'O']
        ]))  # this should be none, since it's only checking rows
        self.assertIsNone(check_rows([
            ['O', 'X', 'X'],
            ['O', 'O', 'X'],
            ['O', 'X', 'O']
        ]))  # this should be none, since it's only checking rows

    def test_check_rows(self):
        self.assertIsNone(check_diagonals([
            ['X', 'X', 'X'],
            ['X', 'O', 'O'],
            ['O', 'X', 'O']
        ]))  # this should be none, since it's only checking rows
        self.assertIsNone(check_diagonals([
            ['X', 'O', 'O'],
            ['X', 'X', 'X'],
            ['O', 'X', 'O']
        ]))  # this should be none, since it's only checking rows
        self.assertIsNone(check_diagonals([
            ['X', 'O', 'O'],
            ['O', 'O', 'X'],
            ['X', 'X', 'X'],
        ]))  # this should be none, since it's only checking rows
        self.assertEqual(check_diagonals([
            ['X', 'O', 'O'],
            ['O', 'X', 'O'],
            ['O', 'X', 'X']
        ]), 'X')
        self.assertEqual(check_diagonals([
            ['X', 'O', 'O'],
            ['X', 'X', 'O'],
            ['O', 'O', 'X']
        ]), 'X')
        self.assertIsNone(check_diagonals([
            ['O', 'O', 'O'],
            ['O', 'X', 'X'],
            ['X', 'O', 'X']
        ]))  # this should be none, since it's only checking rows
        self.assertIsNone(check_diagonals([
            ['O', 'X', 'X'],
            ['O', 'O', 'O'],
            ['X', 'O', 'X']
        ]))  # this should be none, since it's only checking rows
        self.assertIsNone(check_diagonals([
            ['O', 'X', 'X'],
            ['X', 'X', 'O'],
            ['O', 'O', 'O'],
        ]))  # this should be none, since it's only checking rows
        self.assertEqual(check_diagonals([
            ['O', 'X', 'X'],
            ['X', 'O', 'X'],
            ['X', 'O', 'O']
        ]), 'O')
        self.assertEqual(check_diagonals([
            ['O', 'X', 'X'],
            ['O', 'O', 'X'],
            ['O', 'X', 'O']
        ]), 'O')

    def test_check_win(self):
        self.assertEqual(check_win([
            ['X', 'X', 'X'],
            ['X', 'O', 'O'],
            ['O', 'X', 'O']
        ]), 'X')
        self.assertEqual(check_win([
            ['X', 'O', 'O'],
            ['X', 'X', 'X'],
            ['O', 'X', 'O']
        ]), 'X')
        self.assertEqual(check_win([
            ['X', 'O', 'O'],
            ['O', 'O', 'X'],
            ['X', 'X', 'X'],
        ]), 'X')
        self.assertEqual(check_win([
            ['X', 'O', 'O'],
            ['O', 'X', 'O'],
            ['O', 'X', 'X']
        ]), 'X')
        self.assertEqual(check_win([
            ['X', 'O', 'O'],
            ['X', 'X', 'O'],
            ['X', 'O', 'X']
        ]), 'X')
        self.assertEqual(check_win([
            ['O', 'O', 'O'],
            ['O', 'X', 'X'],
            ['X', 'O', 'X']
        ]), 'O')
        self.assertEqual(check_win([
            ['O', 'X', 'X'],
            ['O', 'O', 'O'],
            ['X', 'O', 'X']
        ]), 'O')
        self.assertEqual(check_win([
            ['O', 'X', 'X'],
            ['X', 'X', 'O'],
            ['O', 'O', 'O'],
        ]), 'O')
        self.assertEqual(check_win([
            ['O', 'X', 'X'],
            ['X', 'O', 'X'],
            ['X', 'O', 'O']
        ]), 'O')
        self.assertEqual(check_win([
            ['O', 'X', 'X'],
            ['O', 'O', 'X'],
            ['O', 'X', 'O']
        ]), 'O')


if __name__ == '__main__':
    unittest.main()
