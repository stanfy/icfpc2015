package com.stanfy.icfp2015

import com.stanfy.icfp2015.Board.Board


/**
 * Created by hdf on 07.08.15.
 */

object Main {
  def main(args: Array[String]): Unit = {

    val testData = TestData
    val board = new Board(testData.testJson)

    println("Board id = " + board.id)
    println("Board width = " +  board.width)
    println("Board height = " + board.height)
    println("Board sourceLength = " + board.sourceLength)
    println("Board sourceSeeds = " + board.sourceSeeds)


    println("Board cells = " + board.filledCells)
    println("Board units = " + board.units)
  }
}