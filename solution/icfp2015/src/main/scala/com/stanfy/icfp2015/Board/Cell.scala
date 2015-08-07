package com.stanfy.icfp2015.Board

import org.json4s.native.JsonMethods._

/**
 * Created by hdf on 07.08.15.
 */
class Cell(val json:String) {
  val parsedJson = parse(json)

  val x = parsedJson \ "x"
  val y = parsedJson \ "y"
}
