package com.stanfy.icfp2015.Board

import org.json4s._
import org.json4s.native.JsonMethods._

/**
 * Created by hdf on 07.08.15.
 */

class Board(val input:String) {

  val parsedJson = parse(input)

  val id = parsedJson \ "id"

  val width = parsedJson \ "width"
  val height = parsedJson \ "height"
  val sourceLength = parsedJson \ "sourceLength"
  val sourceSeeds = parsedJson \ "sourceSeeds"

  //
  val units = parsedJson \ "units"
  val filledCells = parsedJson \ "filled"
}
