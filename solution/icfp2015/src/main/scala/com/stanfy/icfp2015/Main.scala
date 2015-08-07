package com.stanfy.icfp2015

import com.stanfy.icfp2015.Board.Board
import org.json4s.DefaultFormats
import org.json4s.jackson.JsonMethods._


/**
 * Created by hdf on 07.08.15.
 */

object Main {
  def main(args: Array[String]): Unit = {

    implicit val formats = DefaultFormats
    val board = parse(TestData.testJson).extract[Board]

    println("Board id = " + board.id)
    println("Board width = " +  board.width)
    println("Board height = " + board.height)
    println("Board sourceLength = " + board.sourceLength)
    println("Board sourceSeeds = " + board.sourceSeeds)

    println("Board cells = " + board.filled)
    println("Board units = " + board.units)
  }
}